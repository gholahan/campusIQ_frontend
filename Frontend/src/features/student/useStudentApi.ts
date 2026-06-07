import { useQuery } from "@tanstack/react-query";
import { get_dashboard_stats } from "./studentApi";
import { StudentDashboardStats } from "./types";

export const useDashboardStats = (studentId?: string) => {
  const { data, isLoading } = useQuery<StudentDashboardStats, Error>({
    queryKey: ['dashboard-stats', studentId],
    queryFn: () => get_dashboard_stats(studentId!),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
  return { stats: data, isLoading };
};