import { useEffect } from 'react';
import { useTransactionsStore } from '../store/transactions-store';
import { useAccountsStore } from '../store/accounts-store';

export const useAppData = () => {
  const { fetchTransactions } = useTransactionsStore();
  const { fetchAccounts } = useAccountsStore();

  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      await Promise.all([
        fetchAccounts(),
        fetchTransactions(),
      ]);
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

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    getTransactionsByAccount,
    getTransactionsByCategory,
    fetchTransactions,
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