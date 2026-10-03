import { getCollection } from 'astro:content';
export const categories = [
  ['engineering', 'Engineering'],
  ['ml-ai', 'ML / AI'],
  ['research', 'Research'],
  ['football-analytics', 'Football Analytics'],
  ['build-logs', 'Build Logs'],
] as const;
export async function publishedWriting() {
  return (
    await getCollection(
      'writing',
      ({ data }) => !data.draft && data.status === 'Published',
    )
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
