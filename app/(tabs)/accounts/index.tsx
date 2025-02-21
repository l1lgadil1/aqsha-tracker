import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView, Alert, Pressable } from 'react-native';
import { useTheme } from '../../../src/shared/contexts/theme-context';
import { AccountCard } from '../../../src/shared/ui/account-card/account-card';
import { accountsService } from '../../../src/shared/services/accounts';
import { Account } from '../../../src/shared/types/account';
import { formatAmount } from '../../../src/shared/utils/format';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from '../../../src/shared/ui/text';
import { AccountsHeader } from '../../../src/shared/ui/accounts-header';
import { AccountsGroupHeader } from '../../../src/shared/ui/accounts-group-header';
import { AccountsSkeleton } from '../../../src/shared/ui/accounts-skeleton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetService } from '../../../src/shared/services/reset';

type GroupedAccounts = {
  [key: string]: Account[];
};

export default function AccountsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Group accounts by type
  const groupedAccounts = useMemo(() => {
    return accounts.reduce((groups: GroupedAccounts, account) => {
      if (account.isArchived) return groups;
      const group = account.type.charAt(0).toUpperCase() + account.type.slice(1);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(account);
      return groups;
    }, {});
  }, [accounts]);

  const fetchAccounts = async () => {
    try {
      const fetchedAccounts = await accountsService.getAccounts();
      const total = await accountsService.getTotalBalance();
      setAccounts(fetchedAccounts);
      setTotalBalance(total);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось загрузить счета. Пожалуйста, попробуйте позже.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAccounts();
    setRefreshing(false);
  };

  const handleResetAccounts = async () => {
    try {
      await resetService.resetAllData(true);
      await fetchAccounts();
      Alert.alert('Успех', 'Счета сброшены к значениям по умолчанию');
    } catch (error) {
      console.error('Error resetting accounts:', error);
      Alert.alert('Ошибка', 'Не удалось сбросить счета');
    }
  };

  const handleResetData = async () => {
    try {
      await resetService.resetAllData();
      await fetchAccounts();
      Alert.alert('Успех', 'Все данные успешно сброшены');
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert('Ошибка', 'Не удалось сбросить данные');
    }
  };

  // Refresh accounts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAccounts();
    }, [])
  );

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

  const handleAddAccount = () => {
    router.push('/(tabs)/accounts/edit');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: insets.bottom + 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyStateText: {
      textAlign: 'center',
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

  if (accounts.length === 0) {
    return (
      <View style={styles.container}>
        <AccountsHeader totalBalance={0} />
        <View style={styles.emptyState}>
          <Text variant="body1" style={styles.emptyStateText}>
            У вас пока нет счетов.{'\n'}Добавьте свой первый счет, нажав на кнопку "+" выше.
          </Text>
          <Pressable style={styles.resetButton} onPress={handleResetAccounts}>
            <Text style={styles.resetButtonText}>
              Сбросить к значениям по умолчанию
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.resetButton, { marginTop: 8, backgroundColor: colors.error }]} 
            onPress={handleResetData}
          >
            <Text style={styles.resetButtonText}>
              Сбросить все данные
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
      <View style={styles.container}>
          <AccountsHeader totalBalance={totalBalance} />

          <Animated.View entering={FadeInDown.duration(300)} style={styles.content}>
              <ScrollView
                  style={styles.content}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                      <RefreshControl
                          refreshing={refreshing}
                          onRefresh={handleRefresh}
                          tintColor={colors.primary}
                      />
                  }>
                  {Object.entries(groupedAccounts).map(([group, groupAccounts], groupIndex) => (
                      <React.Fragment key={group}>
                          <AccountsGroupHeader title={group} />
                          {groupAccounts.map((account, index) => (
                              <AccountCard
                                  key={account.id}
                                  account={account}
                                  onPress={handleAccountPress}
                                  onTransfer={handleTransfer}
                                  onEdit={handleEdit}
                                  index={groupIndex * groupAccounts.length + index}
                              />
                          ))}
                      </React.Fragment>
                  ))}
                  <Pressable style={styles.resetButton} onPress={handleResetAccounts}>
                      <Text style={styles.resetButtonText}>Сбросить к значениям по умолчанию</Text>
                  </Pressable>
              </ScrollView>
          </Animated.View>
      </View>
  );
} 