import client from './client';

// ── Monthly Report DTOs ──

export interface MonthlySummary {
  totalVibes: number;
  activeDays: number;
  avgPerDay: number;
}

export interface Signature {
  topMood: string;
  topTime: string;
  topSpace: string;
}

export interface MoodKeywordStat {
  word: string;
  count: number;
  percent: number;
}

export interface WeeklyFlow {
  week: string;
  count: number;
}

export interface TimeDistribution {
  time: string;
  percent: number;
}

export interface RecommendationItem {
  name: string;
  match: string;
  score: number;
}

export interface CategoryRecommendation {
  category: string;
  icon: string;
  items: RecommendationItem[];
}

export interface MonthlyReportResponse {
  summary: MonthlySummary;
  signature: Signature;
  moodKeywords: MoodKeywordStat[];
  weeklyFlow: WeeklyFlow[];
  dailyHeatmap: number[][];
  timeDistribution: TimeDistribution[];
  recommendations: CategoryRecommendation[];
}

// ── Yearly Report DTOs ──

export interface YearlySummary {
  totalVibes: number;
  activeDays: number;
  avgPerMonth: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
  topMood: string;
  color: string;
}

export interface QuarterlyEvolution {
  quarter: string;
  moods: string[];
  theme: string;
  color: string;
}

export interface MoodRatio {
  mood: string;
  percent: number;
}

export interface Highlight {
  icon: string;
  title: string;
  value: string;
  detail: string;
}

export interface BestMatching {
  category: string;
  icon: string;
  item: string;
  reason: string;
  score: number;
}

export interface YearlyReportResponse {
  summary: YearlySummary;
  monthlyTrend: MonthlyTrend[];
  quarterlyEvolution: QuarterlyEvolution[];
  moodDistribution: MoodRatio[];
  highlights: Highlight[];
  bestMatching: BestMatching[];
}

// ── API Functions ──

export const getMonthlyReport = (year: number, month: number): Promise<MonthlyReportResponse> =>
  client.get(`/reports/monthly/${year}/${month}`);

export const getYearlyReport = (year: number): Promise<YearlyReportResponse> =>
  client.get(`/reports/yearly/${year}`);
