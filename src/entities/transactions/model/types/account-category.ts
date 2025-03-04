import { TransactionType } from './account-type';

export type TransactionCategory = {
  id: string;
  name: string;
  type: TransactionType;
};
