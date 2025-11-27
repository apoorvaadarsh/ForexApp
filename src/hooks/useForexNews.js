import { useState, useEffect } from 'react';
import { DUMMY_NEWS } from '../data/dummyNews';

const CACHE_KEY = 'forex_news_cache';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const API_URL = '/api/calendar';

export const useForexNews = () => {
    const [newsData, setNewsData] = useState({ past: [], upcoming: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // Check cache
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const now = new Date().getTime();

                    if (now - timestamp < CACHE_DURATION) {
                        processNewsData(data);
                        setLastUpdated(new Date(timestamp));
                        setLoading(false);
                        return;
                    }
                }

                // Fetch from API
                const response = await fetch(API_URL);
                console.log("API response:", response);
                if (!response.ok) {
                    throw new Error('Failed to fetch news data');
                }
                const data = await response.json();

                // Update cache
                const now = new Date().getTime();
                localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }));
                setLastUpdated(new Date(now));

                processNewsData(data);
            } catch (err) {
                console.error("Error fetching news:", err);
                // Use dummy data as fallback
                console.log("Using dummy data as fallback");
                processNewsData(DUMMY_NEWS);
                setError("Using cached/dummy data (Live updates unavailable)");

                // Also check if we have old cache, though dummy data is likely better if cache is missing
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { timestamp } = JSON.parse(cachedData);
                    setLastUpdated(new Date(timestamp));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const processNewsData = (data) => {
        const now = new Date();
        const todayString = now.toDateString(); // "Wed Nov 26 2025"

        const highImpactToday = data.filter(item => {
            // 1. Filter by Impact
            if (item.impact !== 'High') return false;

            // 2. Filter by Date (Today)
            // The API date is ISO 8601 with offset, e.g., "2025-11-25T08:30:00-05:00"
            // We convert it to a Date object which handles the timezone conversion to local time
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === todayString;
        });

        const past = [];
        const upcoming = [];

        highImpactToday.forEach(item => {
            const itemDate = new Date(item.date);
            if (itemDate < now) {
                past.push(item);
            } else {
                upcoming.push(item);
            }
        });

        // Sort: Past (descending - most recent first), Upcoming (ascending - soonest first)
        past.sort((a, b) => new Date(b.date) - new Date(a.date));
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

        setNewsData({ past, upcoming });
    };

    return { ...newsData, loading, error, lastUpdated };
};
