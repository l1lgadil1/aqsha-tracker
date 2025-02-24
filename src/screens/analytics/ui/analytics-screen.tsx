import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../../shared/contexts/theme-context';
import { SegmentedControl } from '../../../shared/ui/segmented-control';
import { AnalyticsChart } from '../../../shared/ui/analytics-chart/analytics-chart';
import { AnalyticsSummary } from '../../../shared/ui/analytics-summary/analytics-summary';
import { DateRangeSelector } from '../../../shared/ui/date-range-selector/date-range-selector';
import { TransactionList } from '../../../shared/ui/transaction-list/transaction-list';
import { useAnalyticsModel } from '../model/analytics.model';
import { Text } from '../../../shared/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions, useAccounts } from '../../../shared/hooks/use-app-data';
import { useFocusEffect } from '@react-navigation/native';

export const AnalyticsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { state, handlers, calculateAnalytics } = useAnalyticsModel();
  const { fetchTransactions } = useTransactions();
  const { fetchAccounts } = useAccounts();

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        await Promise.all([
          fetchTransactions(),
          fetchAccounts()
        ]);
        calculateAnalytics();
      };
      refreshData();
    }, [fetchTransactions, fetchAccounts, calculateAnalytics])
  );

  useEffect(() => {
    calculateAnalytics();
  }, [state.currentDate, state.selectedType, state.timeRange, calculateAnalytics]);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: {
      backgroundColor: colors.background,
    },
    segmentedControlContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    content: {
      flex: 1,
    },
    viewTypeContainer: {
      position: 'absolute',
      right: 16,
      bottom: 32,
      flexDirection: 'row',
      gap: 8,
      padding: 4,
      borderRadius: 16,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    viewTypeButton: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    viewTypeButtonActive: {
      backgroundColor: colors.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingContent: {
      alignItems: 'center',
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 4,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: colors.background,
    },
    errorContent: {
      alignItems: 'center',
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 4,
    },
    errorText: {
      color: colors.error,
      marginTop: 16,
      textAlign: 'center',
      maxWidth: '80%',
    },
    chartContainer: {
      marginTop: 8,
      paddingBottom: 80, // Space for FAB
    },
    listContent: {
      paddingBottom: 100, // Extra padding for FAB
    },
  });

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text 
              variant="body1" 
              style={{ color: colors.textSecondary, marginTop: 16 }}
            >
              Загрузка аналитики...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (state.error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={colors.error}
            />
            <Text variant="body1" style={styles.errorText}>
              {state.error}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const showSummary = state.selectedType !== 'transfer';

  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.segmentedControlContainer}>
            <SegmentedControl
              selectedType={state.selectedType}
              onTypeChange={handlers.onTypeChange}
            />
          </View>
          <DateRangeSelector
            currentDate={state.currentDate}
            timeRange={state.timeRange}
            onTimeRangeChange={handlers.onTimeRangeChange}
            onDateChange={handlers.onDateChange}
          />
        </View>
      </View>

      {showSummary && (
        <AnalyticsSummary
          data={state.summary}
          type={state.selectedType as 'expense' | 'income'}
        />
      )}

      {state.viewType === 'chart' && (
        <View style={styles.chartContainer}>
          <AnalyticsChart
            type="pie"
            categoryData={state.categoryAnalytics}
          />
          <AnalyticsChart
            type="bar"
            dailyData={state.dailyAnalytics}
          />
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {state.viewType === 'list' ? (
          <TransactionList 
            transactions={state.transactions}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={[]}
            renderItem={null}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.viewTypeContainer}>
          <TouchableOpacity
            style={[
              styles.viewTypeButton,
              state.viewType === 'chart' && styles.viewTypeButtonActive,
            ]}
            onPress={() => handlers.onViewTypeChange('chart')}
          >
            <MaterialCommunityIcons
              name="chart-pie"
              size={24}
              color={state.viewType === 'chart' ? colors.background : colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewTypeButton,
              state.viewType === 'list' && styles.viewTypeButtonActive,
            ]}
            onPress={() => handlers.onViewTypeChange('list')}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color={state.viewType === 'list' ? colors.background : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}; 