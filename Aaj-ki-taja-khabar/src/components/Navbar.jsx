import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { env } from '../config/env';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b shadow-sm mb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
          {env.APP_NAME}
        </Link>
        
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Search news..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-dark-border bg-slate-100 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </form>

        <div className="flex items-center space-x-4">
          <Link to="/bookmarks" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Bookmarks">
            <Bookmark className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
