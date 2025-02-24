import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Account } from '../../types/account';
import { AccountCard } from '../account-card/account-card';
import { AccountsGroupHeader } from '../accounts-group-header';
import { Text } from '../text';
import { useTheme } from '../../contexts/theme-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

type GroupedAccounts = {
  [key: string]: Account[];
};

interface AccountListProps {
  accounts: Account[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onAccountPress: (account: Account) => void;
  onTransfer: (account: Account) => void;
  onEdit: (account: Account) => void;
}

export function AccountList({
  accounts,
  isRefreshing,
  onRefresh,
  onAccountPress,
  onTransfer,
  onEdit,
}: AccountListProps) {
  const { colors } = useTheme();

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
      paddingBottom: 16,
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
      color: colors.textSecondary,
    },
  });

  if (accounts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text variant="body1" style={styles.emptyStateText}>
          You don't have any accounts yet.{'\n'}Add your first account by tapping the "+" button above.
        </Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.content}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {Object.entries(groupedAccounts).map(([group, groupAccounts], groupIndex) => (
          <React.Fragment key={group}>
            <AccountsGroupHeader title={group} />
            {groupAccounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={onAccountPress}
                onTransfer={onTransfer}
                onEdit={onEdit}
                index={groupIndex * groupAccounts.length + index}
              />
            ))}
          </React.Fragment>
        ))}
      </ScrollView>
    </Animated.View>
  );
} 