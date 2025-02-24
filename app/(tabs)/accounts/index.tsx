import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../src/shared/contexts/theme-context';
import { AccountsHeader } from '../../../src/shared/ui/accounts-header';
import { AccountList } from '../../../src/shared/ui/accounts/account-list';
import { AccountsSkeleton } from '../../../src/shared/ui/accounts-skeleton';
import { useAccounts } from '../../../src/shared/hooks/use-accounts';
import { Text } from '../../../src/shared/ui/text';
import { Account } from '../../../src/shared/types/account';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { resetService } from '../../../src/shared/services/reset';

export default function AccountsScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const {
    accounts,
    totalBalance,
    isLoading,
    error,
    fetchAccounts,
  } = useAccounts();

  useFocusEffect(
    React.useCallback(() => {
      fetchAccounts();
    }, [fetchAccounts])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAccounts();
    setRefreshing(false);
  };

  const handleAccountPress = (account: Account) => {
    router.push({
      pathname: '/(tabs)/accounts/[id]',
      params: { id: account.id }
    });
  };

  const handleTransfer = (account: Account) => {
    router.push({
      pathname: '/(tabs)',
      params: { 
        type: 'transfer',
        sourceAccountId: account.id 
      }
    });
  };

  const handleEdit = (account: Account) => {
    router.push({
      pathname: '/(tabs)/accounts/edit',
      params: { id: account.id }
    });
  };

  const handleResetAccounts = async () => {
    try {
      await resetService.resetAllData(true);
      await fetchAccounts();
      Alert.alert('Success', 'Accounts have been reset to default values');
    } catch (error) {
      console.error('Error resetting accounts:', error);
      Alert.alert('Error', 'Failed to reset accounts');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    errorText: {
      textAlign: 'center',
      color: colors.error,
      marginBottom: 16,
    },
    resetButton: {
      backgroundColor: colors.error,
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    resetButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  if (isLoading) {
    return <AccountsSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AccountsHeader totalBalance={0} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={fetchAccounts} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AccountsHeader totalBalance={totalBalance} />
      <AccountList
        accounts={accounts}
        isRefreshing={refreshing}
        onRefresh={handleRefresh}
        onAccountPress={handleAccountPress}
        onTransfer={handleTransfer}
        onEdit={handleEdit}
      />
      {accounts.length === 0 && (
        <Pressable style={styles.resetButton} onPress={handleResetAccounts}>
          <Text style={styles.resetButtonText}>Reset to Default Values</Text>
        </Pressable>
      )}
    </View>
  );
} 