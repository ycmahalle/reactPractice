import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchNews, fetchTopHeadlines } from '../services/api';
import { extractTrendingTopics } from '../utils/trending';
import { usePreferences } from '../context/PreferencesContext';
import { env } from '../config/env';
import NewsCard from '../components/NewsCard';
import Loader from '../components/Loader';

const Home = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  
  const { getTopPreference } = usePreferences();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [data, setData] = useState({
    searchResults: [],
    trending: [],
    geo: [],
    tech: [],
    forYou: []
  });
  
  const [trendingKeywords, setTrendingKeywords] = useState([]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        if (queryParam) {
          const results = await fetchNews(queryParam);
          setData(prev => ({ ...prev, searchResults: results }));
          setLoading(false);
          return;
        }

        // Parallel requests for optimal loading
        const requests = [
          fetchTopHeadlines('breaking-news'),
          fetchNews('geopolitics OR diplomacy OR international relations'),
          fetchNews('technology OR ai OR software'),
        ];
        
        let forYouReq = null;
        if (env.ENABLE_AI_FEED) {
          const topPref = getTopPreference();
          forYouReq = fetchNews(topPref === 'general' ? 'world news' : topPref);
          requests.push(forYouReq);
        }

        const responses = await Promise.all(requests);
        
        const trendingData = responses[0];
        
        setData({
          searchResults: [],
          trending: trendingData,
          geo: responses[1],
          tech: responses[2],
          forYou: env.ENABLE_AI_FEED ? responses[3] : []
        });

        if (env.ENABLE_TRENDING) {
          setTrendingKeywords(extractTrendingTopics(trendingData));
        }

      } catch (err) {
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce for search
    const delay = queryParam ? env.DEBOUNCE_DELAY : 0;
    const timer = setTimeout(() => {
      loadContent();
    }, delay);

    return () => clearTimeout(timer);
  }, [queryParam]);

  if (loading) return <div className="py-20"><Loader text="Discovering global insights..." /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  if (queryParam) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6">Results for "{queryParam}"</h2>
        {data.searchResults.length === 0 ? (
          <p className="text-slate-500 text-lg">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.searchResults.map((article, i) => (
              <NewsCard key={`${article.url}-${i}`} article={article} category="search" />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Trending Keywords Banner */}
      {env.ENABLE_TRENDING && trendingKeywords.length > 0 && (
        <div className="bg-brand-50 dark:bg-dark-card border border-brand-100 dark:border-dark-border rounded-xl p-4 flex items-center space-x-4">
          <span className="font-semibold text-brand-600 dark:text-brand-400">Trending Topics:</span>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm capitalize">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* For You / AI Feed */}
      {env.ENABLE_AI_FEED && data.forYou.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-br from-purple-500 to-brand-500 bg-clip-text text-transparent">For You</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.forYou.slice(0, 3).map((article, i) => (
              <NewsCard key={i} article={article} category={getTopPreference()} />
            ))}
          </div>
        </section>
      )}

      {/* Geopolitics */}
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-6">Geopolitics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.geo.map((article, i) => (
            <NewsCard key={i} article={article} category="geopolitics" />
          ))}
        </div>
      </section>

      {/* Technology */}
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-6">Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.tech.map((article, i) => (
            <NewsCard key={i} article={article} category="technology" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
