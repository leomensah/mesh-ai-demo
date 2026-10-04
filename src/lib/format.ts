import type { AnswerFormat, Query, QueryTrigger } from '@/api/types';

export const FORMATS: { key: AnswerFormat; label: string; name: string }[] = [
  { key: 'resources', label: 'Resources only', name: 'resources only' },
  { key: 'summary', label: 'Short summary', name: 'a short summary' },
  { key: 'paragraph', label: 'Paragraph', name: 'a paragraph' },
  { key: 'report', label: 'Report', name: 'a report' }
];

export const formatLabel = (f: AnswerFormat) => FORMATS.find((x) => x.key === f)!.label;
export const formatName = (f: AnswerFormat) => FORMATS.find((x) => x.key === f)!.name;

/** The format on screen: the user's choice if they made one, otherwise the automatic one. */
export const shownFormat = (q: Query): AnswerFormat => q.formatChosen ?? q.formatAutomatic;

export const TRIGGER_LABEL: Record<QueryTrigger, string> = {
  new_search: 'New session',
  follow_up: 'Follow-up',
  filters_changed: 'Filters changed'
};
