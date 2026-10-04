import type { AnswerFormat, Query, Understanding } from '../types';
import { TOPICS } from './topics';

/*
  Prototype rules standing in for the query-understanding model.
  The real service asks a small model for the format and topic, and rewrites follow-ups
  using the session's earlier queries.
*/
const FORMAT_RULES: { test: RegExp; format: AnswerFormat; reason: string }[] = [
  { test: /\breport\b/, format: 'report', reason: 'you asked for a report' },
  { test: /one paragraph|a paragraph|in a paragraph/, format: 'paragraph', reason: 'you asked for one paragraph' },
  { test: /^list\b|\barticles\b|reading list|\bresources\b/, format: 'resources', reason: 'you asked for a list of resources' },
  { test: /summar/, format: 'summary', reason: 'you asked for a summary' }
];

const FORMAT_PHRASE: Record<AnswerFormat, string> = {
  report: 'a report on ',
  paragraph: 'one paragraph on ',
  summary: 'a short summary of ',
  resources: 'resources on '
};

function topicOf(text: string): string | null {
  if (/school/.test(text)) return 'schools';
  if (/malaria|vaccine/.test(text)) return 'malaria';
  if (/clinical trial|trial teams|trials/.test(text)) return 'trials';
  return null;
}

export function understand(text: string, onScreen: Query | null, session: Query[]): Understanding {
  const low = text.trim().toLowerCase();
  const asked = FORMAT_RULES.find((r) => r.test.test(low)) ?? null;
  let topic = topicOf(low);
  let fallback: Understanding['fallback'] = null;
  let formatOnly = false;

  if (!topic) {
    if (onScreen) {
      topic = onScreen.topic;
      if (asked) {
        formatOnly = true; // "write this up as a report": same topic, new format
        if (onScreen.fallback) fallback = 'inherited';
      } else {
        fallback = 'inherited';
      }
    } else {
      topic = 'malaria';
      fallback = low ? 'sample' : null;
    }
  }

  const t = TOPICS[topic];
  const formatAutomatic = asked?.format ?? t.formatAutomatic;
  let searchedAs: string | null = null;
  if (onScreen && !fallback) {
    if (formatOnly) {
      const base = onScreen.searchedAs ?? onScreen.text.charAt(0).toLowerCase() + onScreen.text.slice(1).replace(/\?$/, '');
      searchedAs = FORMAT_PHRASE[formatAutomatic] + base;
    } else if (t.rewrite) {
      searchedAs = t.rewrite({ malaria: session.some((q) => q.topic === 'malaria') });
    }
  }

  return {
    topic,
    fallback,
    formatAutomatic,
    formatReason: asked?.reason ?? t.formatReason,
    formatAsked: !!asked,
    searchedAs
  };
}
