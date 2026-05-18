import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useBookmarks } from '../context/BookmarksContext';
import { usePreferences } from '../context/PreferencesContext';

const NewsCard = ({ article, category = 'general' }) => {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { recordInteraction } = usePreferences();
  
  const bookmarked = isBookmarked(article.url);

  const handleClick = () => {
    recordInteraction(category);
  };

  const publishDate = article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-dark-border"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
          alt={article.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <span className="absolute bottom-3 left-3 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded">
          {article.source?.name || 'News Source'}
        </span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(article);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
        >
          <Bookmark className={`h-5 w-5 ${bookmarked ? 'text-brand-400 fill-brand-400' : 'text-white'}`} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">
            {article.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
            {article.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3 mr-1" />
            {publishDate}
          </div>
          
          <Link 
            to="/article" 
            state={{ article, category }}
            onClick={handleClick}
            className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
          >
            Read more &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
