import { useMutation, useQuery } from "@tanstack/react-query";
import { get_user_profile, sync_user } from "../api/authApi";
import type { SyncUserPayload, User } from "../types";

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

export const useGetProfile = () => {
  const {
    data: user,
    error: apiError,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profile"],
    queryFn: get_user_profile,
  });
  return {
    user,
    apiError,
    isLoading,
  };

};