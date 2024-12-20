// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolanaappIDL from '../target/idl/solanaapp.json'
import type { Solanaapp } from '../target/types/solanaapp'

// Re-export the generated IDL and type
export { Solanaapp, SolanaappIDL }

// The programId is imported from the program IDL.
export const SOLANAAPP_PROGRAM_ID = new PublicKey(SolanaappIDL.address)

// This is a helper function to get the Solanaapp Anchor program.
export function getSolanaappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolanaappIDL, address: address ? address.toBase58() : SolanaappIDL.address } as Solanaapp, provider)
}

// This is a helper function to get the program ID for the Solanaapp program depending on the cluster.
export function getSolanaappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solanaapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLANAAPP_PROGRAM_ID
  }
}
