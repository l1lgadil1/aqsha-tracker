import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from '../types/account';
import { Transaction } from './transactions';

const STORAGE_KEYS = {
  ACCOUNTS: '@aqsha_tracker:accounts',
  TRANSACTIONS: '@aqsha_tracker:transactions',
} as const;

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getData<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  async setData<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error writing to storage:', error);
      return false;
    }
  }

  async removeData(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  }

  // Specific methods for our app
  async getAccounts(): Promise<Account[] | null> {
    return this.getData<Account[]>(STORAGE_KEYS.ACCOUNTS);
  }

  async setAccounts(accounts: Account[]): Promise<boolean> {
    return this.setData(STORAGE_KEYS.ACCOUNTS, accounts);
  }

  async getTransactions(): Promise<Transaction[] | null> {
    return this.getData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS);
  }

  async setTransactions(transactions: Transaction[]): Promise<boolean> {
    return this.setData(STORAGE_KEYS.TRANSACTIONS, transactions);
  }
}

export const storageService = StorageService.getInstance();
export { STORAGE_KEYS }; 