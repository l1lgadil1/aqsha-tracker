import React from 'react';
import { View, StyleSheet, FlatList, ViewStyle } from 'react-native';
import { Text } from '../text';
import { useTheme } from '../../contexts/theme-context';
import { TransactionListItem } from '../../types/analytics';
import { formatCurrency, formatDate } from '../../lib/format';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TransactionListProps {
  transactions: TransactionListItem[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: ViewStyle;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  ListHeaderComponent,
  contentContainerStyle,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionHeader: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryName: {
      color: colors.textPrimary,
      marginBottom: 4,
    },
    accountName: {
      color: colors.textSecondary,
    },
    amount: {
      textAlign: 'right',
    },
    expense: {
      color: colors.error,
    },
    income: {
      color: colors.success,
    },
    transfer: {
      color: colors.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
  });

  const getTransactionIcon = (type: TransactionListItem['type']) => {
    switch (type) {
      case 'expense':
        return 'arrow-bottom-left';
      case 'income':
        return 'arrow-top-right';
      case 'transfer':
        return 'swap-horizontal';
      default:
        return 'cash';
    }
  };

  const getAmountStyle = (type: TransactionListItem['type']) => {
    switch (type) {
      case 'expense':
        return styles.expense;
      case 'income':
        return styles.income;
      case 'transfer':
        return styles.transfer;
      default:
        return {};
    }
  };

  const renderItem = ({ item }: { item: TransactionListItem }) => (
    <View style={styles.item}>
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: item.category?.color || colors.primary }
        ]}
      >
        <MaterialCommunityIcons
          name={getTransactionIcon(item.type)}
          size={24}
          color={colors.background}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text variant="body1" style={styles.categoryName}>
            {item.category?.name || 'Без категории'}
          </Text>
          <Text variant="body1" style={[styles.amount, getAmountStyle(item.type)]}>
            {item.type === 'expense' ? '-' : '+'}
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="body2" style={styles.accountName}>
            {item.account?.name || 'Счет не указан'}
          </Text>
          <Text variant="body2" style={styles.accountName}>
            {formatDate(item.date)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (transactions.length === 0) {
    return (
      <FlatList
        data={[null]}
        renderItem={() => null}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="text-box-search-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text
              variant="body1"
              style={[styles.accountName, { marginTop: 16, textAlign: 'center' }]}
            >
              Нет транзакций за выбранный период
            </Text>
          </View>
        )}
        contentContainerStyle={contentContainerStyle}
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={transactions}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  );
}; 