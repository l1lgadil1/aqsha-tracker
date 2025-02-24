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
  createTransaction: (state: TransactionState & { note?: string }) => Promise<TypeTransaction>;
  getTransactionsByAccount: (accountId: string) => Promise<TypeTransaction[]>;
  getTransactionsByCategory: (categoryId: string) => Promise<TypeTransaction[]>;
  resetTransactions: () => Promise<void>;
}

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
      throw error;
    }
  },

  createTransaction: async (state: TransactionState & { note?: string }) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create the transaction
      const newTransaction = await transactionsService.createTransaction(state);
      const convertedTransaction = convertServiceTransaction(newTransaction);
      
      // Update transactions store
      const currentTransactions = get().transactions;
      const updatedTransactions = [...currentTransactions, convertedTransaction];
      set({ transactions: updatedTransactions, isLoading: false });
      
      // Update accounts store
      const accountsStore = useAccountsStore.getState();
      await accountsStore.fetchAccounts();
      
      return convertedTransaction;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getTransactionsByAccount: async (accountId: string) => {
    try {
      set({ isLoading: true, error: null });
      const serviceTransactions = await transactionsService.getTransactionsByAccount(accountId);
      const transactions = serviceTransactions.map(convertServiceTransaction);
      set({ transactions, isLoading: false });
      return transactions;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getTransactionsByCategory: async (categoryId: string) => {
    try {
      set({ isLoading: true, error: null });
      const serviceTransactions = await transactionsService.getTransactionsByCategory(categoryId);
      const transactions = serviceTransactions.map(convertServiceTransaction);
      set({ transactions, isLoading: false });
      return transactions;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  resetTransactions: async () => {
    try {
      set({ isLoading: true, error: null });
      await transactionsService.resetTransactions();
      set({ transactions: [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
})); 