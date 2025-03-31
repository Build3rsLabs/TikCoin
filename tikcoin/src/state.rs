use anchor_lang::prelude::*;

#[account]
pub struct CreatorToken {
    pub creator: Pubkey,            // The creator of this token
    pub token_mint: Pubkey,         // The mint address of the token
    pub reserve_vault: Pubkey,      // The vault that holds SOL reserves
    pub total_supply: u64,          // Total supply of tokens in circulation
    pub reserve_balance: u64,       // Amount of SOL in reserve
    pub base_price: u64,            // Base price for bonding curve (in lamports)
    pub slope: u64,                 // Slope for bonding curve
    pub reserve_ratio: u8,          // Reserve ratio (0-100)
    pub fee_percentage: u16,        // Total fee percentage (in basis points, max 10000)
    pub creator_fee: u16,           // Creator fee percentage (in basis points, max 10000)
    pub platform_fee: u16,          // Platform fee percentage (in basis points, max 10000)
    pub created_at: i64,            // Timestamp when token was created
    pub authority: Pubkey,          // Authority that can update token parameters
    pub bump: u8,                   // PDA bump
}

impl CreatorToken {
    pub const LEN: usize = 8 +      // discriminator
        32 +                        // creator
        32 +                        // token_mint
        32 +                        // reserve_vault 
        8 +                         // total_supply
        8 +                         // reserve_balance
        8 +                         // base_price
        8 +                         // slope
        1 +                         // reserve_ratio
        2 +                         // fee_percentage
        2 +                         // creator_fee
        2 +                         // platform_fee
        8 +                         // created_at
        32 +                        // authority
        1 +                         // bump
        64;                         // padding for future expansion
}

#[account]
pub struct UserProfile {
    pub user: Pubkey,               // The user's wallet address
    pub created_at: i64,            // Timestamp when profile was created
    pub last_active: i64,           // Timestamp of last activity
    pub holdings_count: u16,        // Number of different creator tokens held
    pub transactions_count: u32,    // Total number of transactions
    pub bump: u8,                   // PDA bump
}

impl UserProfile {
    pub const LEN: usize = 8 +      // discriminator
        32 +                        // user
        8 +                         // created_at
        8 +                         // last_active
        2 +                         // holdings_count
        4 +                         // transactions_count
        1 +                         // bump
        32;                         // padding for future expansion
}

#[account]
pub struct UserHolding {
    pub user: Pubkey,               // User who owns these tokens
    pub creator_token: Pubkey,      // Creator token account
    pub token_mint: Pubkey,         // Token mint address
    pub token_account: Pubkey,      // User's token account for this creator token
    pub amount: u64,                // Amount of tokens held
    pub cost_basis: u64,            // Total cost basis in lamports
    pub last_transaction_at: i64,   // Timestamp of last transaction
    pub bump: u8,                   // PDA bump
}

impl UserHolding {
    pub const LEN: usize = 8 +      // discriminator
        32 +                        // user
        32 +                        // creator_token
        32 +                        // token_mint
        32 +                        // token_account
        8 +                         // amount
        8 +                         // cost_basis
        8 +                         // last_transaction_at
        1 +                         // bump
        32;                         // padding for future expansion
}

#[account]
pub struct TransactionRecord {
    pub transaction_type: u8,       // 0 = buy, 1 = sell
    pub user: Pubkey,               // User who made the transaction
    pub creator: Pubkey,            // Creator of the token
    pub creator_token: Pubkey,      // Creator token account
    pub token_amount: u64,          // Amount of tokens transacted
    pub sol_amount: u64,            // Amount of SOL transacted
    pub fee_amount: u64,            // Fee amount in SOL
    pub timestamp: i64,             // Timestamp of transaction
    pub bump: u8,                   // PDA bump
}

impl TransactionRecord {
    pub const LEN: usize = 8 +      // discriminator
        1 +                         // transaction_type
        32 +                        // user
        32 +                        // creator
        32 +                        // creator_token
        8 +                         // token_amount
        8 +                         // sol_amount
        8 +                         // fee_amount
        8 +                         // timestamp
        1 +                         // bump
        32;                         // padding for future expansion
}

