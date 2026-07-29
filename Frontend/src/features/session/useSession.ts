import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  create_session, get_student_sessions, get_tutor_sessions,
  get_session, accept_session, decline_session, cancel_session,
  start_session, end_session, submit_review, get_review,
} from './sessionApi';
import type { CreateSessionPayload, Session, SessionRead, AcceptSessionPayload, ReviewCreate, ReviewRead } from './types';

export const useCreateSession = () => {

  const mutation = useMutation<Session, Error, CreateSessionPayload>({
    mutationFn: create_session,
  });
  useQueryClient().invalidateQueries({ queryKey: ["student_dashboard_stats"] });
  return { ...mutation, createSession: mutation.mutateAsync };
};

export const useGetStudentSessions = (payload?: Partial<Session>) => {
  const { data, isLoading, error } = useQuery<SessionRead[], Error>({
    queryKey: ["student-sessions", payload],
    queryFn: () => get_student_sessions(payload ?? {}),
  });
  return { sessions: data ?? [], isLoading, error };
};

export const useGetTutorSessions = (payload?: Partial<Session>) => {
  const { data, isLoading, error } = useQuery<SessionRead[], Error>({
    queryKey: ["tutor-sessions", payload],
    queryFn: () => get_tutor_sessions(payload ?? {}),
  });
  return { sessions: data ?? [], isLoading, error };
};

export const useGetSession = (id: string) => {
  const { data, isLoading, error } = useQuery<SessionRead, Error>({
    queryKey: ["session", id],
    queryFn: () => get_session(id),
    enabled: !!id,
  });
  return { session: data, isLoading, error };
};

export const useAcceptSession = () => {
  const qc = useQueryClient();
  const mutation = useMutation<SessionRead, Error, { id: string; payload: AcceptSessionPayload }>({
    mutationFn: ({ id, payload }) => accept_session(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["session", id] });
      qc.invalidateQueries({ queryKey: ["tutor-sessions"] });
    },
  });
  return { ...mutation, acceptSession: mutation.mutateAsync };
};

export const useDeclineSession = () => {
  const qc = useQueryClient();
  const mutation = useMutation<SessionRead, Error, string>({
    mutationFn: decline_session,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["session", id] });
      qc.invalidateQueries({ queryKey: ["tutor-sessions"] });
    },
  });
  return { ...mutation, declineSession: mutation.mutateAsync };
};

export const useCancelSession = () => {
  const qc = useQueryClient();
  const mutation = useMutation<SessionRead, Error, string>({
    mutationFn: cancel_session,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["session", id] });
      qc.invalidateQueries({ queryKey: ["student-sessions"] });
    },
  });
  return { ...mutation, cancelSession: mutation.mutateAsync };
};

export const useStartSession = () => {
  const qc = useQueryClient();
  const mutation = useMutation<SessionRead, Error, string>({
    mutationFn: start_session,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["session", id] });
    },
  });
  return { ...mutation, startSession: mutation.mutateAsync };
};

export const useEndSession = () => {
  const qc = useQueryClient();
  const mutation = useMutation<SessionRead, Error, string>({
    mutationFn: end_session,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["session", id] });
      qc.invalidateQueries({ queryKey: ["student-sessions"] });
      qc.invalidateQueries({ queryKey: ["tutor-sessions"] });
    },
  });
  return { ...mutation, endSession: mutation.mutateAsync };
};

export const useSubmitReview = () => {
  const mutation = useMutation<ReviewRead, Error, { id: string; payload: ReviewCreate }>({
    mutationFn: ({ id, payload }) => submit_review(id, payload),
  });
  return { ...mutation, submitReview: mutation.mutateAsync };
};

export const useGetReview = (id: string) => {
  const { data, isLoading, error } = useQuery<ReviewRead, Error>({
    queryKey: ["review", id],
    queryFn: () => get_review(id),
    enabled: !!id,
  });
  return { review: data, isLoading, error };
};