import type { ChapterConfig } from '../../scripts/writing/controller';
export interface MarkState {
  id: string;
  x: number;
  y: number;
  opacity?: number;
  fill?: string;
  r?: number;
}
export interface StoryDefinition {
  id: string;
  theme: string;
  preview: string;
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    premise: string;
    note: string;
    metrics: { value: string; label: string }[];
  };
  scenes: ChapterConfig[];
  ending: { title: string; text: string };
  render: (id: string, mobile?: boolean, persistent?: boolean) => string;
  opening: () => string;
  state?: (id: string) => MarkState[];
}
