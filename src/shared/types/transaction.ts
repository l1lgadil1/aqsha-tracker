import { Account } from './account';

export interface TransactionAccount {
  id: string;
  name: string;
  balance: number;
  type: string;
  currency?: string;
}
export interface ICurrency {
  id: string;
  name: string;
  symbol: string;
  code?: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Category {
  icon?: string;
  id: string;
  backgroundColor?: string;
  color?: string;
  name: string;
  type: string;
}

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: {
    value: string;
    hasDecimal: boolean;
  };
  date: string | Date;
  description?: string;
  category: Category | null;
  incomeSource: IncomeSource | null;
  sourceAccount: Account | null;
  destinationAccount: Account | null;
}
