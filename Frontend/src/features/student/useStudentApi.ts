import { useQuery } from "@tanstack/react-query";
import { get_dashboard_stats } from "./studentApi";
import { StudentDashboardStats } from "./types";

export const useDashboardStats = (studentId?: string) => {
  const { data, isLoading } = useQuery<StudentDashboardStats, Error>({
    queryKey: ['dashboard-stats', studentId],
    queryFn: () => get_dashboard_stats(studentId!),
    enabled: !!studentId,
    staleTime: 6000,
    refetchInterval: 3000,
    refetchOnWindowFocus:true
  });
  return { stats: data, isLoading };
};