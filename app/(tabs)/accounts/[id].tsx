import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '../../../src/shared/contexts/theme-context';
import { accountsService } from '../../../src/shared/services/accounts';
import { transactionsService, Transaction } from '../../../src/shared/services/transactions';
import { Account } from '../../../src/shared/types/account';
import { formatAmount } from '../../../src/shared/utils/format';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const fetchAccountDetails = async () => {
    try {
      const accountData = await accountsService.getAccountById(id as string);
      if (!accountData) {
        Alert.alert('Ошибка', 'Счет не найден');
        router.back();
        return;
      }
      setAccount(accountData);

      const allTransactions = await transactionsService.getTransactions();
      const accountTransactions = allTransactions.filter(
        t => t.sourceAccount?.id === id || t.destinationAccount?.id === id
      );
      setTransactions(accountTransactions);
    } catch (error) {
      console.error('Error fetching account details:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные счета');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPress = () => {
    // Navigate to edit screen
    router.push({
      pathname: '/accounts/edit',
      params: { id: account?.id }
    });
  };

  const handleDeletePress = async () => {
    if (!account) return;

    Alert.alert(
      'Удаление счета',
      'Вы уверены, что хотите удалить этот счет?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await accountsService.deleteAccount(account.id);
              router.back();
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Ошибка', 'Не удалось удалить счет');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    accountName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    balance: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    currency: {
      fontSize: 20,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionType: {
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    transactionDate: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: '600',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
      marginLeft: 8,
    },
    actionButtonText: {
      marginLeft: 4,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  if (!account) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: account.name,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={handleEditPress}
                style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  Изменить
                </Text>
              </Pressable>
              <Pressable
                onPress={handleDeletePress}
                style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
              >
                <Ionicons name="trash" size={20} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  Удалить
                </Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <Animated.View 
          entering={FadeInDown.duration(300)}
          style={styles.header}
        >
          <Text style={styles.accountName}>{account.name}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balance}>
              {formatAmount(account.balance)}
            </Text>
            <Text style={styles.currency}>{account.currency}</Text>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>История операций</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {transaction.type === 'expense' ? 'Расход' : 
                   transaction.type === 'income' ? 'Доход' : 'Перевод'}
                </Text>
                <Text style={styles.transactionDate}>
                  {transaction.date.toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      transaction.type === 'expense'
                        ? colors.expense
                        : transaction.type === 'income'
                        ? colors.income
                        : colors.textPrimary,
                  },
                ]}
              >
                {transaction.type === 'expense' ? '-' : '+'}
                {formatAmount(transaction.amount)} {account.currency}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
} 