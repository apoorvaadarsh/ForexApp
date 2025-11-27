import React from 'react';
import { useForexNews } from '../hooks/useForexNews';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import './News.css';

const NewsCard = ({ item }) => {
    const date = new Date(item.date);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`news-card ${item.impact === 'High' ? 'high-impact' : ''}`}>
            <div className="card-header">
                <span className="news-time">{timeString}</span>
                <span className="news-country">{item.country}</span>
            </div>
            <h3 className="news-title">{item.title}</h3>
            <div className="news-stats">
                <div className="stat-item">
                    <span className="stat-label">Forecast</span>
                    <span className="stat-value">{item.forecast || '-'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Previous</span>
                    <span className="stat-value">{item.previous || '-'}</span>
                </div>
            </div>
        </div>
    );
};

const News = () => {
    const { past, upcoming, loading, error, lastUpdated } = useForexNews();

    if (loading) {
        return (
            <div className="news-page">
                <div className="loading-container">
                    Loading News Calendar...
                </div>
            </div>
        );
    }

    return (
        <div className="news-page">
            <div className="news-header">
                <h2>Economic Calendar</h2>
                {lastUpdated && (
                    <span className="last-updated">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <AlertCircle size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    {error}
                </div>
            )}

            <div className="news-content">
                {/* Upcoming News Section */}
                <div className="news-section">
                    <h3 className="section-title upcoming">
                        <Calendar size={20} />
                        Upcoming High Impact
                    </h3>

                    {upcoming.length > 0 ? (
                        <div className="news-list">
                            {upcoming.map((item, index) => (
                                <NewsCard key={`${item.title}-${index}`} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No upcoming high-impact news for today.
                        </div>
                    )}
                </div>

                {/* Past News Section */}
                <div className="news-section">
                    <h3 className="section-title past">
                        <Clock size={20} />
                        Past Events (Today)
                    </h3>

                    {past.length > 0 ? (
                        <div className="news-list">
                            {past.map((item, index) => (
                                <NewsCard key={`${item.title}-${index}`} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No past high-impact news for today.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default News;
