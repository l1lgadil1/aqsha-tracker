import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '../../../src/shared/contexts/theme-context';
import { Transaction } from '../../../src/shared/types/transaction';
import { Account } from '../../../src/shared/types/account';
import { formatAmount } from '../../../src/shared/utils/format';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../src/shared/ui/text';
import { useAccounts } from '../../../src/shared/hooks/use-accounts';
import { TransactionList } from '../../../src/shared/ui/transactions/transaction-list';
import { AccountsSkeleton } from '../../../src/shared/ui/accounts-skeleton';

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccountWithTransactions, deleteAccount } = useAccounts();

  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const fetchAccountDetails = async () => {
    if (!id || typeof id !== 'string') {
      setError('Invalid account ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await getAccountWithTransactions(id);
      setAccount(result.account);
      setTransactions(result.transactions as Transaction[]);
    } catch (error) {
      console.error('Error fetching account details:', error);
      setError('Failed to load account details');
      if ((error as Error).message === 'Account not found') {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPress = () => {
    if (!account) return;
    router.push({
      pathname: '/(tabs)/accounts/edit',
      params: { id: account.id }
    });
  };

  const handleDeletePress = async () => {
    if (!account) return;

    if (account.isDefault) {
      Alert.alert(
        'Cannot Delete Default Account',
        'This is a default account and cannot be deleted. You can archive it instead if you don\'t want to use it.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(account.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
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
    defaultAccountBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginTop: 4,
    },
    defaultAccountText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '500',
    },
  });

  if (isLoading) {
    return <AccountsSkeleton />;
  }

  if (error || !account) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Account not found'}</Text>
          <Pressable onPress={fetchAccountDetails} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
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
                  Edit
                </Text>
              </Pressable>
              {!account.isDefault && (
                <Pressable
                  onPress={handleDeletePress}
                  style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                  <Text style={[styles.actionButtonText, { color: colors.error }]}>
                    Delete
                  </Text>
                </Pressable>
              )}
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
          {account.isDefault && (
            <View style={styles.defaultAccountBadge}>
              <Text style={styles.defaultAccountText}>Default Account</Text>
            </View>
          )}
          <View style={styles.balanceContainer}>
            <Text style={styles.balance}>
              {formatAmount(account.balance)}
            </Text>
            <Text style={styles.currency}>{account.currency || '₸'}</Text>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <TransactionList
            transactions={transactions}
            accountId={account.id}
            currency={account.currency}
          />
        </View>
      </ScrollView>
    </>
  );
} 