use anchor_lang::prelude::*;
use crate::error::TikcoinError;

// Bonding curve functions for token price calculations
pub struct BondingCurve;

impl BondingCurve {
    // Calculate token price based on linear bonding curve formula:
    // price = base_price + slope * supply
    pub fn calculate_price(base_price: u64, slope: u64, supply: u64) -> Result<u64> {
        base_price.checked_add(
            slope.checked_mul(supply)
                .ok_or(error!(TikcoinError::MathOverflow))?
        ).ok_or(error!(TikcoinError::MathOverflow))
    }

    // Calculate the cost to buy a specific amount of tokens
    pub fn calculate_buy_cost(base_price: u64, slope: u64, supply: u64, amount: u64) -> Result<u64> {
        // For linear curve, cost = amount * avg_price
        // avg_price = current_price + (amount * slope / 2)
        let current_price = Self::calculate_price(base_price, slope, supply)?;
        
        let price_increase = slope.checked_mul(amount)
            .ok_or(error!(TikcoinError::MathOverflow))?
            .checked_div(2)
            .ok_or(error!(TikcoinError::MathOverflow))?;
            
        let avg_price = current_price.checked_add(price_increase)
            .ok_or(error!(TikcoinError::MathOverflow))?;
            
        avg_price.checked_mul(amount)
            .ok_or(error!(TikcoinError::MathOverflow))
    }

    // Calculate the amount received when selling tokens
    pub fn calculate_sell_return(base_price: u64, slope: u64, supply: u64, amount: u64) -> Result<u64> {
        if amount > supply {
            return Err(error!(TikcoinError::InvalidAmount));
        }
        
        // For linear curve, return = amount * avg_price
        // avg_price = current_price - (amount * slope / 2)
        let current_price = Self::calculate_price(base_price, slope, supply)?;
        
        let price_decrease = slope.checked_mul(amount)
            .ok_or(error!(TikcoinError::MathOverflow))?
            .checked_div(2)
            .ok_or(error!(TikcoinError::MathOverflow))?;
            
        if price_decrease >= current_price {
            // Ensure the price doesn't go below base_price / 2
            return base_price.checked_div(2)
                .ok_or(error!(TikcoinError::MathOverflow))?
                .checked_mul(amount)
                .ok_or(error!(TikcoinError::MathOverflow));
        }
        
        let avg_price = current_price.checked_sub(price_decrease)
            .ok_or(error!(TikcoinError::MathOverflow))?;
            
        avg_price.checked_mul(amount)
            .ok_or(error!(TikcoinError::MathOverflow))
    }

    // Calculate fees based on amount and fee percentage (in basis points)
    pub fn calculate_fee(amount: u64, fee_percentage: u16) -> Result<u64> {
        if fee_percentage > 10000 { // Max 100%
            return Err(error!(TikcoinError::InvalidFeePercentage));
        }
        
        let fee_numerator = amount.checked_mul(fee_percentage as u64)
            .ok_or(error!(TikcoinError::MathOverflow))?;
            
        fee_numerator.checked_div(10000)
            .ok_or(error!(TikcoinError::MathOverflow))
    }
}

