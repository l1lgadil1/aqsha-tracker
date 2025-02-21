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
  createAccount: (data: AccountFormData) => Promise<void>;
  updateAccount: (id: string, data: Partial<AccountFormData>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  archiveAccount: (id: string) => Promise<void>;
}

type AccountsStore = StateCreator<AccountsState>;

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
    }
  },

  createAccount: async (data: AccountFormData) => {
    try {
      set({ isLoading: true, error: null });
      await accountsService.createAccount(data);
      await get().fetchAccounts(); // Refresh the accounts list
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateAccount: async (id: string, data: Partial<AccountFormData>) => {
    try {
      set({ isLoading: true, error: null });
      await accountsService.updateAccount(id, data);
      await get().fetchAccounts(); // Refresh the accounts list
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteAccount: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await accountsService.deleteAccount(id);
      await get().fetchAccounts(); // Refresh the accounts list
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  archiveAccount: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await accountsService.archiveAccount(id);
      await get().fetchAccounts(); // Refresh the accounts list
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
})); 