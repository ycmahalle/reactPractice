/**
 * Environment variables configuration
 * Exposes a strongly typed, safely parsed object for app-wide use.
 */

export const env = {
  // API Keys & URLs
  GNEWS_API_KEY: import.meta.env.VITE_GNEWS_API_KEY || '',
  GNEWS_BASE_URL: import.meta.env.VITE_GNEWS_BASE_URL || 'https://gnews.io/api/v4',
  
  HF_TOKEN: import.meta.env.VITE_HF_TOKEN || '',
  HF_MODEL: import.meta.env.VITE_HF_MODEL || 'sshleifer/distilbart-cnn-12-6',
  HF_API_URL: import.meta.env.VITE_HF_API_URL || 'https://api-inference.huggingface.co/models/',
  
  // App Config
  APP_NAME: import.meta.env.VITE_APP_NAME || 'GeoTech News',
  DEFAULT_COUNTRY: import.meta.env.VITE_DEFAULT_COUNTRY || 'us',
  PAGE_SIZE: Number(import.meta.env.VITE_PAGE_SIZE) || 10,
  DEBOUNCE_DELAY: Number(import.meta.env.VITE_DEBOUNCE_DELAY) || 400,
  
  // Feature Flags
  ENABLE_TRENDING: import.meta.env.VITE_ENABLE_TRENDING === 'true',
  ENABLE_SENTIMENT: import.meta.env.VITE_ENABLE_SENTIMENT === 'true',
  ENABLE_AI_FEED: import.meta.env.VITE_ENABLE_AI_FEED === 'true',
};
