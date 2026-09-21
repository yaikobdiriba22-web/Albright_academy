import React, { useState } from 'react';
import {
  Calendar,
  User,
  Search,
  ChevronRight,
  ArrowLeft,
  Share2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { NewsItem } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';

interface NewsViewProps {
  news: NewsItem[];
  selectedNews: NewsItem | null;
  setSelectedNews: (news: NewsItem | null) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({
  news,
  selectedNews,
  setSelectedNews,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const publishedArticles = news.filter(
    (n) =>
      n.status === 'Published' &&
      (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-12 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            School Press & Dispatches
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            News & Announcements
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Stay abreast of the latest academic milestones, science exhibitions, cultural showcases,
            and community updates from Albright Academy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* If an article is selected, display the full Article Reader */}
        {selectedNews ? (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedNews(null)}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0f2444] mb-8 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All News</span>
            </button>

            <article className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedNews.publishedAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <User className="w-3.5 h-3.5" />
                  {selectedNews.author}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#0f2444] font-display mb-6 leading-tight">
                {selectedNews.title}
              </h1>

              <div className="rounded-2xl overflow-hidden mb-8 h-80 sm:h-[420px] bg-slate-100">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-lg text-slate-800 font-medium leading-relaxed mb-6 italic border-l-4 border-amber-400 pl-4 bg-slate-50 py-3 rounded-r-xl">
                {selectedNews.summary}
              </p>

              <div className="text-slate-700 leading-relaxed space-y-4 text-base whitespace-pre-line">
                {selectedNews.content}
              </div>

              <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNews(null)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Return to Newsroom
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedNews.title,
                        text: selectedNews.summary,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Article link copied to clipboard!');
                    }
                  }}
                  icon={<Share2 className="w-4 h-4" />}
                >
                  Share Story
                </Button>
              </div>
            </article>
          </div>
        ) : (
          <div>
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements & news stories..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] shadow-2xs"
              />
            </div>

            {/* Articles Grid */}
            {publishedArticles.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-500 font-medium">No articles found matching your query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => {
                      setSelectedNews(article);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer group"
                  >
                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0f2444]/90 text-amber-400 text-xs font-semibold">
                        {new Date(article.publishedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                          {article.author}
                        </span>
                        <h3 className="text-lg font-bold text-[#0f2444] font-display mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0f2444] group-hover:text-amber-600">
                        <span>Read Full Story</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
