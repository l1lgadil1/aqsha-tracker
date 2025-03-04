import { useEffect } from 'react';
import { useTransactionsStore } from '../store/transactions-store';
import { useAccountsStore } from '../store/accounts-store';
import { TransactionType, ITransaction, Category } from '../types/transaction';
import { Account } from '../types/account';
import { IncomeSource } from '../types/income-source';

export const useAppData = () => {
  const { fetchTransactions } = useTransactionsStore();
  const { fetchAccounts } = useAccountsStore();

  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      await Promise.all([fetchAccounts(), fetchTransactions()]);
    };

    loadInitialData();
  }, [fetchAccounts, fetchTransactions]);
};

// Hook to subscribe to transactions data
export const useTransactions = () => {
  const transactions = useTransactionsStore(state => state.transactions);
  const isLoading = useTransactionsStore(state => state.isLoading);
  const error = useTransactionsStore(state => state.error);
  const createTransaction = useTransactionsStore(state => state.createTransaction);
  const getTransactionsByAccount = useTransactionsStore(state => state.getTransactionsByAccount);
  const getTransactionsByCategory = useTransactionsStore(state => state.getTransactionsByCategory);
  const fetchTransactions = useTransactionsStore(state => state.fetchTransactions);

  const handleTransactionFlow = async (
    type: TransactionType,
    amount: { value: string; hasDecimal: boolean },
    sourceAccount: Account | null,
    destinationAccount: Account | null,
    category: Category | null,
    incomeSource: IncomeSource | null,
  ) => {
    try {
      if (!amount.value || parseFloat(amount.value) === 0) {
        throw new Error('Please enter a valid amount');
      }

      const transaction: ITransaction = {
        id: Date.now().toString(), // You might want to use a proper UUID here
        type,
        amount,
        date: new Date(),
        sourceAccount,
        destinationAccount,
        category,
        incomeSource,
      };

      switch (type) {
        case 'expense':
          if (!sourceAccount) throw new Error('Please select source account');
          if (!category) throw new Error('Please select expense category');
          break;

        case 'income':
          if (!destinationAccount) throw new Error('Please select destination account');
          if (!incomeSource) throw new Error('Please select income source');
          break;

        case 'transfer':
          if (!sourceAccount) throw new Error('Please select source account');
          if (!destinationAccount) throw new Error('Please select destination account');
          if (sourceAccount.id === destinationAccount.id) {
            throw new Error('Source and destination accounts must be different');
          }
          break;

        default:
          throw new Error('Invalid transaction type');
      }

      return await createTransaction(transaction);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create transaction');
    }
  };

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    getTransactionsByAccount,
    getTransactionsByCategory,
    fetchTransactions,
    handleTransactionFlow,
  };
};

// Hook to subscribe to accounts data
export const useAccounts = () => {
  const accounts = useAccountsStore(state => state.accounts);
  const isLoading = useAccountsStore(state => state.isLoading);
  const error = useAccountsStore(state => state.error);
  const totalBalance = useAccountsStore(state => state.totalBalance);
  const createAccount = useAccountsStore(state => state.createAccount);
  const updateAccount = useAccountsStore(state => state.updateAccount);
  const deleteAccount = useAccountsStore(state => state.deleteAccount);
  const archiveAccount = useAccountsStore(state => state.archiveAccount);
  const fetchAccounts = useAccountsStore(state => state.fetchAccounts);

  return {
    accounts,
    isLoading,
    error,
    totalBalance,
    createAccount,
    updateAccount,
    deleteAccount,
    archiveAccount,
    fetchAccounts,
  };
};
