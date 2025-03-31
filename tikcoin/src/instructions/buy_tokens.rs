use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, MintTo, Transfer},
    associated_token::AssociatedToken,
};
use crate::{state::*, error::TikcoinError};

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    
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
        init_if_needed,
        payer = buyer,
        associated_token::mint = token_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        space = UserProfile::LEN,
        seeds = [b"user-profile", buyer.key().as_ref()],
        bump,
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        space = UserHolding::LEN,
        seeds = [b"user-holding", buyer.key().as_ref(), creator_token.key().as_ref()],
        bump,
    )]
    pub user_holding: Account<'info, UserHolding>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> BuyTokens<'info> {
    pub fn process_buy(
        &mut self,
        ctx: Context<BuyTokens>,
        amount: u64,
        max_price: u64,
        user_profile_bump: u8,
        user_holding_bump: u8,
    ) -> Result<()> {
        if amount == 0 {
            return Err(TikcoinError::InvalidAmount.into());
        }
        
        let creator_token = &mut self.creator_token;
        
        // Calculate the price to buy the requested amount using the bonding curve
        let buy_price = BondingCurve::get_buy_price(
            creator_token.base_price,
            creator_token.slope,
            creator_token.total_supply,
            amount,
        )?;
        
        // Verify the price is within the buyer's max price
        if buy_price > max_price {
            return Err(TikcoinError::PriceCalculationError.into());
        }
        
        // Calculate fees
        let total_fee = BondingCurve::calculate_fee(
            buy_price,
            creator_token.fee_percentage,
        )?;
        
        let creator_fee = BondingCurve::calculate_fee(
            buy_price,
            creator_token.creator_fee,
        )?;
        
        let platform_fee = BondingCurve::calculate_fee(
            buy_price,
            creator_token.platform_fee,
        )?;
        
        // Calculate amount going to reserve
        let reserve_amount = buy_price
            .checked_sub(total_fee)
            .ok_or(TikcoinError::MathOverflow)?;
        
        // Transfer SOL from buyer to various accounts
        // In production, this might use USDC or another token instead
        
        // Transfer to reserve
        if reserve_amount > 0 {
            let transfer_to_reserve_ix = anchor_lang::solana_program::system_instruction::transfer(
                &self.buyer.key(),
                &self.reserve_vault.key(),
                reserve_amount,
            );
            
            anchor_lang::solana_program::program::invoke(
                &transfer_to_reserve_ix,
                &[
                    self.buyer.to_account_info(),
                    self.reserve_vault.to_account_info(),
                    self.system_program.to_account_info(),
                ],
            )?;
        }
        
        // Transfer creator fee
        if creator_fee > 0 {
            let transfer_to_creator_ix = anchor_lang::solana_program::system_instruction::transfer(
                &self.buyer.key(),
                &self.creator.key(),
                creator_fee,
            );
            
            anchor_lang::solana_program::program::invoke(
                &transfer_to_creator_ix,
                &[
                    self.buyer.to_account_info(),
                    self.creator.to_account_info(),
                    self.system_program.to_account_info(),
                ],
            )?;
        }
        
        // Transfer platform fee
        if platform_fee > 0 {
            let transfer_to_platform_ix = anchor_lang::solana_program::system_instruction::transfer(
                &self.buyer.key(),
                &self.platform_fee_account.key(),
                platform_fee,
            );
            
            anchor_lang::solana_program::program::invoke(
                &transfer_to_platform_ix,
                &[
                    self.buyer.to_account_info(),
                    self.platform_fee_account.to_account_info(),
                    self.system_program.to_account_info(),
                ],
            )?;
        }
        
        // Mint tokens to the buyer
        let seeds = &[
            b"creator-token".as_ref(),
            creator_token.creator.as_ref(),
            &[creator_token.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = MintTo {
            mint: self.token_mint.to_account_info(),
            to: self.buyer_token_account.to_account_info(),
            authority: self.creator_token.to_account_info(),
        };
        
        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::mint_to(cpi_ctx, amount)?;
        
        // Update creator token state
        creator_token.total_supply = creator_token.total_supply
            .checked_add(amount)
            .ok_or(TikcoinError::MathOverflow)?;
            
        creator_token.reserve_balance = creator_token.reserve_balance
            .checked_add(reserve_amount)
            .ok_or(TikcoinError::MathOverflow)?;
        
        // Update user profile
        let user_profile = &mut self.user_profile;
        
        // Initialize if first purchase
        if user_profile.created_at == 0 {
            user_profile.user = self.buyer.key();
            user_profile.token_count = 1;
            user_profile.total_value = buy_price;
            user_profile.created_at = Clock::get()?.unix_timestamp;
            user_profile.last_activity = Clock::get()?.unix_timestamp;
            user_profile.authority = self.buyer.key();
            user_profile.bump = user_profile_bump;
        } else {
            // Update existing profile
            if self.user_holding.amount == 0 {
                user_profile.token_count = user_profile.token_count
                    .checked_add(1)
                    .ok_or(TikcoinError::MathOverflow)?;
            }
            
            user_profile.total_value = user_profile.total_value
                .checked_add(buy_price)
                .ok_or(TikcoinError::MathOverflow)?;
                
            user_profile.last_activity = Clock::get()?.unix_timestamp;
        }
        
        // Update user holding
        let user_holding = &mut self.user_holding;
        
        // Initialize if first purchase of this token
        if user_holding.amount == 0 {
            user_holding.user = self.buyer.key();
            user_holding.creator_token = self.creator_token.key();
            user_holding.amount = amount;
            user_holding.first_purchase_time = Clock::get()?.unix_timestamp;
            user_holding.total_spent = buy_price;
            user_holding.bump = user_holding_bump;
        } else {
            // Update existing holding
            user_holding.amount = user_holding.amount
                .checked_add(amount)
                .ok_or(TikcoinError::MathOverflow)?;
                
            user_holding.total_spent = user_holding.total_spent
                .checked_add(buy_price)
                .ok_or(TikcoinError::MathOverflow)?;
        }
        
        Ok(())
    }
}

