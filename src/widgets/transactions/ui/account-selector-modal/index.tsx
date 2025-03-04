import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../../shared/contexts/theme-context';
import { Account } from '../../../../shared/types/account';
import { accountsService } from '../../../../shared/services/accounts';
import { formatAmount } from '../../../../shared/utils/format';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

interface AccountSelectorModalProps {
  onClose: () => void;
  onSelect: (account: Account) => void;
  title?: string;
}

export const AccountSelectorModal = React.forwardRef<BottomSheetModal, AccountSelectorModalProps>(
  ({ onClose, onSelect, title = 'Выбрать счёт' }, ref) => {
    const { colors } = useTheme();
    const snapPoints = React.useMemo(() => ['60%'], []);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        console.log('Loading accounts...');
        const fetchedAccounts = await accountsService.getAccounts();
        console.log('Fetched accounts:', fetchedAccounts);

        if (!fetchedAccounts || fetchedAccounts.length === 0) {
          console.log('No accounts found, creating defaults...');
          await accountsService.resetAccounts();
          const defaultAccounts = await accountsService.getAccounts();
          console.log('Default accounts created:', defaultAccounts);
          setAccounts(defaultAccounts);
        } else {
          setAccounts(fetchedAccounts);
        }
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadAccounts();
    }, []);

    const handleAddAccount = () => {
      onClose();
      router.push('/accounts/edit');
    };

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      [],
    );

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
      },
      accountList: {
        paddingHorizontal: 16,
      },
      accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      accountIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      },
      accountIconText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
      },
      accountInfo: {
        flex: 1,
      },
      accountName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
      },
      accountBalance: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginHorizontal: 16,
      },
      addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginLeft: 8,
      },
      contentContainer: {
        flex: 1,
      },
      emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      },
      emptyStateText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
      },
    });

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDynamicSizing={false}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 40,
        }}
        onChange={index => {
          if (index === 0) {
            loadAccounts();
          }
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <View style={styles.accountList}>
            {isLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Загрузка счетов...</Text>
              </View>
            ) : accounts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  У вас пока нет счетов.{'\n'}Добавьте свой первый счёт.
                </Text>
              </View>
            ) : (
              accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.accountItem}
                  onPress={() => {
                    onSelect(account);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.accountIcon,
                      { backgroundColor: account.color || colors.primary },
                    ]}
                  >
                    {account.icon ? (
                      <Text style={styles.accountIconText}>{account.icon}</Text>
                    ) : (
                      <Text style={styles.accountIconText}>
                        {account.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>
                      {formatAmount(account.balance)} {account.currency || '₸'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={handleAddAccount}>
            <Text style={styles.addButtonText}>+ Добавить новый счёт</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
