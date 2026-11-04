import type { Rank } from '../types';

export const ranks: Rank[] = [
  {
    min: 0,
    max: 99,
    name: 'BABYHÄNDE',
    emoji: '🧴',
    description:
      'Bruder, deine Hände sind so weich, selbst Seife fasst sie nur mit Handschuhen an.',
    tagline: 'BITTE NUR AUF SAMT ABLEGEN.',
    color: '#a8c8f8',
    level: 1,
  },
  {
    min: 100,
    max: 249,
    name: 'BUTTERFINGER',
    emoji: '🧈',
    description: 'Du kriegst Blasen vom Öffnen einer Wasserflasche. Ohne Kohlensäure.',
    tagline: 'STREICHZART SEIT TAG EINS.',
    color: '#ead28b',
    level: 2,
  },
  {
    min: 250,
    max: 399,
    name: 'BÜROGLADIATOR',
    emoji: '💻',
    description:
      'Dein härtester Arbeitstag war der Ausfall der Klimaanlage. Es gab einen Krisen-Call.',
    tagline: 'GEFAHRENZULAGE FÜR EXCEL.',
    color: '#94b6d4',
    level: 3,
  },
  {
    min: 400,
    max: 549,
    name: 'WOCHENEND-SCHRAUBER',
    emoji: '🔧',
    description:
      'Du hast schon mal einen Akkuschrauber gehalten. Der Nachbar musste nur zweimal kommen.',
    tagline: 'DREI SCHRAUBEN ÜBRIG. PASST.',
    color: '#a8c6a4',
    level: 4,
  },
  {
    min: 550,
    max: 699,
    name: 'ECHTER ANPACKER',
    emoji: '🪵',
    description:
      'Deine Hände haben was erlebt. Und diesmal meinst du nicht die Bedienung einer Liefer-App.',
    tagline: 'DER ZOLLSTOCK NICKT ANERKENNEND.',
    color: '#e4b580',
    level: 5,
  },
  {
    min: 700,
    max: 849,
    name: 'BETONHÄNDE',
    emoji: '🏗️',
    description: 'Dein Händedruck braucht eine Bauabnahme. Der Beton fragt dich nach Pflegetipps.',
    tagline: 'AB WERK AUF ROBUST GESTELLT.',
    color: '#f8c347',
    level: 6,
  },
  {
    min: 850,
    max: 949,
    name: 'INDUSTRIEWAFFE',
    emoji: '💀',
    description:
      'Deine Hände stehen im Anlagenverzeichnis. Die Buchhaltung schreibt sie über zehn Jahre ab.',
    tagline: 'BITTE NICHT OHNE EINWEISUNG.',
    color: '#ff793b',
    level: 7,
  },
  {
    min: 950,
    max: 1000,
    name: 'DER ENDBOSS',
    emoji: '🗿',
    description:
      'Du schleifst Beton mit den Fingerspitzen. Der Presslufthammer nennt dich Ausbilder.',
    tagline: 'DIE BAUSTELLE HAT JETZT EINEN LEBENSBALKEN.',
    color: '#ff665e',
    level: 8,
  },
];

export function getRank(score: number): Rank {
  const safe = Number.isFinite(score) ? Math.min(1000, Math.max(0, Math.round(score))) : 0;
  return ranks.find((rank) => safe >= rank.min && safe <= rank.max)!;
}
