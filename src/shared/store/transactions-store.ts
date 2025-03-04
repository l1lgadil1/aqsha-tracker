import { StateCreator, create } from 'zustand';
import { ITransaction, TransactionType } from '../types/transaction';
import { transactionsService } from '../services/transactions';
import { useAccountsStore } from './accounts-store';
import { Transaction as ServiceTransaction } from '../services/transactions';
import { Alert } from 'react-native';

interface TransactionsState {
  transactions: ITransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTransactions: () => Promise<void>;
  createTransaction: (transaction: ITransaction) => Promise<ITransaction>;
  getTransactionsByAccount: (accountId: string) => Promise<ITransaction[]>;
  getTransactionsByCategory: (categoryId: string) => Promise<ITransaction[]>;
  resetTransactions: () => Promise<void>;
}

// Helper function to convert service transaction to type transaction
const convertServiceTransaction = (transaction: ServiceTransaction): ITransaction => {
  return {
    id: transaction.id,
    type: transaction.type as TransactionType,
    amount:
      typeof transaction.amount === 'number'
        ? { value: transaction.amount.toString(), hasDecimal: transaction.amount % 1 !== 0 }
        : transaction.amount,
    date: transaction.date,
    sourceAccount: transaction.sourceAccount,
    destinationAccount: transaction.destinationAccount,
    category: transaction.category || null,
    incomeSource: transaction.incomeSource || null,
  };
};

export const useTransactionsStore = create<TransactionsState>(
  (set, get): TransactionsState => ({
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

    createTransaction: async (transaction: ITransaction) => {
      try {
        set({ isLoading: true, error: null });

        // Validate transaction based on type
        switch (transaction.type) {
          case 'expense':
            if (!transaction.sourceAccount)
              throw new Error('Source account is required for expenses');
            if (!transaction.category) throw new Error('Category is required for expenses');
            break;
          case 'income':
            if (!transaction.destinationAccount)
              throw new Error('Destination account is required for income');
            if (!transaction.incomeSource) throw new Error('Income source is required');
            break;
          case 'transfer':
            if (!transaction.sourceAccount)
              throw new Error('Source account is required for transfers');
            if (!transaction.destinationAccount)
              throw new Error('Destination account is required for transfers');
            if (transaction.sourceAccount.id === transaction.destinationAccount.id) {
              throw new Error('Source and destination accounts must be different');
            }
            break;
          default:
            throw new Error('Invalid transaction type');
        }

        // Create the transaction
        const newTransaction = await transactionsService.createTransaction(transaction);
        const convertedTransaction = convertServiceTransaction(newTransaction);

        // Update transactions store
        const currentTransactions = get().transactions;
        const updatedTransactions = [...currentTransactions, convertedTransaction];
        set({ transactions: updatedTransactions, isLoading: false });

        // Update accounts store to reflect balance changes
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
  }),
);
