import type { Conversation, ChatMessage } from '@/features/chat/types';

// ── Student conversations ────────────────────────────────────

export const STUDENT_TUTOR_CONVOS: Conversation[] = [
  { id: 1, name: 'Amara Osei',       color: '#06B6D4', role: 'Tutor · Data Structures', online: true,  time: '2:14 PM',   unread: 1, preview: "The base case is when the node is null — that's when you return." },
  { id: 2, name: 'Fatima Al-Hassan', color: '#F59E0B', role: 'Tutor · Database Systems', online: true,  time: 'Yesterday', unread: 0, preview: 'Sure, we can go over JOIN operations tomorrow.' },
  { id: 3, name: 'Ngozi Adeyemi',    color: '#0891B2', role: 'Tutor · Networks',         online: false, time: 'Monday',    unread: 0, preview: 'See you Thursday at 4pm!' },
  { id: 4, name: 'Chisom Nwosu',     color: '#8B5CF6', role: 'Tutor · Calculus II',      online: true,  time: 'Sunday',    unread: 0, preview: 'Great work on that integration problem!' },
];

export const STUDENT_PEER_CONVOS: Conversation[] = [
  { id: 5, name: 'Blessing Eze', color: '#10B981', role: 'Classmate · Maths Year 3', online: true,  time: '1h ago',    unread: 1, preview: 'Did you finish the assignment yet?' },
  { id: 6, name: 'Tunde Bakare', color: '#EF4444', role: 'Classmate · CS Year 2',    online: false, time: 'Yesterday', unread: 0, preview: 'Same group for the project?' },
];

// ── Tutor conversations ──────────────────────────────────────

export const TUTOR_STUDENT_CONVOS: Conversation[] = [
  { id: 1, name: 'Sam Okafor',    color: '#06B6D4', role: 'Student · CS Year 2',    online: true,  time: '2:11 PM',   unread: 2, preview: "I don't understand in-order traversal with recursion." },
  { id: 2, name: 'Blessing Eze',  color: '#10B981', role: 'Student · Maths Year 3', online: false, time: 'Yesterday', unread: 0, preview: "Thanks so much for yesterday's session!" },
  { id: 3, name: 'Kwame Boateng', color: '#8B5CF6', role: 'Student · CS Year 1',    online: true,  time: 'Monday',    unread: 1, preview: "Can we reschedule Thursday's session?" },
  { id: 4, name: 'Ada Chibuike',  color: '#F59E0B', role: 'Student · CS Year 3',    online: false, time: 'Sunday',    unread: 0, preview: 'Got an A on the exam! Thank you!!' },
];

export const TUTOR_PEER_CONVOS: Conversation[] = [
  { id: 5, name: 'Emeka Okonkwo', color: '#10B981', role: 'Tutor · Physics', online: false, time: '2 days ago', unread: 0, preview: 'Great session today!' },
];

// ── Thread messages keyed by conversation id ─────────────────

const MESSAGES_MOCK: ChatMessage[] = [
  { id: 1, from: 'tutor',   text: 'Hi! I saw your request about binary trees. How can I help?',                                                                         time: '2:10 PM' },
  { id: 2, from: 'student', text: "Yes! I'm struggling with in-order traversal and can't figure out the recursion.",                                                    time: '2:11 PM' },
  { id: 3, from: 'tutor',   text: "No worries! Let's break it down: Left → Root → Right. Each recursive call handles one subtree.",                                     time: '2:12 PM' },
  { id: 4, from: 'student', text: 'Okay that helps. But when does the recursion stop?',                                                                                 time: '2:13 PM' },
  { id: 5, from: 'tutor',   text: "Great question! The base case is when the node is null — that's when you return.",                                                   time: '2:14 PM' },
];

export const THREAD_MESSAGES: Record<number, ChatMessage[]> = {
  1: MESSAGES_MOCK,
  2: [
    { id: 1, from: 'other', text: 'Hey! Can we cover SQL JOINs in our next session?',        time: 'Yesterday' },
    { id: 2, from: 'me',    text: 'Absolutely! INNER, LEFT, and RIGHT JOINs with examples.', time: 'Yesterday' },
    { id: 3, from: 'other', text: 'Perfect. See you tomorrow at 2pm!',                       time: 'Yesterday' },
  ],
  3: [
    { id: 1, from: 'me',    text: 'Confirming our session for Thursday at 4pm.', time: 'Monday' },
    { id: 2, from: 'other', text: 'Confirmed! See you then.',                    time: 'Monday' },
  ],
  4: [
    { id: 1, from: 'other', text: 'Great work on that integration problem!', time: 'Sunday' },
    { id: 2, from: 'me',    text: 'Thank you! It finally clicked 😊',         time: 'Sunday' },
  ],
};
