import { useAuthStore } from "@/features/auth";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { createTutorProfile, get_search_tutor, get_tutor_by_id, get_tutor_profile, update_tutor_profile } from "../tutorApi";
import { TutorProfilePayload, TutorProfileRead, TutorProfileUpdatePayload, TutorSearchParams, TutorSearchResult } from "../types";

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

export const useSearchTutors = (params: TutorSearchParams) => {
  const accessToken = useAuthStore(s => s.accessToken);
  const { data, isLoading, isFetching, error } = useQuery<TutorSearchResult, Error>({
    queryKey: ["tutor-search", params],
    queryFn: () => get_search_tutor(params),
    enabled: !!accessToken,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
  return {
    tutors: data?.tutors ?? [],
    total: data?.total ?? 0,
    isLoading,
    isFetching,
    error,
  };
};

export const tutorKey = (id: string) => ["tutor", id] as const;

export function useTutorPrefetch() {
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeId = useRef<string | null>(null);

  const prefetchTutor = (id: string) => {
    activeId.current = id;

    const existing = queryClient.getQueryData(tutorKey(id));
    if (existing) return;

    hoverTimeout.current = setTimeout(() => {
      // 1. DATA PREFETCH
      queryClient.prefetchQuery({
        queryKey: tutorKey(id),
        queryFn: () => get_tutor_by_id(id),
        staleTime: 1000 * 60 * 10,
      });

      // 2. ROUTE PREFETCH (BIG UX BOOST)
      import("@/pages/student/TutorProfileView")
    }, 80);
  };

  const cancelPrefetch = (id?: string) => {
    // only cancel if leaving same card
    if (id && activeId.current !== id) return;

    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  return { prefetchTutor, cancelPrefetch };
}
