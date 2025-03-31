use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount},
    associated_token::AssociatedToken,
};
use crate::state::*;
use crate::error::TikcoinError;

#[derive(Accounts)]
#[instruction(
    base_price: u64,
    slope: u64,
    reserve_ratio: u8,
    fee_percentage: u16,
    creator_fee: u16,
    platform_fee: u16,
    token_name: String,
    token_symbol: String,
    bump: u8
)]
pub struct CreateCreatorToken<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        init,
        payer = creator,
        space = CreatorToken::LEN,
        seeds = [b"creator-token", creator.key().as_ref()],
        bump,
    )]
    pub creator_token: Account<'info, CreatorToken>,
    
    #[account(
        init,
        payer = creator,
        mint::decimals = 9,
        mint::authority = creator_token,
    )]
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = creator,
        token::mint = token_mint,
        token::authority = creator_token,
    )]
    pub reserve_vault: Account<'info, TokenAccount>,
    
    /// CHECK: This is the PDA that will get token metadata write permission
    #[account(
        seeds = [b"metadata", token_metadata_program.key().as_ref(), token_mint.key().as_ref()],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,
    
    /// CHECK: The official Metaplex Metadata program
    pub token_metadata_program: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> CreateCreatorToken<'info> {
    pub fn create_token(
        &mut self,
        ctx: Context<CreateCreatorToken>,
        base_price: u64,
        slope: u64,
        reserve_ratio: u8,
        fee_percentage: u16,
        creator_fee: u16,
        platform_fee: u16,
        token_name: String,
        token_symbol: String,
        bump: u8,
    ) -> Result<()> {
        // Validate input parameters
        if reserve_ratio > 100 {
            return Err(error!(TikcoinError::InvalidCurveParameters));
        }
        
        if fee_percentage > 1000 { // Max 10% total fee
            return Err(error!(TikcoinError::InvalidFeePercentage));
        }
        
        if creator_fee + platform_fee > fee_percentage {
            return Err(error!(TikcoinError::InvalidFeePercentage));
        }
        
        if token_name.len() > 32 || token_symbol.len() > 10 {
            return Err(error!(TikcoinError::InvalidTokenMetadata));
        }
        
        // Initialize the creator token account
        let creator_token = &mut self.creator_token;
        creator_token.creator = self.creator.key();
        creator_token.token_mint = self.token_mint.key();
        creator_token.reserve_vault = self.reserve_vault.key();
        creator_token.total_supply = 0;
        creator_token.reserve_balance = 0;
        creator_token.base_price = base_price;
        creator_token.slope = slope;
        creator_token.reserve_ratio = reserve_ratio;
        creator_token.fee_percentage = fee_percentage;
        creator_token.creator_fee = creator_fee;
        creator_token.platform_fee = platform_fee;
        creator_token.created_at = Clock::get()?.unix_timestamp;
        creator_token.authority = self.creator.key();
        creator_token.bump = bump;
        
        // Create token metadata 
        // For production, we should actually call the Metaplex program
        // to create metadata with token_name and token_symbol
        
        Ok(())
    }
}

