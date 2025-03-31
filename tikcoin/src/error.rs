use anchor_lang::prelude::*;

#[error_code]
pub enum TikcoinError {
    #[msg("Math operation overflow")]
    MathOverflow,
    
    #[msg("Invalid amount provided")]
    InvalidAmount,
    
    #[msg("Insufficient funds for transaction")]
    InsufficientFunds,
    
    #[msg("Price calculation error")]
    PriceCalculationError,
    
    #[msg("Invalid bonding curve parameters")]
    InvalidCurveParameters,
    
    #[msg("Token mint mismatch")]
    TokenMintMismatch,
    
    #[msg("Reserve vault mismatch")]
    ReserveVaultMismatch,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Max price exceeded")]
    MaxPriceExceeded,
    
    #[msg("Min price not met")]
    MinPriceNotMet,
    
    #[msg("Invalid fee percentage")]
    InvalidFeePercentage,
    
    #[msg("Total supply exceeded limit")]
    TotalSupplyLimitExceeded,
    
    #[msg("Reserve ratio constraint violated")]
    ReserveRatioViolation,
    
    #[msg("Invalid token metadata")]
    InvalidTokenMetadata,
    
    #[msg("Creator token already exists")]
    CreatorTokenAlreadyExists,
    
    #[msg("User already registered")]
    UserAlreadyRegistered,
    
    #[msg("User not registered")]
    UserNotRegistered,
    
    #[msg("User has no tokens to sell")]
    NoTokensToSell,
    
    #[msg("Token operation failed")]
    TokenOperationFailed,
    
    #[msg("Reserve calculation failed")]
    ReserveCalculationError,
}

