import { Transaction } from '../../transactions/model';
import { AccountType } from './types/account-type';

export type AccountSchema = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  transactions: Transaction[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
};
