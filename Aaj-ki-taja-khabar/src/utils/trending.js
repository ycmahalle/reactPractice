import { env } from '../config/env';

/**
 * Extracts trending keywords from an array of articles
 */
export const extractTrendingTopics = (articles) => {
  if (!env.ENABLE_TRENDING || !articles || articles.length === 0) return [];

  const stopWords = new Set(['the', 'is', 'in', 'and', 'to', 'a', 'of', 'for', 'on', 'with', 'as', 'at', 'by', 'an', 'this', 'that', 'it', 'from', 'are', 'was', 'were', 'will']);
  
  const wordCounts = {};

  articles.forEach(article => {
    if (!article.title) return;
    const words = article.title.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });

  const sortedKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, 5); // top 5 topics

  return sortedKeywords;
};
