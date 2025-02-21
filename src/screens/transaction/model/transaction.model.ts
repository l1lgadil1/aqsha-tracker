import { useState, useCallback, useRef, useEffect } from 'react';
import { TransactionState, TransactionType, Category, TransactionAccount } from '../../../shared/types/transaction';
import { Account } from '../../../shared/types/account';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { transactionsService } from '../../../shared/services/transactions';
import { accountsService } from '../../../shared/services/accounts';
import { Alert } from 'react-native';

const MAX_DECIMAL_PLACES = 2;
const MAX_DIGITS = 10;

// Convert Account to TransactionAccount
const toTransactionAccount = (account: Account): TransactionAccount => ({
  id: account.id,
  name: account.name,
  type: account.type === 'savings' ? 'deposit' : account.type,
  balance: account.balance,
});

// Convert TransactionAccount to Account
const toAccount = (account: TransactionAccount): Account => ({
  id: account.id,
  name: account.name,
  type: account.type,
  balance: account.balance,
  currency: '₸',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useTransactionModel = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [state, setState] = useState<TransactionState>({
    type: 'expense',
    amount: { value: '', hasDecimal: false },
    sourceAccount: null,
    destinationAccount: null,
    category: null,
  });

  const [isSelectingSource, setIsSelectingSource] = useState(true);
  const accountSelectorRef = useRef<BottomSheetModal>(null);
  const categorySelectorRef = useRef<BottomSheetModal>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Load accounts when component mounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const fetchedAccounts = await accountsService.getAccounts();
      setAccounts(fetchedAccounts);
      
      // Set default source account to first cash account if available
      const defaultCashAccount = fetchedAccounts.find(acc => acc.type === 'cash');
      if (defaultCashAccount) {
        setState(prev => ({
          ...prev,
          sourceAccount: toTransactionAccount(defaultCashAccount)
        }));
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить счета');
    }
  };

  const resetState = useCallback(() => {
    const defaultCashAccount = accounts.find(account => account.type === 'cash');
    setState({
      type: 'expense',
      amount: { value: '', hasDecimal: false },
      sourceAccount: defaultCashAccount ? toTransactionAccount(defaultCashAccount) : null,
      destinationAccount: null,
      category: null,
    });
  }, [accounts]);

  const handleTypeChange = useCallback((type: TransactionType) => {
    setState(prev => ({ ...prev, type }));
  }, []);

  const handleNumberPress = useCallback((num: string) => {
    setState(prev => {
      const currentValue = prev.amount.value;
      
      // Handle decimal places limit
      if (currentValue.includes('.')) {
        const [, decimal] = currentValue.split('.');
        if (decimal.length >= MAX_DECIMAL_PLACES) {
          return prev;
        }
      }

      // Handle maximum digits
      const digitsOnly = currentValue.replace(/[^0-9]/g, '');
      if (digitsOnly.length >= MAX_DIGITS) {
        return prev;
      }

      // Handle leading zero
      if (currentValue === '0' && num !== '.') {
        return {
          ...prev,
          amount: {
            ...prev.amount,
            value: num,
          },
        };
      }

      const newValue = currentValue + num;
      setHistory(prev => [...prev, currentValue]);

      return {
        ...prev,
        amount: {
          ...prev.amount,
          value: newValue,
        },
      };
    });
  }, []);

  const handleDecimalPress = useCallback(() => {
    setState(prev => {
      if (prev.amount.value.includes('.')) {
        return prev;
      }

      const currentValue = prev.amount.value;
      const newValue = currentValue === '' ? '0.' : currentValue + '.';
      setHistory(prev => [...prev, currentValue]);

      return {
        ...prev,
        amount: {
          ...prev.amount,
          value: newValue,
        },
      };
    });
  }, []);

  const handleDividePress = useCallback(() => {
    setState(prev => {
      const currentValue = prev.amount.value;
      const numericValue = parseFloat(currentValue || '0');
      const newValue = (numericValue / 2).toFixed(2).replace(/\.?0+$/, '');
      
      setHistory(prev => [...prev, currentValue]);

      return {
        ...prev,
        amount: {
          ...prev.amount,
          value: newValue,
        },
      };
    });
  }, []);

  const handleUndoPress = useCallback(() => {
    if (history.length === 0) return;

    const lastValue = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    setState(prev => ({
      ...prev,
      amount: {
        ...prev.amount,
        value: lastValue,
      },
    }));
  }, [history]);

  const handleDeletePress = useCallback(() => {
    setState(prev => {
      const currentValue = prev.amount.value;
      if (!currentValue) return prev;
      
      // Remove last character
      const newValue = currentValue.slice(0, -1);
      return {
        ...prev,
        amount: {
          ...prev.amount,
          value: newValue,
        },
      };
    });
  }, []);

  const handleClearAmount = useCallback(() => {
    setState(prev => ({
      ...prev,
      amount: {
        ...prev.amount,
        value: '',
      },
    }));
  }, []);

  const validateTransaction = (state: TransactionState): string | null => {
    if (!state.amount.value) {
      return 'Введите сумму';
    }

    if (state.type === 'expense' && !state.sourceAccount) {
      return 'Выберите счет списания';
    }

    if (state.type === 'income' && !state.destinationAccount) {
      return 'Выберите счет зачисления';
    }

    if (state.type === 'transfer' && (!state.sourceAccount || !state.destinationAccount)) {
      return 'Выберите оба счета для перевода';
    }

    return null;
  };

  const handleConfirmPress = useCallback(() => {
    const error = validateTransaction(state);
    if (error) {
      Alert.alert('Ошибка', error, [{ text: 'OK' }], { cancelable: false });
      return;
    }

    if (state.type === 'expense') {
      try {
        categorySelectorRef.current?.present();
      } catch (error) {
        console.error('Error presenting category modal:', error);
      }
    } else {
      // Handle income and transfer transactions
      transactionsService.createTransaction(state)
        .then(transaction => {
          console.log('Transaction created:', transaction);
          resetState();

          Alert.alert(
            'Успешно',
            'Транзакция успешно создана',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        })
        .catch(error => {
          console.error('Error creating transaction:', error);
          Alert.alert(
            'Ошибка',
            error instanceof Error ? error.message : 'Не удалось создать транзакцию',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        });
    }
  }, [state, resetState]);

  const handleSourceAccountPress = useCallback(() => {
    console.log('Source account press triggered');
    setIsSelectingSource(true);
    try {
      accountSelectorRef.current?.present();
    } catch (error) {
      console.error('Error presenting modal:', error);
    }
  }, []);

  const handleDestinationAccountPress = useCallback(() => {
    console.log('Destination account press triggered');
    setIsSelectingSource(false);
    try {
      accountSelectorRef.current?.present();
    } catch (error) {
      console.error('Error presenting modal:', error);
    }
  }, []);

  const handleAccountSelect = useCallback((account: Account) => {
    console.log('Account selected:', account);
    const transactionAccount = toTransactionAccount(account);
    setState(prev => ({
      ...prev,
      sourceAccount: isSelectingSource ? transactionAccount : prev.sourceAccount,
      destinationAccount: isSelectingSource ? prev.destinationAccount : transactionAccount,
    }));
    try {
      accountSelectorRef.current?.dismiss();
    } catch (error) {
      console.error('Error dismissing modal:', error);
    }
  }, [isSelectingSource]);

  const handleCategorySelect = useCallback(async (category: Category) => {
    setState(prev => ({
      ...prev,
      category,
    }));

    try {
      categorySelectorRef.current?.dismiss();
      
      // Create the transaction
      const transaction = await transactionsService.createTransaction({
        ...state,
        category,
      });

      // Reset the form
      resetState();

      // Show success message
      Alert.alert(
        'Успешно',
        'Транзакция успешно создана',
        [{ text: 'OK' }],
        { cancelable: false }
      );

      console.log('Transaction created:', transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      // Show error message
      Alert.alert(
        'Ошибка',
        error instanceof Error ? error.message : 'Не удалось создать транзакцию',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  }, [state, resetState]);

  return {
    state,
    accountSelectorRef,
    categorySelectorRef,
    accounts,
    handlers: {
      onTypeChange: handleTypeChange,
      onNumberPress: handleNumberPress,
      onDecimalPress: handleDecimalPress,
      onDividePress: handleDividePress,
      onConfirmPress: handleConfirmPress,
      onDeletePress: handleDeletePress,
      onClearAmount: handleClearAmount,
      onSourceAccountPress: handleSourceAccountPress,
      onDestinationAccountPress: handleDestinationAccountPress,
      onAccountSelect: handleAccountSelect,
      onCategorySelect: handleCategorySelect,
    },
  };
}; 