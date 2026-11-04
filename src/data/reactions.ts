import type { Answers, Reaction } from '../types';

// Intentionally sparse: reactions exist on only eight of thirty questions.
export const reactions: Reaction[] = [
  {
    questionId: 'q2',
    answerIds: ['a0'],
    text: 'Even the weather wants you to quit. Your layering game deserves a medal. 🥶',
  },
  {
    questionId: 'q2',
    answerIds: ['a4'],
    text: '23°C? Someone alert the department of mild inconvenience. 🌡️',
  },
  {
    questionId: 'q5',
    answerIds: ['a0', 'a1'],
    text: 'You clock in before the sun has accepted the meeting invite. 🗿',
  },
  { questionId: 'q5', answerIds: ['a4'], text: 'Bro wakes up when the shift is already over. 💀' },
  {
    questionId: 'q6',
    answerIds: ['a0'],
    text: 'Your spine has requested a transfer. Keep that lifting technique immaculate. 🗿',
  },
  {
    questionId: 'q6',
    answerIds: ['a4'],
    text: 'Careful with that laptop, brother. It has a whole spreadsheet in it. 💻',
  },
  {
    questionId: 'q12',
    answerIds: ['a0'],
    text: 'Your toolbox has more character development than most TV shows. 🔧',
  },
  {
    questionId: 'q12',
    answerIds: ['a4'],
    text: 'Photoshop has tools. The job site has questions. 💀',
  },
  {
    questionId: 'q18',
    answerIds: ['a3', 'a4'],
    text: 'AIR CONDITIONING??? Brother, your thermostat has a better benefits package than us. 💀',
  },
  {
    questionId: 'q19',
    answerIds: ['a3', 'a4'],
    text: 'That chair is doing the heavy lifting. Give it employee of the month. 🪑',
  },
  {
    questionId: 'q24',
    answerIds: ['a0'],
    text: 'The washing machine has officially joined a union. 🧺',
  },
  {
    questionId: 'q29',
    answerIds: ['a4'],
    text: 'We have notified your lumbar cushion. It is being very brave. 🫡',
  },
];

export function getReaction(questionId: string, answerId: string): string | undefined {
  return reactions.find((r) => r.questionId === questionId && r.answerIds.includes(answerId))?.text;
}

export function getCommentary(answers: Answers): string[] {
  const lines: string[] = [];
  if (answers.q1 === 'a0' || answers.q1 === 'a1')
    lines.push(
      'The weather forecast is your daily opponent. You have a personal rivalry with several clouds.',
    );
  if (answers.q1 === 'a3' || answers.q1 === 'a4')
    lines.push(
      'Your keyboard has seen more action than your toolbox. That space bar deserves hazard pay.',
    );
  if (answers.q6 === 'a0' || answers.q6 === 'a1')
    lines.push(
      'Your lower back deserves its own salary. Pay it in good technique, proper help, and actual rest.',
    );
  if (answers.q5 === 'a0' || answers.q5 === 'a1')
    lines.push(
      'You clock in before most people finish dreaming. Even your alarm clock thinks this is excessive.',
    );
  if (answers.q19 === 'a4')
    lines.push(
      'Your office chair has carried this entire operation. We are issuing it a separate certificate.',
    );
  if (answers.q12 === 'a0')
    lines.push(
      'Your toolbox is basically a supporting cast. The 10 mm socket is still missing, though.',
    );
  if (answers.q24 === 'a0')
    lines.push('Your laundry basket has seen things. It would like a quiet retirement by the sea.');
  if (lines.length < 2)
    lines.push(
      'A suspiciously balanced specimen. You can assemble a shelf and also spell “ergonomic.” The committee is confused.',
    );
  if (lines.length < 2)
    lines.push('Your hands contain multitudes. Mostly fingers, but also multitudes.');
  return lines.slice(0, 3);
}
