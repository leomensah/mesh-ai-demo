import type { MeshApi } from '../client';
import type { AnswerRequest, Filters, FilterKey, RankedResource } from '../types';
import { RESOURCES } from './resources';
import { TOPICS } from './topics';
import { understand } from './understand';

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

function matches(tags: Partial<Filters>, filters: Filters): boolean {
  return (Object.keys(filters) as FilterKey[]).every((k) => {
    const chosen = filters[k];
    if (!chosen.length) return true;
    return (tags[k] ?? []).some((v) => chosen.includes(v));
  });
}

/** Builds the answer text: fills in the source count and drops citations the user cannot see. */
export function buildAnswer(req: AnswerRequest): string {
  const topic = TOPICS[req.topic];
  return topic.answers[req.format]({ malaria: req.malariaContext })
    .replace(/\{N\}/g, String(req.visible.length))
    .replace(/\[(\d+)\]/g, (m, n: string) => (req.visible.includes(Number(n)) ? m : ''))
    .replace(/ +([.,;:])/g, '$1')
    .replace(/ +\n/g, '\n')
    .replace(/ +$/g, '');
}

export const mockApi: MeshApi = {
  async understand(text, onScreen, session) {
    await wait(120);
    return understand(text, onScreen, session);
  },

  async search(topicKey, filters) {
    await wait(380);
    const topic = TOPICS[topicKey];
    const ranked: RankedResource[] = topic.sources.map((id, i) => ({ ...RESOURCES[id], n: i + 1 }));
    return {
      resources: ranked.filter((r) => matches(r.tags, filters)),
      totalBeforeFilters: ranked.length
    };
  },

  async *streamAnswer(req, signal) {
    const text = buildAnswer(req);
    await wait(req.format === 'report' ? 900 : 450, signal);
    const tokens = text.match(/\S+\s*/g) ?? [];
    for (let i = 0; i < tokens.length; i += 3) {
      yield tokens.slice(i, i + 3).join('');
      await wait(26, signal);
    }
  }
};
