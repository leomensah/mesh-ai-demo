import type { FilterKey, Filters } from '@/api/types';

export interface FilterDef {
  key: FilterKey;
  label: string;
  short: string;
  hint: string;
  options: string[];
}

/* The eight filters, in the order they appear in the Filters dialog. */
export const FILTERS: FilterDef[] = [
  { key: "type", label: "Resource type", short: "Type", hint: "Guides, reports, articles, courses and more.", options: ["Article","Guides and tools","Project reports","Published literature","Guideline","Courses","Webinars","Podcasts"] },
  { key: "topic", label: "Topic", short: "Topic", hint: "The engagement approach or theme a resource covers.", options: ["Engagement in clinical trials","Community advisory boards","Schools","Participatory research","Arts and theatre","Communications","Ethics of engagement","Evaluation"] },
  { key: "health", label: "Health area", short: "Health area", hint: "The disease or health area a resource is about.", options: ["Malaria","Vaccines","HIV/AIDS","TB","COVID-19","Ebola","Genetics and genomics","Mental health","Antimicrobial resistance","Child health"] },
  { key: "region", label: "Region", short: "Region", hint: "Where the work took place, or global guidance.", options: ["Global","Sub-Saharan Africa","South Asia","East Asia and Pacific","Latin America and Caribbean","Europe and Central Asia","Middle East and North Africa"] },
  { key: "country", label: "Country", short: "Country", hint: "Where the work took place.", options: ["Botswana","Brazil","Ghana","India","Kenya","Malawi","Nigeria","Sierra Leone","South Africa","United Kingdom","Vietnam"] },
  { key: "hub", label: "Hub", short: "Hub", hint: "The TGHN hub that published the resource.", options: ["Mesh","Global Health Trials","Global Health Bioethics","Global Health Training Centre","REDe"] },
  { key: "lang", label: "Language", short: "Language", hint: "The language the resource is written in.", options: ["English","Español","Português","Français"] },
  { key: "year", label: "Year", short: "Year", hint: "When the resource was published.", options: ["2024 onwards","2020 to 2023","Before 2020"] }
];

export const FILTER_KEYS: FilterKey[] = FILTERS.map((d) => d.key);

export function emptyFilters(): Filters {
  return { type: [], topic: [], health: [], region: [], country: [], hub: [], lang: [], year: [] };
}

export function copyFilters(f?: Partial<Filters> | null): Filters {
  const out = emptyFilters();
  for (const k of FILTER_KEYS) out[k] = f?.[k] ? [...(f[k] as string[])] : [];
  return out;
}

export function countFilters(f: Filters): number {
  return FILTER_KEYS.reduce((n, k) => n + f[k].length, 0);
}

export function filtersInUse(f: Filters): number {
  return FILTER_KEYS.filter((k) => f[k].length > 0).length;
}

export function sameFilters(a: Filters, b: Filters): boolean {
  return FILTER_KEYS.every((k) => a[k].length === b[k].length && a[k].every((v) => b[k].includes(v)));
}

/** "Country: Kenya · Language: English", or "No filters". */
export function describeFilters(f: Filters): string {
  const parts = FILTERS.filter((d) => f[d.key].length).map((d) => d.short + ': ' + f[d.key].join(', '));
  return parts.length ? parts.join(' · ') : 'No filters';
}

/** Just the chosen values, for compact places such as session cards. */
export function filterValues(f: Filters): string {
  const values = FILTERS.flatMap((d) => f[d.key]);
  return values.length ? values.join(' · ') : 'No filters';
}

export function filterDef(key: FilterKey): FilterDef {
  return FILTERS.find((d) => d.key === key) as FilterDef;
}
