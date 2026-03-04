import { useQuery } from '@tanstack/react-query';
import { getMonthlyReport, getYearlyReport } from '@/api/report';
import type { MonthlyReportResponse, YearlyReportResponse } from '@/api/report';

export function useMonthlyReport(year: number, month: number) {
  return useQuery<MonthlyReportResponse>({
    queryKey: ['report', 'monthly', year, month],
    queryFn: () => getMonthlyReport(year, month),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

export function useYearlyReport(year: number) {
  return useQuery<YearlyReportResponse>({
    queryKey: ['report', 'yearly', year],
    queryFn: () => getYearlyReport(year),
    staleTime: 5 * 60 * 1000,
  });
}
