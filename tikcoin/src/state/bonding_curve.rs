use anchor_lang::prelude::*;
use crate::error::TikcoinError;

/// Utility functions for bonding curve calculations
/// Implements linear bonding curve: price = base_price + (slope * supply)
pub struct BondingCurve;

impl BondingCurve {
    /// Calculate the price for a single token at the current supply level
    pub fn get_current_price(base_price: u64, slope: u64, supply: u64) -> Result<u64> {
        // For linear curve: price = base_price + (slope * supply)
        base_price.checked_add(
            slope.checked_mul(supply)
                .ok_or(TikcoinError::MathOverflow)?
        ).ok_or(TikcoinError::MathOverflow.into())
    }
    
    /// Calculate the total cost to buy a specified amount of tokens
    pub fn get_buy_price(
        base_price: u64, 
        slope: u64, 
        current_supply: u64, 
        amount: u64
    ) -> Result<u64> {
        if amount == 0 {
            return Ok(0);
        }
        
        // For linear curve, the integral gives us:
        // total_cost = amount * base_price + slope * (current_supply * amount + amount * (amount - 1) / 2)
        let base_cost = amount
            .checked_mul(base_price)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let supply_component = current_supply
            .checked_mul(amount)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let amount_component = amount
            .checked_sub(1)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_mul(amount)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_div(2)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let curve_component = supply_component
            .checked_add(amount_component)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_mul(slope)
            .ok_or(TikcoinError::MathOverflow)?;
            
        base_cost
            .checked_add(curve_component)
            .ok_or(TikcoinError::MathOverflow.into())
    }
    
    /// Calculate the amount received from selling a specified amount of tokens
    pub fn get_sell_price(
        base_price: u64, 
        slope: u64, 
        current_supply: u64, 
        amount: u64
    ) -> Result<u64> {
        if amount == 0 {
            return Ok(0);
        }
        
        if amount > current_supply {
            return Err(TikcoinError::InvalidAmount.into());
        }
        
        // The sell price is calculated similarly to buy price but reversed
        // We're moving from current_supply down to (current_supply - amount)
        let new_supply = current_supply
            .checked_sub(amount)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let base_return = amount
            .checked_mul(base_price)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let supply_component = new_supply
            .checked_mul(amount)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let amount_component = amount
            .checked_sub(1)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_mul(amount)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_div(2)
            .ok_or(TikcoinError::MathOverflow)?;
            
        let curve_component = supply_component
            .checked_add(amount_component)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_mul(slope)
            .ok_or(TikcoinError::MathOverflow)?;
            
        base_return
            .checked_add(curve_component)
            .ok_or(TikcoinError::MathOverflow.into())
    }
    
    /// Calculate fees based on the amount and fee percentage (in basis points)
    pub fn calculate_fee(amount: u64, fee_bps: u16) -> Result<u64> {
        let fee_percentage = fee_bps as u64;
        
        amount
            .checked_mul(fee_percentage)
            .ok_or(TikcoinError::MathOverflow)?
            .checked_div(10_000) // Convert basis points (1/100 of 1%) to actual percentage
            .ok_or(TikcoinError::MathOverflow.into())
    }
}

