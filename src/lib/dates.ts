const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const two = (n: number) => (n < 10 ? '0' : '') + n;

export function daysAgo(iso: string): number {
  const a = new Date(iso);
  a.setHours(0, 0, 0, 0);
  const b = new Date();
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function clock(iso: string): string {
  const d = new Date(iso);
  return two(d.getHours()) + ':' + two(d.getMinutes());
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
}

/** "Today, 14:05", "Yesterday, 09:10" or "Thu 1 Oct". */
export function whenLong(iso: string): string {
  const n = daysAgo(iso);
  if (n === 0) return 'Today, ' + clock(iso);
  if (n === 1) return 'Yesterday, ' + clock(iso);
  return shortDate(iso);
}

/** "14:05" for today and yesterday, otherwise "Thu 1 Oct". */
export function whenShort(iso: string): string {
  return daysAgo(iso) <= 1 ? clock(iso) : shortDate(iso);
}

export type DateGroup = 'Today' | 'Yesterday' | 'Previous 7 days' | 'Earlier';
export const DATE_GROUPS: DateGroup[] = ['Today', 'Yesterday', 'Previous 7 days', 'Earlier'];

export function dateGroup(iso: string): DateGroup {
  const n = daysAgo(iso);
  if (n === 0) return 'Today';
  if (n === 1) return 'Yesterday';
  if (n <= 7) return 'Previous 7 days';
  return 'Earlier';
}
