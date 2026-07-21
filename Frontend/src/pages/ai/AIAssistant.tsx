import { useState } from 'react';
import { useAIStore } from '@/features/ai/messageStore';
import { useGetAiMessages } from '@/features/ai/useAiApi';
import { AIHeader } from '../../features/ai/components/AIHeader';
import { AIMessageList } from '../../features/ai/components/AIMessageList';
import { AIInput } from '../../features/ai/components/AIInput';
import type { AIMessage } from '@/features/ai/types';

export function AIAssistant() {
  const { messages: optimistic, loading, sendMessage } = useAIStore();
  const [input, setInput] = useState('');

  const { messages: history, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage, pageCount } =
    useGetAiMessages();

  const historyIds = new Set(history.map((m) => m.id));
  const merged: AIMessage[] = [
    ...history,
    ...optimistic.filter((m) => !historyIds.has(m.id)),
  ];

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <AIHeader />
      <div className="flex-1 min-h-0 overflow-hidden">
        <AIMessageList
          messages={merged}
          loading={loading || isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          pageCount={pageCount}
          onLoadMore={fetchNextPage}
        />
      </div>
      <AIInput input={input} loading={loading} onChange={setInput} onSend={send} />
    </div>
  );
}
