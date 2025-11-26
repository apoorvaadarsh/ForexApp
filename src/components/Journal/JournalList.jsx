import React from 'react';
import { format } from 'date-fns';
import { calculatePnL } from '../../utils/calculations';
import './Journal.css';

const JournalList = ({ entries, onEntryClick }) => {
    if (entries.length === 0) {
        return (
            <div className="placeholder-container" style={{ height: '200px' }}>
                <p>No entries found. Start by adding a new trade!</p>
            </div>
        );
    }

    return (
        <div className="journal-list">
            {entries.map((entry) => {
                const pnl = calculatePnL(entry.type, entry.entryPrice, entry.exitPrice);

                return (
                    <div
                        key={entry.id}
                        className="journal-card"
                        onClick={() => onEntryClick(entry)}
                    >
                        <div className="card-header">
                            <span className="card-date">
                                {format(new Date(entry.date), 'MMM d, yyyy')}
                            </span>
                            <span className={`card-type type-${entry.type.toLowerCase()}`}>
                                {entry.type}
                            </span>
                        </div>

                        <div className="card-header">
                            <span className="card-pair">{entry.pair}</span>
                            {entry.pnlStatus && (
                                <span className={`card-pnl pnl-${entry.pnlStatus.toLowerCase()}`}>
                                    {entry.pnlStatus}
                                </span>
                            )}
                            {entry.tradingSession && entry.tradingSession.map(session => (
                                <span key={session} className="card-session">{session}</span>
                            ))}
                        </div>

                        {entry.tags && entry.tags.length > 0 && (
                            <div className="card-tags">
                                {entry.tags.map((tag, index) => (
                                    <span key={index} className="tag">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default JournalList;
