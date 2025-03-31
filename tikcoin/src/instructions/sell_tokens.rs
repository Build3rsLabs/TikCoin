use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, Burn, Transfer},
    associated_token::AssociatedToken,
};
use crate::{state::*, error::TikcoinError};

#[derive(Accounts)]
pub struct SellTokens<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"creator-token", creator_token.creator.as_ref()],
        bump = creator_token.bump,
    )]
    pub creator_token: Account<'info, CreatorToken>,
    
    /// CHECK: The creator of the token who receives fees
    #[account(
        mut,
        address = creator_token.creator,
    )]
    pub creator: AccountInfo<'info>,
    
    /// CHECK: Platform fee receiver account
    #[account(mut)]
    pub platform_fee_account: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = token_mint.key() == creator_token.token_mint,
    )]
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        constraint = reserve_vault.key() == creator_token.reserve_vault,
        constraint = reserve_vault.mint == token_mint.key(),
        constraint = reserve_vault.owner == creator_token.key(),
    )]
    pub reserve_vault: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"user-profile", seller.key().as_ref()],
        bump = user_profile.bump,
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        mut,
        seeds = [b"user-holding", seller.key().as_ref(), creator_token.key().as_ref()],
        bump = user_holding.bump,
    )]
    pub user_holding: Account<'info, UserHolding>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> SellTokens<'info> {
    pub fn process_sell(
        &mut self,
        ctx: Context<SellTokens>,
        amount: u64,
        min_price: u64,
    ) -> Result<()> {
        if amount == 0 {
            return Err(TikcoinError::InvalidAmount.into());
        }
        
        let creator_token = &mut self.creator_token;
        
        // Verify the user has enough tokens to sell
        if self.seller_token_account.amount < amount {
            return Err(TikcoinError::InsufficientFunds.into());
        }
        
        // Calculate the price for selling the tokens using the bonding curve
        let sell_price = BondingCurve::get_sell_price(
            creator_token.base_price,
            creator_token.slope,
            creator_token.total_supply,
            amount,
        )?;
        
        // Verify the price meets the seller's minimum expected price
        if sell_price < min_price {
            return Err(TikcoinError::PriceCalculationError.into());
        }
        
        // Calculate fees
        let total_fee = BondingCurve::calculate_fee(
            sell_price,
            creator_token.fee_percentage,
        )?;
        
        let creator_fee = BondingCurve::calculate_fee(
            sell_price,
            creator_token.creator_fee,
        )?;
        
        let platform_fee = BondingCurve::calculate_fee(
            sell_price,
            creator_token.platform_fee,
        )?;
        
        // Calculate amount going to seller after fees
        let seller_amount = sell_price
            .checked_sub(total_fee)
            .ok_or(TikcoinError::MathOverflow)?;
        
        // Verify the reserve has enough balance
        if creator_token.reserve_balance < sell_price {
            return Err(TikcoinError::InsufficientFunds.into());
        }
        
        // Burn the tokens first
        let burn_accounts = Burn {
            mint: self.token_mint.to_account_info(),
            from: self.seller_token_account.to_account_info(),
            authority: self.seller.to_account_info(),
        };
        
        let burn_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            burn_accounts,
        );
        
        token::burn(burn_ctx, amount)?;
        
        // Transfer SOL from reserve to seller
        let seeds = &[
            b"creator-token".as_ref(),
            creator_token.creator.as_ref(),
            &[creator_token.bump],
        ];
        let signer = &[&seeds[..]];
        
        // Transfer to seller
        if seller_amount > 0 {
            let ix = anchor_lang::solana_program::system_instruction::transfer(
                &self.reserve_vault.key(),
                &self.seller.key(),
                seller_amount,
            );
            
            anchor_lang::solana_program::program::invoke_signed(
                &ix,
                &[
                    self.reserve_vault.to_account_info(),
                    self.seller.to_account_info(),
                    self.system_program.to_account_info(),
                ],
                signer,
            )?;
        }
        
        // Transfer creator fee
        if creator_fee > 0 {
            let ix = anchor_lang::solana_program::system_instruction::transfer(
                &self.reserve_vault.key(),
                &self.creator.key(),
                creator_fee,
            );
            
            anchor_lang::solana_program::program::invoke_signed(
                &ix,
                &[
                    self.reserve_vault.to_account_info(),
                    self.creator.to_account_info(),
                    self.system_program.to_account_info(),
                ],
                signer,
            )?;
        }
        
        // Transfer platform fee
        if platform_fee > 0 {
            let ix = anchor_lang::solana_program::system_instruction::transfer(
                &self.reserve_vault.key(),
                &self.platform_fee_account.key(),
                platform_fee,
            );
            
            anchor_lang::solana_program::program::invoke_signed(
                &ix,
                &[
                    self.reserve_vault.to_account_info(),
                    self.platform_fee_account.to_account_info(),
                    self.system_program.to_account_info(),
                ],
                signer,
            )?;
        }
        
        // Update creator token state
        creator_token.total_supply = creator_token.total_supply
            .checked_sub(amount)
            .ok_or(TikcoinError::MathOverflow)?;
            
        creator_token.reserve_balance = creator_token.reserve_balance
            .checked_sub(sell_price)
            .ok_or(TikcoinError::MathOverflow)?;
        
        // Update user profile
        let user_profile = &mut self.user_profile;
        user_profile.total_value = if user_profile.total_value > sell_price {
            user_profile.total_value
                .checked_sub(sell_price)
                .ok_or(TikcoinError::MathOverflow)?
        } else {
            0 // Avoid underflow
        };
        
        user_profile.last_activity = Clock::get()?.unix_timestamp;
        
        // Update user holding
        let user_holding = &mut self.user_holding;
        user_holding.amount = user_holding.amount
            .checked_sub(amount)
            .ok_or(TikcoinError::MathOverflow)?;
            
        // If user sold all their tokens, decrement token_count in profile
        if user_holding.amount == 0 && user_profile.token_count > 0 {
            user_profile.token_count = user_profile.token_count
                .checked_sub(1)
                .ok_or(TikcoinError::MathOverflow)?;
        }
        
        Ok(())
    }
}

