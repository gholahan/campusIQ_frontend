import { useMutation, useQuery } from "@tanstack/react-query";
import { get_me, get_user_profile, sync_user } from "../api/authApi";
import type { MeResponse, SyncUserPayload, User } from "../types";
import { useAuthStore } from "../authStore";

export const useSyncUser = () => {
  const mutation = useMutation<User, Error, SyncUserPayload>({
    mutationKey: ["sync-user"],
    mutationFn: (payload: SyncUserPayload) => sync_user(payload),
  });
  return {
    ...mutation,
    syncUserAsync: mutation.mutateAsync,
  };
};

export const useGetMe = () => {
  const accessToken = useAuthStore(s=> s.accessToken)
  const {
    data: me,
    error: apiError,
    isLoading,
    isFetching,
  } = useQuery<MeResponse, Error>({
    queryKey: ["me"],

    queryFn: get_me,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 60, // 1 hour (treat as fresh)
    gcTime: 1000 * 60 * 60 * 24, // 24h cache retention

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: (failureCount, error: any) => {
      // never retry auth failures
      if (error?.status === 401) {
        return false;
      }

      // retry network/server failures up to 2 times
      return failureCount < 2;
    },
  });

  return {
    me,
    apiError,
    isLoading,
    isFetching,
  };
};

export const useGetProfile = () => {
  const accessToken = useAuthStore(s=> s.accessToken)
  const {
    data: user,
    error: apiError,
    isLoading,
    isFetching,
  } = useQuery<User, Error>({
    queryKey: ["profile"],

    queryFn: get_user_profile,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 60, // 1 hour (treat as fresh)
    gcTime: 1000 * 60 * 60 * 24, // 24h cache retention

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: (failureCount, error: any) => {
      // never retry auth failures
      if (error?.status === 401) {
        return false;
      }

      // retry network/server failures up to 2 times
      return failureCount < 2;
    },
  });

  return {
    user,
    apiError,
    isLoading,
    isFetching,
  };
};