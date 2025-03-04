import { Fragment } from 'react';
import { useTransactionModel } from './lib/use-transaction-model';
import { Layout } from './ui/layout/layout';
import { AccountSelectorModal } from './ui/account-selector-modal';
import { CategorySelectorModal } from './ui/category-selector-modal';
import { SegmentedControl } from './ui/segmented-control';
import { AmountDisplay } from './ui/amount-display';
import { AccountSelector } from './ui/account-selector';
import { NumericKeypad } from './ui/numeric-keypad';
import { IncomeSourceModal } from './ui/income-source-modal';

export const TransactionWidget = () => {
  const { state, accountSelectorRef, categorySelectorRef, incomeSourceSelectorRef, handlers } =
    useTransactionModel();
  const {
    onAccountSelect,
    onCategorySelect,
    onNumberPress,
    onConfirmPress,
    onDeletePress,
    onClearAmount,
    onSourceAccountPress,
    onDestinationAccountPress,
    onTypeChange,
    getAccountSelectorTitle,
    onIncomeSourceSelect,
    onIncomeSourcePress,
  } = handlers;

  return (
    <Layout
      modals={
        <Fragment>
          <AccountSelectorModal
            onClose={() => accountSelectorRef?.current?.dismiss()}
            onSelect={onAccountSelect}
            title={getAccountSelectorTitle()}
            ref={accountSelectorRef}
          />
          <CategorySelectorModal
            onClose={() => categorySelectorRef?.current?.dismiss()}
            onSelect={onCategorySelect}
            ref={categorySelectorRef}
          />
          <IncomeSourceModal
            onClose={() => incomeSourceSelectorRef?.current?.dismiss()}
            onSelect={onIncomeSourceSelect}
            ref={incomeSourceSelectorRef}
          />
        </Fragment>
      }
      segmentedControl={<SegmentedControl selectedType={state.type} onTypeChange={onTypeChange} />}
      amountDisplay={<AmountDisplay amount={state.amount} />}
      accountSelector={
        <AccountSelector
          incomeSource={state.incomeSource}
          sourceItem={state.sourceAccount}
          destinationAccount={state.destinationAccount}
          onIncomeSourcePress={onIncomeSourcePress}
          onSourcePress={onSourceAccountPress}
          onDestinationPress={onDestinationAccountPress}
          type={state.type}
        />
      }
      numericKeypad={
        <NumericKeypad
          amount={state.amount}
          type={state.type}
          onNumberPress={onNumberPress}
          onConfirmPress={onConfirmPress}
          onDeletePress={onDeletePress}
          onClearAmount={onClearAmount}
        />
      }
    />
  );
};
