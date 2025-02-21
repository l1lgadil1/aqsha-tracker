import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { CategoryAnalytics, DailyAnalytics } from '../../types/analytics';
import { useTheme } from '../../contexts/theme-context';
import { Text } from '../text';

interface AnalyticsChartProps {
  type: 'pie' | 'bar';
  categoryData?: CategoryAnalytics[];
  dailyData?: DailyAnalytics[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  type,
  categoryData = [],
  dailyData = [],
}) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textPrimary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const pieChartData = categoryData.map(category => ({
    name: category.categoryName,
    amount: category.amount,
    color: category.color,
    legendFontColor: colors.textPrimary,
    legendFontSize: 12,
  }));

  const barChartData = {
    labels: dailyData.map(item => item.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: dailyData.map(item => item.amount),
        color: (opacity = 1) => colors.primary,
      },
    ],
  };

  if (type === 'pie' && categoryData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="body1">Нет данных для отображения</Text>
      </View>
    );
  }

  if (type === 'bar' && dailyData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="body1">Нет данных для отображения</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {type === 'pie' ? (
        <PieChart
          data={pieChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <BarChart
          data={barChartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="₸"
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.barChart}
          showValuesOnTopOfBars
          withInnerLines={false}
          fromZero
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 