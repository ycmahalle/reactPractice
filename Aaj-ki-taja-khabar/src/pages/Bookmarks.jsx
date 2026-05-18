import React from 'react';
import { useBookmarks } from '../context/BookmarksContext';
import NewsCard from '../components/NewsCard';
import { BookmarkMinus } from 'lucide-react';

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Saved Articles</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Your personal reading list.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-dark-border text-center px-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
            <BookmarkMinus className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-slate-500 max-w-md">
            When you see an interesting article, click the bookmark icon to save it here for later reading.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((article, i) => (
            <NewsCard key={`${article.url}-${i}`} article={article} category="saved" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
