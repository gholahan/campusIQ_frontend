import { useParams } from 'react-router-dom';
import { STUDENT_TUTOR_CONVOS, STUDENT_PEER_CONVOS } from '@/features/chat/data/conversations';
import { ConversationList, ChatWindow } from '@/features/chat/components';

const TABS = [
  { key: 'tutors', label: 'Tutors', convos: STUDENT_TUTOR_CONVOS },
  { key: 'peers',  label: 'Peers',  convos: STUDENT_PEER_CONVOS },
];
const ALL = [...STUDENT_TUTOR_CONVOS, ...STUDENT_PEER_CONVOS];

export function StudentChat() {
  const { convoId } = useParams<{ convoId: string }>();
  const convo = convoId ? ALL.find((c) => c.id === Number(convoId)) : null;
  if (convo) return <ChatWindow convo={convo} backPath="/student/chat" />;
  return <ConversationList tabs={TABS} basePath="/student/chat" />;
}
