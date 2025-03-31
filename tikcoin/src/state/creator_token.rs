use anchor_lang::prelude::*;

#[account]
pub struct CreatorToken {
    // The creator's wallet address
    pub creator: Pubkey,
    
    // The mint for the creator's token
    pub token_mint: Pubkey,
    
    // Vault that holds the reserve currency (SOL or USDC)
    pub reserve_vault: Pubkey,
    
    // Total supply of creator tokens issued
    pub total_supply: u64,
    
    // Current reserve balance in lamports (or smallest USDC unit if we use USDC)
    pub reserve_balance: u64,
    
    // Bonding curve parameters
    // Linear formula: price = base_price + (m * supply)
    pub base_price: u64,
    pub slope: u64,
    
    // Reserve ratio (as a percentage, e.g., 50 for 50%)
    pub reserve_ratio: u8,
    
    // Fee percentage (in basis points, e.g., 250 = 2.5%)
    pub fee_percentage: u16,
    
    // Creator fee percentage (in basis points)
    pub creator_fee: u16,
    
    // Platform fee percentage (in basis points)
    pub platform_fee: u16,
    
    // Timestamp when the token was created
    pub created_at: i64,
    
    // Authority that can update the token parameters
    pub authority: Pubkey,
    
    // Space for future upgrades
    pub bump: u8,
}

impl CreatorToken {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        32 + // token_mint
        32 + // reserve_vault
        8 + // total_supply
        8 + // reserve_balance
        8 + // base_price
        8 + // slope
        1 + // reserve_ratio
        2 + // fee_percentage
        2 + // creator_fee
        2 + // platform_fee
        8 + // created_at
        32 + // authority
        1; // bump
}

