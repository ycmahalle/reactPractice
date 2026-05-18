import { env } from '../config/env';

const positiveWords = ['growth', 'success', 'breakthrough', 'innovative', 'win', 'profit', 'surge', 'boom', 'progress', 'award', 'positive', 'gain', 'victory', 'peace', 'agreement'];
const negativeWords = ['crash', 'fail', 'loss', 'decline', 'scandal', 'crisis', 'tension', 'war', 'threat', 'drop', 'negative', 'conflict', 'lawsuit', 'ban', 'disaster'];

/**
 * A simple client-side naive sentiment analyzer.
 * Returns: { score: number, label: 'Positive' | 'Negative' | 'Neutral' }
 */
export const analyzeSentiment = (text) => {
  if (!env.ENABLE_SENTIMENT || !text) {
    return { score: 0, label: 'Neutral' };
  }

  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  let score = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });

  let label = 'Neutral';
  if (score > 0) label = 'Positive';
  if (score < 0) label = 'Negative';

  return { score, label };
};
