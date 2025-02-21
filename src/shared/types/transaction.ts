import { Account as AccountType } from './account';
import { IncomeSource } from '../ui/account-selector';

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  backgroundColor?: string;
  type: TransactionType;
}

export interface TransactionAccount {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'deposit';
  balance: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category | null;
  sourceAccount: TransactionAccount | null;
  destinationAccount: TransactionAccount | null;
  date: Date;
  note?: string;
}

export interface TransactionState {
  type: TransactionType;
  amount: {
    value: string;
    hasDecimal: boolean;
  };
  category: Category | null;
  sourceAccount: TransactionAccount | IncomeSource | null;
  destinationAccount: TransactionAccount | null;
} 