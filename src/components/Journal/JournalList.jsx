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
                return (
                    <div
                        key={entry.id}
                        className="journal-card"
                        onClick={() => onEntryClick(entry)}
                    >
                        {/* 1. Header Row: Pair, Type, Date */}
                        <div className="card-header-row">
                            <div className="pair-type-group">
                                <span className="card-pair">{entry.pair}</span>
                                <span className={`card-type ${entry.type.toLowerCase()}`}>{entry.type}</span>
                            </div>
                            <span className="card-date">{format(new Date(entry.date), 'MMM d, HH:mm')}</span>
                        </div>

                        {/* 2. Status Row: Chips for Status, P&L, Session, Mood */}
                        <div className="card-status-row">
                            {/* Trade Status Chip */}
                            <span className={`chip status-chip ${entry.tradeStatus?.toLowerCase() || 'taken'}`}>
                                {entry.tradeStatus || 'Taken'}
                            </span>

                            {/* P&L Chip (Only if Taken) */}
                            {entry.tradeStatus === 'Taken' && entry.pnlStatus && (
                                <span className={`chip pnl-chip ${entry.pnlStatus.toLowerCase()}`}>
                                    {entry.pnlStatus}
                                </span>
                            )}

                            {/* Session Chip (Only if Taken) */}
                            {entry.tradeStatus === 'Taken' && entry.tradingSession && entry.tradingSession.map(session => (
                                <span key={session} className="chip session-chip">{session}</span>
                            ))}

                            {/* Mood Chip */}
                            {entry.outcome && (
                                <span className="chip mood-chip">
                                    {entry.outcome}
                                </span>
                            )}
                        </div>

                        {/* 3. Confluence Row */}
                        {entry.confluenceScore !== undefined && entry.confluenceScore !== 'NA' && (
                            <div className="card-confluence-row">
                                <span
                                    className="confluence-badge"
                                    style={{
                                        color: entry.confluenceColor || 'var(--text-secondary)',
                                        backgroundColor: (entry.confluenceColor || '#9e9e9e') + '15',
                                    }}
                                >
                                    {entry.confluenceScore}% - {entry.confluenceStatus}
                                </span>
                            </div>
                        )}

                        {/* 4. Footer: Tags */}
                        {entry.tags && entry.tags.length > 0 && (
                            <div className="card-footer-row">
                                {entry.tags.map((tag, index) => (
                                    <span key={index} className="tag-pill">#{tag}</span>
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
