import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth";
import { get_ai_messages } from "./aiApi";
import type { PaginatedAIMessages } from "./types";

export const useGetAiMessages = () => {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, isFetchingNextPage, error, hasNextPage, fetchNextPage } = useInfiniteQuery<PaginatedAIMessages, Error>({
      queryKey: ["ai-messages", user?.id],
      queryFn: ({ pageParam }) => get_ai_messages(pageParam as string | undefined),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage?.next_cursor ?? undefined,
      enabled: !!user?.id,
      staleTime: 1000 * 60 * 5,
    });

  const messages = data?.pages?.flatMap((page) => [...page.messages].reverse()).reverse() ?? [];
  const pageCount = data?.pages?.length ?? 0;

  return { messages, pageCount, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage, error };
};
