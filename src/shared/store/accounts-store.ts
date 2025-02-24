import { StateCreator, create } from 'zustand';
import { Account, AccountFormData } from '../types/account';
import { accountsService } from '../services/accounts';

interface AccountsState {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  totalBalance: number;
  
  // Actions
  fetchAccounts: () => Promise<void>;
  createAccount: (data: AccountFormData) => Promise<Account>;
  updateAccount: (id: string, data: Partial<AccountFormData>) => Promise<Account>;
  deleteAccount: (id: string) => Promise<void>;
  archiveAccount: (id: string) => Promise<Account>;
  resetAccounts: () => Promise<void>;
}

export const useAccountsStore = create<AccountsState>((set, get): AccountsState => ({
  accounts: [],
  isLoading: false,
  error: null,
  totalBalance: 0,

  fetchAccounts: async () => {
    try {
      set({ isLoading: true, error: null });
      const accounts = await accountsService.getAccounts();
      const totalBalance = await accountsService.getTotalBalance();
      set({ accounts, totalBalance, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  createAccount: async (data: AccountFormData) => {
    try {
      set({ isLoading: true, error: null });
      const newAccount = await accountsService.createAccount(data);
      
      // Update local state immediately
      const accounts = [...get().accounts, newAccount];
      const totalBalance = get().totalBalance + (newAccount.balance || 0);
      set({ accounts, totalBalance, isLoading: false });
      
      return newAccount;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateAccount: async (id: string, data: Partial<AccountFormData>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedAccount = await accountsService.updateAccount(id, data);
      if (!updatedAccount) {
        throw new Error('Account not found');
      }
      
      // Update local state immediately
      const accounts = get().accounts.map(acc => 
        acc.id === id ? updatedAccount : acc
      );
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      set({ accounts, totalBalance, isLoading: false });
      
      return updatedAccount;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteAccount: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const success = await accountsService.deleteAccount(id);
      if (!success) {
        throw new Error('Failed to delete account');
      }
      
      // Update local state immediately
      const accounts = get().accounts.filter(acc => acc.id !== id);
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      set({ accounts, totalBalance, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  archiveAccount: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const archivedAccount = await accountsService.archiveAccount(id);
      if (!archivedAccount) {
        throw new Error('Account not found');
      }
      
      // Update local state immediately
      const accounts = get().accounts.map(acc => 
        acc.id === id ? archivedAccount : acc
      );
      set({ accounts, isLoading: false });
      
      return archivedAccount;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  resetAccounts: async () => {
    try {
      set({ isLoading: true, error: null });
      await accountsService.resetAccounts();
      const accounts = await accountsService.getAccounts();
      const totalBalance = await accountsService.getTotalBalance();
      set({ accounts, totalBalance, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
})); 