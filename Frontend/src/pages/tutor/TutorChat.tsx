import { useParams } from 'react-router-dom';
import { TUTOR_STUDENT_CONVOS, TUTOR_PEER_CONVOS } from '@/features/chat/data/conversations';
import { ConversationList, ChatWindow } from '@/features/chat/components';

const TABS = [
  { key: 'students', label: 'Students', convos: TUTOR_STUDENT_CONVOS },
  { key: 'tutors',   label: 'Tutors',   convos: TUTOR_PEER_CONVOS },
];
const ALL = [...TUTOR_STUDENT_CONVOS, ...TUTOR_PEER_CONVOS];

export function TutorChat() {
  const { convoId } = useParams<{ convoId: string }>();
  const convo = convoId ? ALL.find((c) => c.id === Number(convoId)) : null;
  if (convo) return <ChatWindow convo={convo} backPath="/tutor/chat" />;
  return <ConversationList tabs={TABS} basePath="/tutor/chat" />;
}
