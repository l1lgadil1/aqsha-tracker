import { AccountSchema } from '@/src/entities/accounts/model';
import { Account, AccountFormData } from '../types/account';
import { storageService } from './storage';

const DEFAULT_ACCOUNTS: AccountFormData[] = [
  {
    name: 'Наличные',
    type: 'cash',
    balance: 0,
    currency: '₸',
    color: '#22C55E',
    icon: '💵',
  },
  {
    name: 'Карта',
    type: 'card',
    balance: 0,
    currency: '₸',
    color: '#3B82F6',
    icon: '💳',
  },
];

class AccountsService {
  private static instance: AccountsService;
  private accounts: Account[] = [];
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): AccountsService {
    if (!AccountsService.instance) {
      AccountsService.instance = new AccountsService();
    }
    return AccountsService.instance;
  }

  private async initialize() {
    if (this.initialized) return;

    const storedAccounts = await storageService.getAccounts();

    if (!storedAccounts || storedAccounts.length === 0) {
      // Create default accounts if no accounts exist
      this.accounts = await this.createDefaultAccounts();
    } else {
      this.accounts = storedAccounts;
    }

    this.initialized = true;
  }

  private async createDefaultAccounts(): Promise<Account[]> {
    const defaultAccounts: Account[] = DEFAULT_ACCOUNTS.map(data => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...data,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await storageService.setAccounts(defaultAccounts);
    return defaultAccounts;
  }

  private async saveAccounts(): Promise<void> {
    await storageService.setAccounts(this.accounts);
  }

  public async getAccounts(): Promise<AccountSchema[]> {
    await this.initialize();
    return this.accounts;
  }

  public async getAccountById(id: string): Promise<Account | null> {
    await this.initialize();
    return this.accounts.find(acc => acc.id === id) || null;
  }

  public async createAccount(data: AccountFormData): Promise<Account> {
    await this.initialize();

    const newAccount: Account = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...data,
      balance: data.balance || 0,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.accounts.push(newAccount);
    await this.saveAccounts();
    return newAccount;
  }

  public async updateAccount(id: string, data: Partial<AccountFormData>): Promise<Account | null> {
    await this.initialize();

    const index = this.accounts.findIndex(acc => acc.id === id);
    if (index === -1) return null;

    const updatedAccount: Account = {
      ...this.accounts[index],
      ...data,
      updatedAt: new Date(),
    };

    this.accounts[index] = updatedAccount;
    await this.saveAccounts();
    return updatedAccount;
  }

  public async deleteAccount(id: string): Promise<boolean> {
    await this.initialize();

    const index = this.accounts.findIndex(acc => acc.id === id);
    if (index === -1) return false;

    this.accounts.splice(index, 1);
    await this.saveAccounts();
    return true;
  }

  public async archiveAccount(id: string): Promise<Account | null> {
    return this.updateAccount(id, { isArchived: true } as Partial<AccountFormData>);
  }

  public async getTotalBalance(): Promise<number> {
    await this.initialize();
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  // For development/testing purposes
  public async resetAccounts(): Promise<void> {
    this.accounts = await this.createDefaultAccounts();
    this.initialized = true;
  }
}

export const accountsService = AccountsService.getInstance();
