"use client";

import { useEffect, useState } from "react";

type Article = { title: string; link: string; image: string };

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const response = await fetch("/api/rss");
      const data = await response.json();
      setArticles(data.articles || []);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative w-full h-60 bg-blue-600 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold">📡 Dev RSS Reader</h1>
        <p className="text-lg mt-2">Stay updated with the latest developer news!</p>
        <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
      </div>

      {/* Article List */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">Latest Articles</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-6">
            {articles.map((article, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded-md shadow">
                <a href={article.link} target="_blank" className="block">
                  <img src={article.image} alt={article.title} className="w-full h-48 object-cover rounded-md" />
                  <h3 className="text-xl font-medium text-blue-600 mt-2">{article.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}