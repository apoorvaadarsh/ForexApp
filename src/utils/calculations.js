/**
 * Calculates the P&L status based on entry and exit prices and trade type.
 * 
 * @param {string} type - 'Buy' or 'Sell'
 * @param {number} entryPrice 
 * @param {number} exitPrice 
 * @returns {'Profit' | 'Loss' | 'Neutral' | null}
 */
export const calculatePnL = (type, entryPrice, exitPrice) => {
    if (!entryPrice || !exitPrice) return null;

    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);

    if (isNaN(entry) || isNaN(exit)) return null;

    if (entry === exit) return 'Neutral';

    if (type === 'Buy') {
        return exit > entry ? 'Profit' : 'Loss';
    } else if (type === 'Sell' && exitPrice < entryPrice) return 'Profit';
    if (type === 'Sell' && exitPrice > entryPrice) return 'Loss';
    return 'Neutral';
};

/**
 * Calculates the trading session based on the date (IST).
 * @param {Date|string} date - The date of the entry.
 * @returns {string[]} An array of active sessions.
 */
export const calculateSession = (date) => {
    // Treat the input date as the local IST time for calculation
    const d = new Date(date);
    
    // Get total minutes from 00:00 IST (midnight)
    const hours = d.getHours();
    const minutes = hours * 60 + d.getMinutes(); 

    const sessions = [];

    // All ranges are calculated based on minutes from 00:00 IST.
    // -----------------------------------------------------------

    // Sydney: 02:30 AM (150) - 10:30 AM (630) IST
    // 2*60 + 30 = 150
    // 10*60 + 30 = 630
    if (minutes >= 150 && minutes < 630) {
        sessions.push('Sydney');
    }

    // Tokyo: 05:30 AM (330) - 02:30 PM (870) IST
    // 5*60 + 30 = 330
    // 14*60 + 30 = 870
    if (minutes >= 330 && minutes < 870) {
        sessions.push('Tokyo');
    }

    // London: 01:30 PM (810) - 10:30 PM (1350) IST
    // 13*60 + 30 = 810
    // 22*60 + 30 = 1350
    if (minutes >= 810 && minutes < 1350) {
        sessions.push('London');
    }

    // New York: 06:30 PM (1110) - 03:30 AM (210) IST
    // This session crosses midnight (1440 minutes).
    // Segment 1 (Evening): 6:30 PM (1110) to 11:59 PM (1439)
    // Segment 2 (Morning): 00:00 AM (0) to 3:30 AM (210)
    // 18*60 + 30 = 1110
    // 3*60 + 30 = 210
    if (minutes >= 1110 || minutes < 210) {
        sessions.push('New York');
    }
    
    // -----------------------------------------------------------
    
    // Return all matched sessions or 'Quiet' if none match.
    return sessions.length > 0 ? sessions : ['Quiet'];
};
