import { useState, useCallback } from 'react';
import { Account } from '../types/account';
import { accountsService } from '../services/accounts';
import { transactionsService } from '../services/transactions';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedAccounts = await accountsService.getAccounts();
      const total = await accountsService.getTotalBalance();
      setAccounts(fetchedAccounts);
      setTotalBalance(total);
    } catch (error) {
      setError('Failed to fetch accounts');
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (accountData: Omit<Account, 'id'>) => {
    try {
      setError(null);
      const newAccount = await accountsService.createAccount(accountData);
      await fetchAccounts(); // Refresh accounts list
      return newAccount;
    } catch (error) {
      setError('Failed to create account');
      console.error('Error creating account:', error);
      throw error;
    }
  }, [fetchAccounts]);

  const updateAccount = useCallback(async (id: string, accountData: Partial<Account>) => {
    try {
      setError(null);
      await accountsService.updateAccount(id, accountData);
      await fetchAccounts(); // Refresh accounts list
    } catch (error) {
      setError('Failed to update account');
      console.error('Error updating account:', error);
      throw error;
    }
  }, [fetchAccounts]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      setError(null);
      await accountsService.deleteAccount(id);
      await fetchAccounts(); // Refresh accounts list
    } catch (error) {
      setError('Failed to delete account');
      console.error('Error deleting account:', error);
      throw error;
    }
  }, [fetchAccounts]);

  const getAccountWithTransactions = useCallback(async (id: string) => {
    try {
      setError(null);
      const account = await accountsService.getAccountById(id);
      if (!account) throw new Error('Account not found');

      const allTransactions = await transactionsService.getTransactions();
      const accountTransactions = allTransactions.filter(
        t => t.sourceAccount?.id === id || t.destinationAccount?.id === id
      );

      return { account, transactions: accountTransactions };
    } catch (error) {
      setError('Failed to fetch account details');
      console.error('Error fetching account details:', error);
      throw error;
    }
  }, []);

  return {
    accounts,
    totalBalance,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountWithTransactions,
  };
} 