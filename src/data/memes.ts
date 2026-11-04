import construction from '../assets/memes/construction.jpeg';
import miner from '../assets/memes/miner.jpeg';
import jobsite from '../assets/memes/jobsite.jpeg';
import { getRank } from './ranks';
import type { Meme } from '../types';

export const memes = {
  construction: {
    id: 'construction',
    src: construction,
    alt: 'Bärtiger SpongeBob mit Bauhelm lehnt auf einem Stahlträger.',
    source: 'https://knowyourmeme.com/photos/3141019-blue-collar-spongebob',
    title: 'SpongeBob auf dem Stahlträger',
    kind: 'hard' as const,
    position: '50% 40%',
  },
  miner: {
    id: 'miner',
    src: miner,
    alt: 'Erschöpfter SpongeBob mit Grubenlampe unter Tage.',
    source: 'https://knowyourmeme.com/photos/3141020-blue-collar-spongebob',
    title: 'SpongeBob unter Tage',
    kind: 'hard' as const,
    position: '50% 35%',
  },
  jobsite: {
    id: 'jobsite',
    src: jobsite,
    alt: 'SpongeBob mit gelbem Helm auf einem Industriegelände.',
    source: 'https://knowyourmeme.com/photos/3141021-blue-collar-spongebob',
    title: 'SpongeBob auf der Baustelle',
    kind: 'hard' as const,
    position: '50% 35%',
  },
};

const local = (file: string) =>
  `${import.meta.env.BASE_URL}images/soft-hands/${encodeURIComponent(file)}`;

// Actual source basenames, preserved in optimized WebP copies. No remote replacement assets.
export const softMemes: Meme[] = [
  {
    id: 'bubble-tea',
    src: local('5282fd4d-aa1d-4633-8be8-6c352cb24cbf.webp'),
    alt: 'Person mit drei Bubble-Tea-Bechern an einem Tisch.',
    title: 'Die Koffein-Baustelle',
    kind: 'soft',
    position: '50% 30%',
  },
  {
    id: 'hand',
    src: local('8878ab65-fc6b-46b1-9c4c-7dd2149a7031.webp'),
    alt: 'Person im Pullover hält eine Hand nach vorn und eine Getränkedose ans Gesicht.',
    title: 'Die Hand-Inspektion',
    kind: 'soft',
    position: '50% 35%',
  },
  {
    id: 'grin',
    src: local('WhatsApp Image 2026-09-17 at 09.32.16.webp'),
    alt: 'Person mit weißem T-Shirt grinst in die Kamera.',
    title: 'Nach fünf Minuten Feierabend',
    kind: 'soft',
    position: '50% 25%',
  },
  {
    id: 'sofa',
    src: local('e97c7f78-f5c1-4b7a-a077-9b67a6bdd00c.webp'),
    alt: 'Person entspannt mit einem Smartphone auf einem Sofa.',
    title: 'Die Erholungsabteilung',
    kind: 'soft',
    position: '50% 45%',
  },
];

export const allMemes: Meme[] = [...softMemes, ...Object.values(memes)];

export function getSoftMeme(index = 0, previousId?: string): Meme {
  let at = ((Math.trunc(index) % softMemes.length) + softMemes.length) % softMemes.length;
  if (softMemes[at].id === previousId) at = (at + 1) % softMemes.length;
  return softMemes[at];
}

// Image choice follows the eight ranks; the five live-reaction bands are separate.
export function getResultMeme(score: number): Meme & { caption: string } {
  const level = getRank(score).level;
  const choices: [Meme, string][] = [
    [softMemes[2], 'Bruder, bei deinen Händen wird sogar das Milchbrötchen zum Schleifpapier.'],
    [softMemes[0], 'Drei Becher angehoben. Jetzt erst mal eine Woche Regeneration.'],
    [softMemes[3], 'Die Klimaanlage fiel aus. Du hast den Vorfall als Außeneinsatz verbucht.'],
    [
      softMemes[1],
      'Ein bisschen Werkzeug, ein bisschen Wellness. Der Inbus ist immerhin beeindruckt.',
    ],
    [memes.jobsite, 'Du packst tatsächlich an. Die Werkzeugkiste zieht kurz den Helm.'],
    [
      memes.construction,
      'Der Vorarbeiter erkennt einen Kollegen. Es gibt das respektvolle Nicken.',
    ],
    [memes.miner, 'Deine Hände brauchen eine eigene Inventarnummer. Die Grube wartet schon.'],
    [memes.construction, 'Der Presslufthammer meldet sich bei dir zur Ausbildung an.'],
  ];
  const [meme, caption] = choices[level - 1];
  return { ...meme, caption };
}

export function preloadMemeImages(): void {
  for (const meme of allMemes) {
    const image = new Image();
    image.src = meme.src;
  }
}
