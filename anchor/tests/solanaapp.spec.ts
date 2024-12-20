import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Solanaapp} from '../target/types/solanaapp'

describe('solanaapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solanaapp as Program<Solanaapp>

  const solanaappKeypair = Keypair.generate()

  it('Initialize Solanaapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        solanaapp: solanaappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solanaappKeypair])
      .rpc()

    const currentCount = await program.account.solanaapp.fetch(solanaappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solanaapp', async () => {
    await program.methods.increment().accounts({ solanaapp: solanaappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaapp.fetch(solanaappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solanaapp Again', async () => {
    await program.methods.increment().accounts({ solanaapp: solanaappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaapp.fetch(solanaappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solanaapp', async () => {
    await program.methods.decrement().accounts({ solanaapp: solanaappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaapp.fetch(solanaappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solanaapp value', async () => {
    await program.methods.set(42).accounts({ solanaapp: solanaappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaapp.fetch(solanaappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solanaapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solanaapp: solanaappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solanaapp.fetchNullable(solanaappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
