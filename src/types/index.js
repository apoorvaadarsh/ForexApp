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
