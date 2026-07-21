export type StatCardTemplate = {
  label: string;
  icon: string;
  color: string;
  metric: 'sessions' | 'ai' | 'learning' | 'tutors';
  showDelta?: boolean;
};

export const STATS: StatCardTemplate[] = [
  {
    label: 'Sessions This Week',
    icon: '📅',
    color: 'blue',
    metric: 'sessions',
    showDelta: true,
  },
  {
    label: 'AI Questions Asked this week',
    icon: '✦',
    color: 'purple',
    metric: 'ai',
  },
  {
    label: 'Hours Learned',
    icon: '⏱',
    color: 'green',
    metric: 'learning',
  },
  {
    label: 'Active Tutors',
    icon: '👥',
    color: 'orange',
    metric: 'tutors',
  },
];
