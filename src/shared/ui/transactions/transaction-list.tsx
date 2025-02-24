import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Transaction } from '../../types/transaction';
import { Text } from '../text';
import { useTheme } from '../../contexts/theme-context';
import { formatAmount } from '../../utils/format';

interface TransactionListProps {
  transactions: Transaction[];
  accountId: string;
  currency?: string;
}

export function TransactionList({ transactions, accountId, currency = '₸' }: TransactionListProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    emptyState: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    emptyStateText: {
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          No transactions yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionType}>
              {transaction.type === 'expense' ? 'Expense' : 
               transaction.type === 'income' ? 'Income' : 'Transfer'}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(transaction.date).toLocaleDateString()}
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
            {formatAmount(transaction.amount)} {currency}
          </Text>
        </View>
      ))}
    </View>
  );
} 