use anchor_lang::prelude::*;

declare_id!("JBjTLSi2d1t45LoLYe3DusLVh6bv1JMtk1qxtoN6vnJq");

pub mod state;
pub mod error;
pub mod instructions;
pub mod bonding_curve;

use instructions::*;
use state::*;
use error::*;
use bonding_curve::*;

#[program]
pub mod tikcoin {
    use super::*;

    pub fn create_creator_token(
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
        ctx.accounts.create_token(
            ctx.clone(),
            base_price,
            slope,
            reserve_ratio,
            fee_percentage,
            creator_fee,
            platform_fee,
            token_name,
            token_symbol,
            bump,
        )
    }

    pub fn buy_tokens(
        ctx: Context<BuyTokens>,
        amount: u64,
        max_price: u64,
        user_profile_bump: u8,
        user_holding_bump: u8,
    ) -> Result<()> {
        ctx.accounts.process_buy(
            ctx.clone(),
            amount,
            max_price,
            user_profile_bump,
            user_holding_bump,
        )
    }

    pub fn sell_tokens(
        ctx: Context<SellTokens>,
        amount: u64,
        min_price: u64,
    ) -> Result<()> {
        ctx.accounts.process_sell(
            ctx.clone(),
            amount,
            min_price,
        )
    }
}

