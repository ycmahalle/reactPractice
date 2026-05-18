import React, { createContext, useContext, useEffect, useState } from 'react';
import { env } from '../config/env';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  // Store clicked topics/keywords
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('user_topic_preferences');
    return saved ? JSON.parse(saved) : { technology: 0, geopolitics: 0, 'world-news': 0 };
  });

  useEffect(() => {
    if (env.ENABLE_AI_FEED) {
      localStorage.setItem('user_topic_preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  const recordInteraction = (topic) => {
    if (!env.ENABLE_AI_FEED) return;
    
    setPreferences(prev => ({
      ...prev,
      [topic]: (prev[topic] || 0) + 1
    }));
  };

  const getTopPreference = () => {
    if (!env.ENABLE_AI_FEED) return 'general';
    const sorted = Object.entries(preferences).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 && sorted[0][1] > 0 ? sorted[0][0] : 'general';
  };

  return (
    <PreferencesContext.Provider value={{ preferences, recordInteraction, getTopPreference }}>
      {children}
    </PreferencesContext.Provider>
  );
};
