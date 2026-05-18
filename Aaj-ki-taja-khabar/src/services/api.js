import axios from 'axios';
import { env } from '../config/env';

// Create a configured axios instance for GNews
const api = axios.create({
  baseURL: env.GNEWS_BASE_URL,
});

/**
 * Fetch top news based on query using GNews API
 */
export const fetchNews = async (query = 'geopolitics OR technology', lang = 'en', country = env.DEFAULT_COUNTRY) => {
  if (!env.GNEWS_API_KEY) {
    console.warn("GNews API Key missing.");
    return [];
  }
  
  try {
    const response = await api.get('/search', {
      params: {
        q: query,
        lang,
        country,
        max: env.PAGE_SIZE,
        apikey: env.GNEWS_API_KEY,
      }
    });
    return response.data.articles || [];
  } catch (error) {
    console.error("Error fetching news from GNews API", error);
    throw error;
  }
};

/**
 * Fetch top headlines for general 'trending' category if needed
 */
export const fetchTopHeadlines = async (topic = 'breaking-news', lang = 'en') => {
    if (!env.GNEWS_API_KEY) return [];
    try {
        const response = await api.get('/top-headlines', {
          params: {
            category: topic === 'breaking-news' ? 'general' : topic,
            lang,
            max: env.PAGE_SIZE,
            apikey: env.GNEWS_API_KEY,
          }
        });
        return response.data.articles || [];
      } catch (error) {
        console.error("Error fetching top headlines", error);
        throw error;
      }
}
