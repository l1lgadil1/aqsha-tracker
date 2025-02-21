export type AccountType = 'cash' | 'card' | 'deposit' | 'savings';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency?: string;
  color?: string;
  icon?: string;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountFormData {
  name: string;
  type: AccountType;
  balance: number;
  currency?: string;
  color?: string;
  icon?: string;
}

export type AccountsState = {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
}; 