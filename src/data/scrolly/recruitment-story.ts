export type Scene =
  | 'population'
  | 'profiles'
  | 'pipeline'
  | 'similarity'
  | 'brief'
  | 'ranking'
  | 'explanation'
  | 'system';
export const scenes: {
  id: Scene;
  label: string;
  title: string;
  caption: string;
  wide?: boolean;
}[] = [
  {
    id: 'population',
    label: 'Search space',
    title: 'A season becomes a search space.',
    caption:
      '139 eligible profiles, grouped by broad position. Dim points are ineligible profiles; marks represent player–team–season records, not unique players.',
  },
  {
    id: 'profiles',
    label: 'Profile',
    title: 'A position is a starting point.',
    caption:
      'Eligible centre-back profiles: horizontal = long passes per 90; vertical = interceptions per 90. These are event activity measures, not learned tactical roles.',
  },
  {
    id: 'pipeline',
    label: 'Evidence',
    title: 'The profile is built from evidence.',
    caption:
      'Schematic event flow, verified source counts. Displayed per-90 rates belong to Katrine Veje’s Everton profile; they are not a rating.',
  },
  {
    id: 'similarity',
    label: 'Similarity',
    title: 'Closer means more similar.',
    caption:
      '31 complete candidate peers for Katrine Veje. Horizontal position encodes standardized Euclidean distance; vertical spacing only separates marks. No dimensionality reduction.',
  },
  {
    id: 'brief',
    label: 'The brief',
    title: 'Similar ≠ suitable.',
    caption:
      'Five selected candidates, ordered by their similarity to Veje. Bars reveal their actual CB-brief scores. The stored weights are project conventions, not validated scouting preferences.',
    wide: true,
  },
  {
    id: 'ranking',
    label: 'Shortlist',
    title: 'Change the question. Change the order.',
    caption:
      'The same five examples now follow the stored brief ranking. Rank labels are from the full 32-candidate benchmark; omitted candidates explain the gaps.',
  },
  {
    id: 'explanation',
    label: 'Explanation',
    title: 'A score should explain itself.',
    caption:
      'Kadeisha Buchanan: weighted percentile contributions from the actual CB brief. Long passes contribute less because their weight and percentile are lower; this is not a universal ability score.',
  },
  {
    id: 'system',
    label: 'System',
    title: 'Make the evidence travel.',
    caption:
      'The released pipeline links validated source artifacts to profiles, similarity, ranking, and a local API. Technical checks establish reproducibility, not transfer success.',
    wide: true,
  },
];
export const sceneById = (id: Scene) => scenes.find((s) => s.id === id)!;
