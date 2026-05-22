import { useMutation } from "@tanstack/react-query";
import { createTutorProfile } from "../tutorApi";
import { TutorProfilePayload } from "../types";
import { queryClient } from "@/lib/react-query";

export const useTutorProfileApi = () => {
  const mutation = useMutation<any, Error, TutorProfilePayload>({
    mutationKey: ["tutor-profile"],
    mutationFn: (payload:TutorProfilePayload) => createTutorProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return {
    ...mutation,
    createTutorAsync : mutation.mutateAsync,
  };
};