import React, { createContext, useContext, useEffect, useState } from 'react';

const BookmarksContext = createContext();

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

export const BookmarksProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (article) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(b => b.url === article.url);
      if (isBookmarked) {
        return prev.filter(b => b.url !== article.url);
      }
      return [...prev, article];
    });
  };

  const isBookmarked = (url) => bookmarks.some(b => b.url === url);

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
};
