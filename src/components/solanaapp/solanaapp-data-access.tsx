'use client'

import { getSolanaappProgram, getSolanaappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSolanaappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanaappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolanaappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['solanaapp', 'all', { cluster }],
    queryFn: () => program.account.solanaapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['solanaapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ solanaapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSolanaappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolanaappProgram()

  const accountQuery = useQuery({
    queryKey: ['solanaapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.solanaapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['solanaapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ solanaapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['solanaapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ solanaapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['solanaapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ solanaapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['solanaapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ solanaapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
