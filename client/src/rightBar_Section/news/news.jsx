import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './news.scss';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '80326cb4c39a43568532729ac9f536dc'; // Replace with your API key
  const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(NEWS_URL);
        setNews(response.data.articles.slice(0, 10)); // Show top 10 articles
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Could not fetch news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h2 className="news-header">Top 10 - Latest News</h2>
      {loading ? (
        <p>Loading news...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="news-grid">
          {news.map((article, index) => (
            <div key={index} className="news-card">
              <img
                src={article.urlToImage || 'https://via.placeholder.com/150'}
                alt="News"
                className="news-image"
              />
              <div className="news-content">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-description">
                  {article.description ? article.description.slice(0, 100) + '...' : 'No description available'}
                </p>
                <button
                  className="news-button"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;
