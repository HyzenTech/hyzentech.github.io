// A teaching example, never a player estimate or the engine's live ranking.
export const profile = [90, 60, 30];
export const metrics = ['Interceptions', 'Tackles', 'Long passes'];
export function weightedExample(values, weights) {
  if (values.length !== weights.length || !values.length)
    throw new Error('Matching non-empty vectors required');
  if (
    values.some((v) => !Number.isFinite(v) || v < 0 || v > 100) ||
    weights.some((w) => !Number.isFinite(w) || w < 0)
  )
    throw new Error('Invalid inputs');
  const total = weights.reduce((a, b) => a + b, 0);
  if (!total) return { score: null, contributions: values.map(() => 0) };
  const contributions = values.map((v, i) => (v * weights[i]) / total);
  return { score: contributions.reduce((a, b) => a + b, 0), contributions };
}
