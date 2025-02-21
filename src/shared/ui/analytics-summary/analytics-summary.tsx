import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../text';
import { useTheme } from '../../contexts/theme-context';
import { AnalyticsSummary as Summary } from '../../types/analytics';
import { formatCurrency } from '../../lib/format';

interface AnalyticsSummaryProps {
  data: Summary;
  type: 'expense' | 'income';
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ data, type }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    lastRow: {
      marginBottom: 0,
    },
    label: {
      color: colors.textSecondary,
    },
    amount: {
      color: colors.textPrimary,
    },
    comparison: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    positive: {
      color: colors.success,
    },
    negative: {
      color: colors.error,
    },
  });

  const getComparisonColor = (value: number) => {
    if (type === 'expense') {
      return value > 0 ? colors.error : colors.success;
    }
    return value > 0 ? colors.success : colors.error;
  };

  const getComparisonText = (value: number) => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="body2" style={styles.label}>
          {type === 'expense' ? 'Расходы' : 'Доходы'}
        </Text>
        <Text variant="h2" style={styles.amount}>
          {formatCurrency(type === 'expense' ? data.totalExpenses : data.totalIncome)}
        </Text>
      </View>
      
      <View style={[styles.row, styles.lastRow]}>
        <Text variant="body2" style={styles.label}>
          По сравнению с прошлым месяцем
        </Text>
        <Text
          variant="body2"
          style={[
            styles.amount,
            { color: getComparisonColor(data.comparisonWithPrevious) },
          ]}
        >
          {getComparisonText(data.comparisonWithPrevious)}
        </Text>
      </View>
    </View>
  );
}; 