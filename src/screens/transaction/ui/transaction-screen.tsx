import React from 'react';
import { View, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useTheme } from '../../../shared/contexts/theme-context';
import { SegmentedControl } from '../../../shared/ui/segmented-control';
import { AmountDisplay } from '../../../shared/ui/amount-display';
import { AccountSelector } from '../../../shared/ui/account-selector';
import { NumericKeypad } from '../../../shared/ui/numeric-keypad';
import { AccountSelectorModal } from '../../../shared/ui/account-selector-modal';
import { CategorySelectorModal } from '../../../shared/ui/category-selector-modal';
import { TransactionState, TransactionType, Category } from '../../../shared/types/transaction';
import { Account } from '../../../shared/types/account';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface TransactionScreenProps {
  state: TransactionState;
  accountSelectorRef: React.RefObject<BottomSheetModal>;
  categorySelectorRef: React.RefObject<BottomSheetModal>;
  onTypeChange: (type: TransactionType) => void;
  onNumberPress: (num: string) => void;
  onDecimalPress: () => void;
  onDividePress: () => void;
  onConfirmPress: () => void;
  onSourceAccountPress: () => void;
  onDestinationAccountPress: () => void;
  onAccountSelect: (account: Account) => void;
  onCategorySelect: (category: Category) => void;
  onDeletePress: () => void;
  onClearAmount: () => void;
}

export const TransactionScreen: React.FC<TransactionScreenProps> = ({
  state,
  accountSelectorRef,
  categorySelectorRef,
  onTypeChange,
  onNumberPress,
  onDecimalPress,
  onDividePress,
  onConfirmPress,
  onSourceAccountPress,
  onDestinationAccountPress,
  onAccountSelect,
  onCategorySelect,
  onDeletePress,
  onClearAmount,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background
    },
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    topSection: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      paddingBottom: 24,
      marginBottom: 16,
    },
    segmentedControlContainer: {
      alignItems: 'center',
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    amountContainer: {
      paddingHorizontal: 16,
    },
    accountSelectorContainer: {
      marginTop: 16,
      marginBottom: 32,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    keypadSection: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: Platform.OS === 'ios' ? 16 : 24,
      backgroundColor: 'transparent',
    },
  });

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Animated.View 
              entering={FadeInDown.duration(300)}
              style={styles.topSection}
            >
              <View style={styles.segmentedControlContainer}>
                <SegmentedControl
                  selectedType={state.type}
                  onTypeChange={onTypeChange}
                />
              </View>
              <View style={styles.amountContainer}>
                <AmountDisplay amount={state.amount} />
              </View>
              <View style={styles.accountSelectorContainer}>
                <AccountSelector
                  type={state.type}
                  sourceItem={state.sourceAccount}
                  destinationAccount={state.destinationAccount}
                  onSourcePress={onSourceAccountPress}
                  onDestinationPress={onDestinationAccountPress}
                />
              </View>
            </Animated.View>
            <Animated.View 
              entering={FadeInUp.duration(300)}
              style={styles.keypadSection}
            >
              <NumericKeypad
                amount={state.amount}
                type={state.type}
                onNumberPress={onNumberPress}
                onDecimalPress={onDecimalPress}
                onDividePress={onDividePress}
                onConfirmPress={onConfirmPress}
                onDeletePress={onDeletePress}
                onClearAmount={onClearAmount}
              />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
      
      <AccountSelectorModal
        ref={accountSelectorRef}
        onClose={() => accountSelectorRef.current?.dismiss()}
        onSelect={onAccountSelect}
        title={state.type === 'expense' ? 'Откуда списать' : state.type === 'income' ? 'Куда зачислить' : 'Выберите счёт'}
      />

      <CategorySelectorModal
        ref={categorySelectorRef}
        onClose={() => categorySelectorRef.current?.dismiss()}
        onSelect={onCategorySelect}
      />
    </>
  );
}; 
