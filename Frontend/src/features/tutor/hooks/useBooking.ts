import { useMutation, useQuery } from '@tanstack/react-query';
import { create_booking, get_sessions } from '../bookingApi';
import type { CreateSessionPayload, Session, SessionRead } from '../types';

export const useCreateSession = () => {
  const mutation = useMutation<Session, Error, CreateSessionPayload>({
    mutationFn: create_booking,
  });
  return { ...mutation, createSession: mutation.mutateAsync };
};

export const useGetSessions = () => {
  const { data, isLoading, error } = useQuery<SessionRead[], Error>({
    queryKey: ['sessions'],
    queryFn: get_sessions,
  });
  return { sessions: data ?? [], isLoading, error };
};
