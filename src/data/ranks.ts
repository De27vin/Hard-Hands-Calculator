import type { Rank } from '../types';

export const ranks: Rank[] = [
  {
    min: 0,
    max: 99,
    name: 'BABY HANDS',
    emoji: '🧴',
    description: 'Your hands have never experienced adversity.',
    tagline: 'HANDLE WITH EXTREME CARE.',
    color: '#a8c8f8',
    level: 1,
  },
  {
    min: 100,
    max: 249,
    name: 'BUTTER FINGERS',
    emoji: '🧈',
    description: 'You get blisters from shopping carts.',
    tagline: 'SPREADABLE. NOT FORMIDABLE.',
    color: '#ead28b',
    level: 2,
  },
  {
    min: 250,
    max: 399,
    name: 'OFFICE WARRIOR',
    emoji: '💻',
    description: 'Your toughest battle is a Windows update.',
    tagline: 'PER MY LAST CALLOUS.',
    color: '#94b6d4',
    level: 3,
  },
  {
    min: 400,
    max: 549,
    name: 'WEEKEND HANDYMAN',
    emoji: '🔧',
    description: 'You’ve held a power drill before. Respect.',
    tagline: 'SOME ASSEMBLY REQUIRED.',
    color: '#a8c6a4',
    level: 4,
  },
  {
    min: 550,
    max: 699,
    name: 'CERTIFIED HARD WORKER',
    emoji: '🪵',
    description: 'Your hands have actually seen some action.',
    tagline: 'HONEST WORK. QUESTIONABLE BRAGGING.',
    color: '#e4b580',
    level: 5,
  },
  {
    min: 700,
    max: 849,
    name: 'CONCRETE HANDS',
    emoji: '🏗️',
    description: 'Hand cream gave up on you years ago.',
    tagline: 'BUILT DIFFERENT.',
    color: '#f8c347',
    level: 6,
  },
  {
    min: 850,
    max: 949,
    name: 'INDUSTRIAL WEAPON',
    emoji: '💀',
    description: 'Your hands are classified as heavy machinery.',
    tagline: 'FORKLIFT CERTIFICATION PENDING.',
    color: '#ff793b',
    level: 7,
  },
  {
    min: 950,
    max: 1000,
    name: 'THE FINAL BOSS',
    emoji: '🗿',
    description: 'You sand concrete with your fingertips.',
    tagline: 'THE JOB SITE HAS A BOSS HEALTH BAR.',
    color: '#ff665e',
    level: 8,
  },
];

export function getRank(score: number): Rank {
  const safe = Number.isFinite(score) ? Math.min(1000, Math.max(0, Math.round(score))) : 0;
  return ranks.find((rank) => safe >= rank.min && safe <= rank.max)!;
}
