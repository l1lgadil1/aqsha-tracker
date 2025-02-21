import { StateCreator, create } from 'zustand';
import { Transaction as TypeTransaction, TransactionState } from '../types/transaction';
import { transactionsService } from '../services/transactions';
import { useAccountsStore } from './accounts-store';
import { Transaction as ServiceTransaction } from '../services/transactions';

interface TransactionsState {
  transactions: TypeTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: () => Promise<void>;
  createTransaction: (state: TransactionState & { note?: string }) => Promise<void>;
  getTransactionsByAccount: (accountId: string) => Promise<void>;
  getTransactionsByCategory: (categoryId: string) => Promise<void>;
}

type TransactionsStore = StateCreator<TransactionsState>;

// Helper function to convert service transaction to type transaction
const convertServiceTransaction = (transaction: ServiceTransaction): TypeTransaction => {
  return {
    ...transaction,
    sourceAccount: transaction.sourceAccount && 'balance' in transaction.sourceAccount ? transaction.sourceAccount : null,
    destinationAccount: transaction.destinationAccount && 'balance' in transaction.destinationAccount ? transaction.destinationAccount : null,
  };
};

export const useTransactionsStore = create<TransactionsState>((set, get): TransactionsState => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ isLoading: true, error: null });
      const serviceTransactions = await transactionsService.getTransactions();
      const transactions = serviceTransactions.map(convertServiceTransaction);
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTransaction: async (state: TransactionState & { note?: string }) => {
    try {
      set({ isLoading: true, error: null });
      await transactionsService.createTransaction(state);
      
      // Refresh both transactions and accounts since balances are affected
      await get().fetchTransactions();
      await useAccountsStore.getState().fetchAccounts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getTransactionsByAccount: async (accountId: string) => {
    try {
      set({ isLoading: true, error: null });
      const serviceTransactions = await transactionsService.getTransactionsByAccount(accountId);
      const transactions = serviceTransactions.map(convertServiceTransaction);
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getTransactionsByCategory: async (categoryId: string) => {
    try {
      set({ isLoading: true, error: null });
      const serviceTransactions = await transactionsService.getTransactionsByCategory(categoryId);
      const transactions = serviceTransactions.map(convertServiceTransaction);
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
})); 