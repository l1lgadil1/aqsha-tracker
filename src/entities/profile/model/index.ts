import { Account } from '@/src/shared/types/account';
import { ProfileType } from './profile-type';

export type Profile = {
  id: string;
  name: string;
  type: ProfileType;
  accounts: Account[];
  createdAt: Date;
  updatedAt: Date;
};
