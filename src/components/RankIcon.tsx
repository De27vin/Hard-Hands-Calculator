import {
  Baby,
  Construction,
  Croissant,
  Drill,
  Hammer,
  Laptop,
  Mountain,
  Skull,
} from 'lucide-react';

const icons = [Baby, Croissant, Laptop, Drill, Hammer, Construction, Skull, Mountain];

export function RankIcon({ level, size = 38 }: { level: number; size?: number }) {
  const Icon = icons[Math.min(7, Math.max(0, level - 1))];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
