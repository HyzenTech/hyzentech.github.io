/** Build-time registry: importing here never ships other articles' data to a reader. */
import configs from '../../data/writing/stories.json';
import { renderThermal, thermalState, thermalOpening } from './thermal';
import { renderTracking, trackingState, trackingOpening } from './tracking';
import { renderBadi, badiState, badiOpening } from './badi';
import { scenes as recruitmentChapters } from '../../data/scrolly/recruitment-story';
import type { StoryDefinition } from './types';
export const storyRegistry: Record<string, StoryDefinition> = {
  'breast-thermal-classification': {
    ...configs['breast-thermal-classification'],
    id: 'breast-thermal-classification',
    render: renderThermal,
    state: thermalState,
    opening: thermalOpening,
  },
  'football-tracking-compactness': {
    ...configs['football-tracking-compactness'],
    id: 'football-tracking-compactness',
    render: renderTracking,
    state: trackingState,
    opening: trackingOpening,
  },
  'badi-analytics': {
    ...configs['badi-analytics'],
    id: 'badi-analytics',
    render: renderBadi,
    state: badiState,
    opening: badiOpening,
  },
};
export function storyFor(id: string) {
  const story = storyRegistry[id];
  if (!story) throw new Error('Unregistered Writing story: ' + id);
  return story;
}
export function chaptersFor(id: string) {
  return id === 'football-recruitment-intelligence-engine'
    ? recruitmentChapters
    : storyFor(id).scenes;
}
export function validateStory(id: string, chapterIds: string[]) {
  const defined = chaptersFor(id).map((c) => c.id);
  if (JSON.stringify(defined) !== JSON.stringify(chapterIds))
    throw new Error('Writing metadata/registry chapter mismatch: ' + id);
}
