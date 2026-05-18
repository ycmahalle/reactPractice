import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarksProvider } from './context/BookmarksContext';
import { PreferencesProvider } from './context/PreferencesContext';

// Layout & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Bookmarks from './pages/Bookmarks';

function App() {
  return (
    <ThemeProvider>
      <BookmarksProvider>
        <PreferencesProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/article" element={<ArticleDetail />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/search" element={<div />} />{/* Placeholder */}
                </Routes>
              </main>
              {/* Footer */}
              <footer className="border-t border-slate-200 dark:border-dark-border py-6 text-center text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} GeoTech News. Powered by AI.</p>
              </footer>
            </div>
          </Router>
        </PreferencesProvider>
      </BookmarksProvider>
    </ThemeProvider>
  );
}

export default App;
