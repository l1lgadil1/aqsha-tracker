import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../text';
import { useTheme } from '../../contexts/theme-context';
import { AnalyticsTimeRange } from '../../types/analytics';
import { format, subDays, startOfWeek, endOfWeek, subMonths, startOfYear, endOfYear } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DateRangeSelectorProps {
  currentDate: Date;
  timeRange: AnalyticsTimeRange;
  onTimeRangeChange: (range: AnalyticsTimeRange) => void;
  onDateChange: (date: Date) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  currentDate,
  timeRange,
  onTimeRangeChange,
  onDateChange,
}) => {
  const { colors } = useTheme();

  const handlePrevious = () => {
    switch (timeRange) {
      case 'day':
        onDateChange(subDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(subDays(currentDate, 7));
        break;
      case 'month':
        onDateChange(subMonths(currentDate, 1));
        break;
      case 'year':
        onDateChange(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()));
        break;
    }
  };

  const handleNext = () => {
    switch (timeRange) {
      case 'day':
        onDateChange(subDays(currentDate, -1));
        break;
      case 'week':
        onDateChange(subDays(currentDate, -7));
        break;
      case 'month':
        onDateChange(subMonths(currentDate, -1));
        break;
      case 'year':
        onDateChange(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));
        break;
    }
  };

  const getDateRangeText = () => {
    switch (timeRange) {
      case 'day':
        return format(currentDate, 'd MMMM yyyy', { locale: ru });
      case 'week': {
        const start = startOfWeek(currentDate, { locale: ru });
        const end = endOfWeek(currentDate, { locale: ru });
        return `${format(start, 'd')} - ${format(end, 'd MMMM yyyy', { locale: ru })}`;
      }
      case 'month':
        return format(currentDate, 'LLLL yyyy', { locale: ru });
      case 'year':
        return format(currentDate, 'yyyy');
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    iconButton: {
      padding: 8,
    },
    rangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 4,
    },
    rangeButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    activeRangeButton: {
      backgroundColor: colors.primary,
    },
    rangeText: {
      color: colors.textSecondary,
    },
    activeRangeText: {
      color: colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevious} style={styles.iconButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          <Text variant="h3" style={{ color: colors.textPrimary }}>
            {getDateRangeText()}
          </Text>
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.rangeContainer}>
        {(['day', 'week', 'month', 'year'] as AnalyticsTimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              timeRange === range && styles.activeRangeButton,
            ]}
            onPress={() => onTimeRangeChange(range)}
          >
            <Text
              variant="body2"
              style={[
                styles.rangeText,
                timeRange === range && styles.activeRangeText,
              ]}
            >
              {range === 'day' && 'День'}
              {range === 'week' && 'Неделя'}
              {range === 'month' && 'Месяц'}
              {range === 'year' && 'Год'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}; 