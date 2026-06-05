import { useMutation } from '@tanstack/react-query';
import { create_booking, CreateBookingPayload, BookingRead } from '../bookingApi';

export const useCreateSession = () => {
  const mutation = useMutation<BookingRead, Error, CreateBookingPayload>({
    mutationFn: create_booking,
  });
  return {
    ...mutation,
    createSession: mutation.mutateAsync,
  };
};
