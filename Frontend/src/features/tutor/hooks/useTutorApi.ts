import { useMutation, useQuery } from "@tanstack/react-query";
import { createTutorProfile, get_tutor_profile, update_tutor_profile } from "../tutorApi";
import { TutorProfilePayload, TutorProfileRead, TutorProfileUpdatePayload } from "../types";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/features/auth";

export const useCreateTutorProfile = () => {
  const mutation = useMutation<any, Error, TutorProfilePayload>({
    mutationKey: ["create-tutor-profile"],
    mutationFn: (payload:TutorProfilePayload) => createTutorProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["Tutorprofile"], updated);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return {
    ...mutation,
    createTutorAsync : mutation.mutateAsync,
  };
};

export const useGetTutorProfile = () => {
  const accessToken = useAuthStore(s=> s.accessToken)
  const {
    data: tutor,
    error,
    isLoading,
    isFetching,
  } = useQuery<TutorProfileRead, Error>({
    queryKey: ["Tutorprofile"],

    queryFn: get_tutor_profile,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 60, // 1 hour (treat as fresh)
    gcTime: 1000 * 60 * 60 * 24, // 24h cache retention

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
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
    tutor,
    error,
    isLoading,
    isFetching,
  };
}

export const useUpdateTutorProfile = () => {
  const mutation = useMutation<TutorProfileRead, Error, TutorProfileUpdatePayload>({
    mutationKey: ["update-tutor-profile"],
    mutationFn: update_tutor_profile,
    onSuccess: (updated) => {
      queryClient.setQueryData(["Tutorprofile"], updated);
    },
  });
  return {
    ...mutation,
    updateAsync: mutation.mutateAsync,
  };
};

