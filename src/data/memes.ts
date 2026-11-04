import construction from '../assets/memes/construction.jpeg';
import miner from '../assets/memes/miner.jpeg';
import jobsite from '../assets/memes/jobsite.jpeg';

export const memes = {
  construction: {
    src: construction,
    alt: 'Bearded Blue Collar SpongeBob in a battered hard hat, leaning on a steel beam.',
    source: 'https://knowyourmeme.com/photos/3141019-blue-collar-spongebob',
    title: 'Tired Construction Worker SpongeBob',
  },
  miner: {
    src: miner,
    alt: 'Exhausted Blue Collar SpongeBob wearing a miner’s helmet underground.',
    source: 'https://knowyourmeme.com/photos/3141020-blue-collar-spongebob',
    title: 'Coal Miner SpongeBob',
  },
  jobsite: {
    src: jobsite,
    alt: 'Weathered Blue Collar SpongeBob in a yellow hard hat at an industrial job site.',
    source: 'https://knowyourmeme.com/photos/3141021-blue-collar-spongebob',
    title: 'SpongeBob On the Job Site',
  },
};

export function getResultMeme(score: number) {
  if (score < 400)
    return { ...memes.miner, caption: 'You answered one email. Somehow, this is how you feel.' };
  if (score < 700)
    return {
      ...memes.jobsite,
      caption: 'One shelf assembled. Already discussing early retirement.',
    };
  return {
    ...memes.construction,
    caption: 'The foreman recognizes one of his own. The nod has been granted.',
  };
}

export function getReactionMeme(questionId: string) {
  if (['q2', 'q5', 'q24'].includes(questionId)) return memes.miner;
  if (['q6', 'q12'].includes(questionId)) return memes.jobsite;
  return memes.construction;
}
