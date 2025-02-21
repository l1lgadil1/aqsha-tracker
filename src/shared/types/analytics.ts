import { TransactionType } from './transaction';

export type AnalyticsViewType = 'chart' | 'list';
export type AnalyticsTimeRange = 'day' | 'week' | 'month' | 'year';

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  comparisonWithPrevious: number;
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DailyAnalytics {
  date: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionListItem {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category?: {
    id: string;
    name: string;
    color: string;
  };
  account?: {
    id: string;
    name: string;
  };
}

export interface AnalyticsState {
  selectedType: TransactionType;
  viewType: AnalyticsViewType;
  timeRange: AnalyticsTimeRange;
  summary: AnalyticsSummary;
  categoryAnalytics: CategoryAnalytics[];
  dailyAnalytics: DailyAnalytics[];
  transactions: TransactionListItem[];
  currentDate: Date;
  isLoading: boolean;
  error: string | null;
} 