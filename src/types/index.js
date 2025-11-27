/**
 * @typedef {Object} JournalEntry
 * @property {string} id - Unique identifier for the entry.
 * @property {string} date - Date and time of the entry (ISO string).
 * @property {string} pair - Forex pair (e.g., EUR/USD).
 * @property {'Buy' | 'Sell'} type - Trade type.
 * @property {string} outcome - Outcome or mood (e.g., Happy, Stressed).
 * @property {string[]} tags - Array of tags.
 * @property {string} notes - Detailed notes.
 * @property {string[]} imageUrls - Array of image URLs (placeholders for now).
 * @property {number} entryPrice - Entry price of the trade.
 * @property {number} exitPrice - Exit price of the trade.
 */

export const TRADE_TYPES = ['Buy', 'Sell'];

export const COMMON_PAIRS = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD',
    'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY'
];

export const MOODS = [
    'Happy', 'Stressed', 'Neutral', 'Textbook', 'Revenge Trade', 'FOMO', 'Patient'
];

export const CHECKLIST_SECTIONS = [
    {
        id: 'weekly',
        title: 'WEEKLY',
        items: [
            { id: 'w_trend', label: 'Trend', value: 10 },
            { id: 'w_aoi', label: 'At AOI / Rejected', value: 10 },
            { id: 'w_ema', label: 'Touching EMA', value: 5 },
            { id: 'w_psy', label: 'Round Psychological Level', value: 5 },
            { id: 'w_struct', label: 'Rejection from Previous Structure', value: 10 },
            { id: 'w_candle', label: 'Candlestick Rejection from AOI', value: 10 },
            { id: 'w_pattern', label: 'Break & Retest / Head & Shoulders Pattern', value: 10 },
        ]
    },
    {
        id: 'daily',
        title: 'DAILY',
        items: [
            { id: 'd_trend', label: 'Trend', value: 10 },
            { id: 'd_aoi', label: 'At AOI / Rejected', value: 10 },
            { id: 'd_ema', label: 'Touching EMA', value: 5 },
            { id: 'd_psy', label: 'Round Psychological Level', value: 5 },
            { id: 'd_struct', label: 'Rejection from Previous Structure', value: 10 },
            { id: 'd_candle', label: 'Candlestick Rejection from AOI', value: 10 },
            { id: 'd_pattern', label: 'Break & Retest / Head & Shoulders Pattern', value: 10 },
        ]
    },
    {
        id: 'h4',
        title: '4H',
        items: [
            { id: 'h4_trend', label: 'Trend', value: 5 },
            { id: 'h4_aoi', label: 'At AOI / Rejected', value: 5 },
            { id: 'h4_ema', label: 'Touching EMA', value: 5 },
            { id: 'h4_psy', label: 'Round Psychological Level', value: 5 },
            { id: 'h4_struct', label: 'Rejection from Previous Structure', value: 10 },
            { id: 'h4_candle', label: 'Candlestick Rejection from AOI', value: 5 },
            { id: 'h4_pattern', label: 'Break & Retest / Head & Shoulders Pattern', value: 10 },
        ]
    },
    {
        id: 'lower',
        title: '2H, 1H, 30m',
        items: [
            { id: 'l_trend', label: 'Trend', value: 5 },
            { id: 'l_ema', label: 'Touching EMA', value: 5 },
            { id: 'l_pattern', label: 'Break & Retest / Head & Shoulders Pattern', value: 5 },
        ]
    },
    {
        id: 'entry',
        title: 'ENTRY SIGNAL',
        items: [
            { id: 'e_sos', label: 'SOS', value: 10 },
            { id: 'e_engulf', label: 'Engulfing candlestick (30m, 1H, 2H, 4H)', value: 10 },
        ]
    }
];

export const CONFLUENCE_STATUS = [
    { min: 0, max: 40, label: "Don't Trade (Weak Setup)", color: '#f44336' }, // Red
    { min: 45, max: 59, label: 'Below Standard', color: '#ff9800' }, // Orange
    { min: 60, max: 69, label: 'Moderate', color: '#cddc39' }, // Lime
    { min: 70, max: 79, label: 'Acceptable', color: '#8bc34a' }, // Light Green
    { min: 80, max: 89, label: 'Good', color: '#4caf50' }, // Green
    { min: 90, max: 100, label: 'Strong', color: '#2e7d32' }, // Darker Green
    { min: 100, max: 110, label: 'Very Strong', color: '#1b5e20' }, // Even Darker Green
    { min: 110, max: 120, label: 'Excellent', color: '#1b5e20' },
    { min: 120, max: 145, label: 'Outstanding', color: '#1b5e20' },
    { min: 145, max: 999, label: 'Perfect Trade', color: 'var(--primary-color)' }, // Primary Accent
];

export const SECTION_MAX_SCORES = {
    weekly: 200,
    daily: 200,
    h4: 200,
    lower: 200,
    entry: 200
};
