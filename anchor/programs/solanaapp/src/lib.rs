#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod solanaapp {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanaapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaapp.count = ctx.accounts.solanaapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaapp.count = ctx.accounts.solanaapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanaapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solanaapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanaapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solanaapp::INIT_SPACE,
  payer = payer
  )]
  pub solanaapp: Account<'info, Solanaapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanaapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solanaapp: Account<'info, Solanaapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solanaapp: Account<'info, Solanaapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Solanaapp {
  count: u8,
}
