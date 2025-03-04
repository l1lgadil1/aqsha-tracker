import { useState, useCallback, useRef, useEffect } from 'react';
import { TransactionType, Category, ITransaction } from '../../../shared/types/transaction';
import { Account, AccountType } from '../../../shared/types/account';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { transactionsService } from '../../../shared/services/transactions';
import { accountsService } from '../../../shared/services/accounts';
import { Alert } from 'react-native';
import { useAccounts, useTransactions } from '@/src/shared/hooks/use-app-data';
import { AccountSchema } from '@/src/entities/accounts/model';

const MAX_DECIMAL_PLACES = 2;
const MAX_DIGITS = 10;

// Define TransactionState type to fix linter error
type TransactionState = ITransaction;

// Convert Account to TransactionAccount
const toTransactionAccount = (account: Account): ITransaction => {
  console.log('toTransactionAccount called with:', account);
  return {
    id: account.id,
    type: 'expense' as TransactionType,
    amount: { value: account.balance.toString(), hasDecimal: false },
    date: new Date(),
    category: null,
    sourceAccount: null,
    destinationAccount: null,
  };
};

// // Convert TransactionAccount to Account
// const toAccount = (account: ITransaction): Account => ({
//   id: account.id,
//   name: account.name,
//   type: account.type,
//   balance: account.balance,
//   currency: '₸',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// });
const defaultState: ITransaction = {
  id: '1',
  date: new Date(),
  type: 'expense',
  amount: { value: '', hasDecimal: false },
  sourceAccount: null,
  destinationAccount: null,
  category: null,
  incomeSource: null,
};
export const useTransactionModel = () => {
  const { createTransaction } = useTransactions();
  const { fetchAccounts } = useAccounts();
  const [accounts, setAccounts] = useState<AccountSchema[]>([]);
  const [state, setState] = useState<ITransaction>(defaultState);

  const [selectedSource, setSelectedSource] = useState<'source' | 'destination' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const accountSelectorRef = useRef<BottomSheetModal>(null);
  const categorySelectorRef = useRef<BottomSheetModal>(null);
  const incomeSourceSelectorRef = useRef<BottomSheetModal>(null);
  // Function to get the appropriate title for the account selector modal
  const getAccountSelectorTitle = useCallback((): string => {
    if (selectedSource === 'source') {
      return state.type === 'expense' || state.type === 'transfer'
        ? 'Откуда списать'
        : 'Источник дохода';
    } else if (selectedSource === 'destination') {
      return 'Куда зачислить';
    }
    return 'Выберите счёт';
  }, [selectedSource, state.type]);

  // Load accounts when component mounts
  // useEffect(() => {
  //   loadAccounts();
  // }, []);

  // const loadAccounts = async () => {
  //   try {
  //     const fetchedAccounts = await accountsService.getAccounts();
  //     setAccounts(fetchedAccounts);

  //     // Set default source account to first cash account if available
  //     const defaultCashAccount = fetchedAccounts.find(acc => acc.type === 'cash');
  //     if (defaultCashAccount) {
  //       setState(prev => ({
  //         ...prev,
  //         sourceAccount: toTransactionAccount(defaultCashAccount),
  //       }));
  //     }
  //   } catch (error) {
  //     console.error('Error loading accounts:', error);
  //     Alert.alert('Ошибка', 'Не удалось загрузить счета');
  //   }
  // };

  const resetState = useCallback(() => {
    console.log('resetState called with accounts:', accounts);
    setState(defaultState);
  }, [accounts]);

  const handleTypeChange = useCallback((type: TransactionType) => {
    console.log('handleTypeChange called with type:', type);
    setState(prev => ({ ...prev, type }));
    setSelectedSource(null);
  }, []);

  const handleNumberPress = useCallback((num: string) => {
    console.log('handleNumberPress called with num:', num);
    setState(prev => ({
      ...prev,
      amount: {
        ...prev.amount,
        value: prev.amount.value + num,
      },
    }));
  }, []);

  const handleDeletePress = useCallback(() => {
    console.log('handleDeletePress called');
    setState(prev => ({
      ...prev,
      amount: {
        ...prev.amount,
        value: prev.amount.value.slice(0, -1),
      },
    }));
  }, []);

  const handleClearAmount = useCallback(() => {
    console.log('handleClearAmount called');
    setState(prev => ({
      ...prev,
      amount: {
        ...prev.amount,
        value: '',
      },
    }));
  }, []);

  const validateTransaction = (state: TransactionState): string | null => {
    console.log('validateTransaction called with state:', state);
    return null;
  };

  const handleConfirmPress = useCallback(() => {
    console.log('handleConfirmPress called with state:', state);
    // fetchAccounts();
    // createTransaction(state);
    if (state.type === 'expense') {
      categorySelectorRef.current?.present();
    } else if (state.type === 'income') {
      incomeSourceSelectorRef.current?.present();
    } else if (state.type === 'transfer') {
      accountSelectorRef.current?.present();
    }
  }, [state, fetchAccounts, createTransaction]);

  const handleSourceAccountPress = useCallback(() => {
    console.log('handleSourceAccountPress called');
    setSelectedSource('source');

    if (state.type === 'income') {
      incomeSourceSelectorRef.current?.present();
    } else {
      accountSelectorRef?.current?.present();
    }
    // setIsSelectingSource(true);
  }, [state.type]);

  const handleDestinationAccountPress = useCallback(() => {
    console.log('handleDestinationAccountPress called');
    setSelectedSource('destination');
    accountSelectorRef?.current?.present();
    // setIsSelectingSource(false);
  }, []);

  const handleAccountSelect = useCallback(
    (account: Account) => {
      console.log(
        'handleAccountSelect called with account:',
        account,
        'selectedSource:',
        selectedSource,
      );

      if (selectedSource === 'source') {
        setState(prev => ({
          ...prev,
          sourceAccount: account,
        }));
      } else if (selectedSource === 'destination') {
        setState(prev => ({
          ...prev,
          destinationAccount: account,
        }));
      }

      // Close the account selector modal
      accountSelectorRef.current?.dismiss();
    },
    [selectedSource, state],
  );

  const handleCategorySelect = useCallback((category: Category) => {
    console.log('handleCategorySelect called with category:', category);

    // Update the transaction state with the selected category
    setState(prev => ({
      ...prev,
      category: category,
    }));

    if (state.type === 'expense') {
      createTransaction(state);
    }
    // Close the category selector modal
    categorySelectorRef.current?.dismiss();
  }, []);

  const handleIncomeSourceSelect = useCallback(
    (incomeSource: Category) => {
      console.log('handleIncomeSourceSelect called with incomeSource:', incomeSource);
      setState(prev => ({
        ...prev,
        incomeSource: incomeSource,
      }));
      incomeSourceSelectorRef.current?.dismiss();
    },
    [state.type],
  );

  const handleIncomeSourcePress = useCallback(() => {
    console.log('handleIncomeSourcePress called');
    incomeSourceSelectorRef.current?.present();
  }, []);

  useEffect(() => {
    console.log('state.sourceAccount changed to:', state.sourceAccount);
  }, [state.sourceAccount]);

  return {
    state,
    accountSelectorRef,
    categorySelectorRef,
    incomeSourceSelectorRef,
    accounts,
    selectedSource,
    handlers: {
      selectedSource,
      onTypeChange: handleTypeChange,
      onNumberPress: handleNumberPress,
      onConfirmPress: handleConfirmPress,
      onDeletePress: handleDeletePress,
      onClearAmount: handleClearAmount,
      onSourceAccountPress: handleSourceAccountPress,
      onDestinationAccountPress: handleDestinationAccountPress,
      onAccountSelect: handleAccountSelect,
      onCategorySelect: handleCategorySelect,
      getAccountSelectorTitle,
      onIncomeSourceSelect: handleIncomeSourceSelect,
      onIncomeSourcePress: handleIncomeSourcePress,
    },
  };
};

// const handleDecimalPress = useCallback(() => {
//   console.log('handleDecimalPress called');
// }, []);

// const handleDividePress = useCallback(() => {
//   console.log('handleDividePress called');
// }, []);

// const handleUndoPress = useCallback(() => {
//   console.log('handleUndoPress called');
// }, []);
