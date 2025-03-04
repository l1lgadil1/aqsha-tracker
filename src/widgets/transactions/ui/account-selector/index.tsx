import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Account } from '@/src/shared/types/account';
import { TransactionAccount, TransactionType } from '@/src/shared/types/transaction';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { IncomeSource } from '@/src/shared/types/income-source';

type AccountItem = Account | TransactionAccount | IncomeSource;

interface AccountSelectorProps {
  sourceItem: AccountItem | null;
  destinationAccount: AccountItem | null;
  incomeSource: IncomeSource | null;
  onIncomeSourcePress: () => void;
  onSourcePress: () => void;
  onDestinationPress: () => void;
  type: TransactionType;
}

const getItemColor = (item: AccountItem | null, defaultColor: string): string => {
  if (!item) return defaultColor;
  if ('color' in item) return item.color || defaultColor;
  return defaultColor;
};

const getItemIcon = (item: AccountItem | null): string => {
  if (!item) return '💰';
  if ('icon' in item) return item.icon || '💰';
  return '💰';
};

const AccountButton: React.FC<{
  item: AccountItem | null;
  onPress: () => void;
  placeholder?: string;
  isActive?: boolean;
  entering?: any;
}> = ({ item, onPress, placeholder, isActive = false, entering }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    accountIcon: {
      width: 24,
      height: 24,
      borderRadius: 100,
      backgroundColor: getItemColor(item, colors.primary),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    accountIconText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '600',
    },
    accountInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 100,
      // minWidth: 150,
      // width: '40%',
    },
    accountName: {
      fontSize: 15,
      fontWeight: '600',
      color: item ? colors.textPrimary : colors.textTertiary,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={styles.accountInfo} entering={entering}>
        <View style={styles.accountIcon}>
          <Text style={styles.accountIconText}>{getItemIcon(item)}</Text>
        </View>
        <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">
          {item?.name || placeholder}
        </Text>
        <View style={{ marginLeft: 4 }}>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  sourceItem,
  destinationAccount,
  incomeSource,
  onSourcePress,
  onDestinationPress,
  onIncomeSourcePress,
  type,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 4,
      justifyContent: 'center',
    },
  });

  // For expenses, show only source account selector
  if (type === 'expense') {
    return (
      <View style={styles.container}>
        <AccountButton
          item={sourceItem}
          placeholder="Выберите счёт списания"
          onPress={onSourcePress}
          isActive={true}
          entering={FadeIn.duration(300)}
        />
      </View>
    );
  }

  if (type === 'income') {
    return (
      <View style={styles.container}>
        <AccountButton
          item={incomeSource}
          placeholder={type === 'income' ? 'Источник дохода' : 'Счёт списания'}
          onPress={onIncomeSourcePress}
          isActive={true}
          entering={FadeIn.duration(300)}
        />
        <View style={{ justifyContent: 'center' }}>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.textSecondary} />
        </View>
        <AccountButton
          item={destinationAccount}
          placeholder="Счёт зачисления"
          onPress={onDestinationPress}
          entering={FadeIn.duration(300)}
        />
      </View>
    );
  }
  // For income and transfer, show both source and destination
  return (
    <View style={styles.container}>
      <AccountButton
        item={sourceItem}
        placeholder={type === 'income' ? 'Источник дохода' : 'Счёт списания'}
        onPress={onSourcePress}
        isActive={true}
        entering={FadeIn.duration(300)}
      />
      <View style={{ justifyContent: 'center' }}>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.textSecondary} />
      </View>
      <AccountButton
        item={destinationAccount}
        placeholder="Счёт зачисления"
        onPress={onDestinationPress}
        entering={FadeIn.duration(300)}
      />
    </View>
  );
};
