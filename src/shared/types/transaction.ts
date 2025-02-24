export interface TransactionAccount {
  id: string;
  name: string;
  balance: number;
  type: string;
  currency?: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  type: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string | Date;
  description?: string;
  category: Category | null;
  sourceAccount: TransactionAccount | IncomeSource | null;
  destinationAccount: TransactionAccount | null;
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