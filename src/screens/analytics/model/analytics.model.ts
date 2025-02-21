import { useState, useCallback } from 'react';
import { TransactionType, Transaction, Category } from '../../../shared/types/transaction';
import { 
  AnalyticsState, 
  AnalyticsViewType, 
  AnalyticsTimeRange,
  CategoryAnalytics,
  DailyAnalytics,
  TransactionListItem 
} from '../../../shared/types/analytics';
import { transactionsService } from '../../../shared/services/transactions';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { useTheme } from '../../../shared/contexts/theme-context';

export const useAnalyticsModel = () => {
  const { colors } = useTheme();
  
  const [state, setState] = useState<AnalyticsState>({
    selectedType: 'expense',
    viewType: 'list',
    timeRange: 'month',
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netChange: 0,
      comparisonWithPrevious: 0
    },
    categoryAnalytics: [],
    dailyAnalytics: [],
    transactions: [],
    currentDate: new Date(),
    isLoading: false,
    error: null
  });

  const getDateRange = useCallback((date: Date, range: AnalyticsTimeRange) => {
    switch (range) {
      case 'day':
        return {
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
        };
      case 'week':
        return {
          start: startOfWeek(date),
          end: endOfWeek(date)
        };
      case 'month':
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
      case 'year':
        return {
          start: startOfYear(date),
          end: endOfYear(date)
        };
    }
  }, []);

  const calculateAnalytics = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const allTransactions = await transactionsService.getTransactions();
      
      // Get date range based on selected time range
      const { start: currentRangeStart, end: currentRangeEnd } = getDateRange(state.currentDate, state.timeRange);
      const { start: previousRangeStart, end: previousRangeEnd } = getDateRange(
        state.timeRange === 'month' ? subMonths(state.currentDate, 1) : new Date(state.currentDate.getFullYear() - 1, state.currentDate.getMonth()),
        state.timeRange
      );
      
      // Filter transactions for current period
      const currentPeriodTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= currentRangeStart && transactionDate <= currentRangeEnd;
      });

      // Filter transactions for previous period
      const previousPeriodTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= previousRangeStart && transactionDate <= previousRangeEnd;
      });

      // Calculate summary
      const totalIncome = currentPeriodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = currentPeriodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const previousTotal = state.selectedType === 'expense' 
        ? previousPeriodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        : previousPeriodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

      const currentTotal = state.selectedType === 'expense' ? totalExpenses : totalIncome;
      const comparisonWithPrevious = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

      // Calculate category analytics
      const categoryMap = new Map<string, number>();
      currentPeriodTransactions
        .filter(t => t.type === state.selectedType)
        .forEach(t => {
          if (t.category) {
            const current = categoryMap.get(t.category.id) || 0;
            categoryMap.set(t.category.id, current + t.amount);
          }
        });

      const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
      
      const categoryAnalytics: CategoryAnalytics[] = Array.from(categoryMap.entries())
        .map(([categoryId, amount]) => {
          const transaction = currentPeriodTransactions.find(t => t.category?.id === categoryId);
          const category = transaction?.category as Category;
          return {
            categoryId,
            categoryName: category?.name || 'Unknown',
            amount,
            percentage: (amount / total) * 100,
            color: category?.color || colors.primary
          };
        })
        .sort((a, b) => b.amount - a.amount);

      // Calculate daily analytics
      const dailyMap = new Map<string, number>();
      currentPeriodTransactions
        .filter(t => t.type === state.selectedType)
        .forEach(t => {
          const date = format(new Date(t.date), 'yyyy-MM-dd');
          const current = dailyMap.get(date) || 0;
          dailyMap.set(date, current + t.amount);
        });

      const dailyAnalytics: DailyAnalytics[] = Array.from(dailyMap.entries())
        .map(([date, amount]) => ({
          date,
          amount,
          type: state.selectedType
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Prepare transaction list items
      const transactionItems: TransactionListItem[] = currentPeriodTransactions
        .filter(t => state.selectedType === 'transfer' ? true : t.type === state.selectedType)
        .map(t => ({
          id: t.id,
          date: new Date(t.date),
          amount: t.amount,
          type: t.type,
          category: t.category ? {
            id: t.category.id,
            name: t.category.name,
            color: t.category.color
          } : undefined,
          account: t.sourceAccount ? {
            id: t.sourceAccount.id,
            name: t.sourceAccount.name
          } : undefined
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      setState(prev => ({
        ...prev,
        summary: {
          totalIncome,
          totalExpenses,
          netChange: totalIncome - totalExpenses,
          comparisonWithPrevious
        },
        categoryAnalytics,
        dailyAnalytics,
        transactions: transactionItems,
        isLoading: false
      }));

    } catch (error) {
      console.error('Error calculating analytics:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load analytics'
      }));
    }
  }, [state.currentDate, state.selectedType, state.timeRange, colors.primary, getDateRange]);

  const handleTypeChange = useCallback((type: TransactionType) => {
    setState(prev => ({ ...prev, selectedType: type }));
  }, []);

  const handleViewTypeChange = useCallback((viewType: AnalyticsViewType) => {
    setState(prev => ({ ...prev, viewType }));
  }, []);

  const handleTimeRangeChange = useCallback((timeRange: AnalyticsTimeRange) => {
    setState(prev => ({ ...prev, timeRange }));
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  }, []);

  return {
    state,
    handlers: {
      onTypeChange: handleTypeChange,
      onViewTypeChange: handleViewTypeChange,
      onTimeRangeChange: handleTimeRangeChange,
      onDateChange: handleDateChange,
    },
    calculateAnalytics
  };
}; 