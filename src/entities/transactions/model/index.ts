import { TransactionCategory } from './types/account-category';
import { TransactionType } from './types/account-type';

export type Transaction = {
  id: string;
  profileId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: TransactionCategory;
  date: Date;
  note?: string;
  transferAccountId?: string;
};
