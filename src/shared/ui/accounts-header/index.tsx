import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/theme-context';
import { Text } from '../text';
import { formatAmount } from '../../utils/format';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AccountsHeaderProps {
  totalBalance: number;
}

export const AccountsHeader: React.FC<AccountsHeaderProps> = ({ totalBalance }) => {
  const { colors } = useTheme();

  const handleAddAccount = () => {
    router.push('/(tabs)/accounts/edit');
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: 16,
      paddingBottom: 24,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    balanceContainer: {
      marginTop: 8,
    },
    balanceLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    balanceRow: {
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
  });

  return (
    <Animated.View 
      entering={FadeInDown.duration(300)}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>Счета</Text>
        <Pressable style={styles.addButton} onPress={handleAddAccount}>
          <Ionicons name="add" size={24} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Общий баланс</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balance}>
            {formatAmount(totalBalance)}
          </Text>
          <Text style={styles.currency}>₸</Text>
        </View>
      </View>
    </Animated.View>
  );
}; 