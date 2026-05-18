import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Sparkles, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { summarizeText } from '../services/ai';
import { analyzeSentiment } from '../utils/sentiment';
import { env } from '../config/env';
import Loader from '../components/Loader';

const ArticleDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState(null);

  if (!article) {
    return <Navigate to="/" replace />;
  }

  const sentiment = React.useMemo(() => analyzeSentiment(article.description || article.content), [article]);
  const publishDate = article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : '';

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setError(null);
    try {
      // Typically we'd summarize full content, but GNews free tier only gives snippet/description
      const textToSummarize = article.content || article.description;
      const res = await summarizeText(textToSummarize);
      setSummary(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const sentimentColors = {
    Positive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Negative: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  };

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-brand-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden mb-8 shadow-lg">
        <img 
          src={article.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167'} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-8 w-full">
            <span className="bg-brand-500 text-white text-sm font-bold px-3 py-1 rounded mb-3 inline-block">
              {article.source?.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-600 dark:text-slate-400">
        <span>Published {publishDate}</span>
        {env.ENABLE_SENTIMENT && (
          <span className={`px-3 py-1 rounded-full font-medium flex items-center ${sentimentColors[sentiment.label]}`}>
            <Activity className="h-3 w-3 mr-1" />
            Sentiment: {sentiment.label}
          </span>
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed mb-10 text-slate-800 dark:text-slate-200">
        <p>{article.description}</p>
        {article.content && <p className="mt-4">{article.content}</p>}
      </div>

      {/* AI Summary Section */}
      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 md:p-8 mb-10 border border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            AI Summary
          </h3>
          {!summary && !loadingSummary && (
            <button 
              onClick={handleSummarize}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Generate Summary
            </button>
          )}
        </div>
        
        {loadingSummary && (
          <div className="py-4">
            <Loader text="AI is analyzing this article..." />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-4 text-purple-950 dark:text-purple-200 leading-relaxed font-medium animate-fade-in">
            <ul className="list-disc pl-5 space-y-2">
              {summary.split('. ').filter(s => s.length > 5).map((point, idx) => (
                <li key={idx}>{point.replace(/\.$/, '')}.</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center border-t border-slate-200 dark:border-slate-800 pt-8">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Read Full Article on {article.source?.name}
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>
    </article>
  );
};

export default ArticleDetail;
