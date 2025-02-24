import React from 'react';
import { TransactionScreen } from './ui/transaction-screen';
import { useTransactionModel } from './model/transaction.model';

export const Transaction: React.FC = () => {
  const { state, accountSelectorRef, categorySelectorRef, handlers } = useTransactionModel();

  return (
    <TransactionScreen
      state={state}
      categorySelectorRef={categorySelectorRef}
      accountSelectorRef={accountSelectorRef}
      {...handlers}
    />
  );
}; 