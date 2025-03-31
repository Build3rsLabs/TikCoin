use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    // The user's wallet address
    pub user: Pubkey,
    
    // Number of different creator tokens held
    pub token_count: u16,
    
    // Total value of holdings in lamports (or smallest USDC unit)
    pub total_value: u64,
    
    // Timestamp when the profile was created
    pub created_at: i64,
    
    // Last activity timestamp
    pub last_activity: i64,
    
    // Authority that can update the profile
    pub authority: Pubkey,
    
    // Space for future upgrades
    pub bump: u8,
}

// User's holdings for a specific creator token
#[account]
pub struct UserHolding {
    // The user's wallet address
    pub user: Pubkey,
    
    // The creator token PDA
    pub creator_token: Pubkey,
    
    // Amount of tokens held
    pub amount: u64,
    
    // Timestamp of first purchase
    pub first_purchase_time: i64,
    
    // Total spent on this token (in lamports or smallest USDC unit)
    pub total_spent: u64,
    
    // Bump seed
    pub bump: u8,
}

impl UserProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // user
        2 + // token_count
        8 + // total_value
        8 + // created_at
        8 + // last_activity
        32 + // authority
        1; // bump
}

impl UserHolding {
    pub const LEN: usize = 8 + // discriminator
        32 + // user
        32 + // creator_token
        8 + // amount
        8 + // first_purchase_time
        8 + // total_spent
        1; // bump
}

