import React from 'react';
import { X, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { calculatePnL } from '../../utils/calculations';
import './Journal.css';

const JournalDetail = ({ entry, onClose, onDelete, onEdit }) => {
    if (!entry) return null;

    const pnl = calculatePnL(entry.type, entry.entryPrice, entry.exitPrice);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this journal entry?')) {
            onDelete(entry.id);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="detail-header">
                    <div className="detail-title">
                        <h2>{entry.pair}</h2>
                        <div className="detail-meta">
                            {format(new Date(entry.date), 'MMMM d, yyyy h:mm a')}
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Date & Time</label>
                        <span>{format(new Date(entry.createdAt), 'PPpp')}</span>
                    </div>
                    <div className="detail-item">
                        <label>Session</label>
                        <span>{entry.tradingSession ? entry.tradingSession.join(', ') : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                        <label>Pair</label>
                        <span>{entry.pair}</span>
                    </div>
                    <div className="detail-item">
                        <label>Type</label>
                        <span className={`card-type type-${entry.type.toLowerCase()}`}>{entry.type}</span>
                    </div>

                    <div className="detail-item">
                        <label>Outcome</label>
                        <span>{entry.outcome}</span>
                    </div>

                    <div className="detail-item">
                        <label>Entry Price</label>
                        <span>{entry.entryPrice || '-'}</span>
                    </div>

                    <div className="detail-item">
                        <label>Exit Price</label>
                        <span>{entry.exitPrice || '-'}</span>
                    </div>

                    <div className="detail-item">
                        <label>P&L Status</label>
                        {pnl ? (
                            <span className={`card-pnl pnl-${pnl.toLowerCase()}`}>{pnl}</span>
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                </div>

                {entry.tags && entry.tags.length > 0 && (
                    <div className="card-tags" style={{ marginBottom: '1.5rem' }}>
                        {entry.tags.map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Confluence Details Section */}
                {entry.confluenceScore !== undefined && entry.confluenceScore !== 'NA' && (
                    <div className="detail-confluence">
                        <div className="confluence-header">
                            <h3>Confluence Details</h3>
                            <span
                                className="confluence-badge large"
                                style={{
                                    color: entry.confluenceColor || 'var(--primary-color)',
                                    backgroundColor: (entry.confluenceColor || '#9e9e9e') + '15',
                                    border: `1px solid ${entry.confluenceColor}30`
                                }}
                            >
                                {entry.confluenceScore}% - {entry.confluenceStatus}
                            </span>
                        </div>

                        {entry.confluenceDetails && entry.confluenceDetails.length > 0 ? (
                            <div className="confluence-grid">
                                {['weekly', 'daily', 'h4', 'lower', 'entry'].map(sectionId => {
                                    const items = entry.confluenceDetails.filter(item => item.sectionId === sectionId);
                                    if (items.length === 0) return null;

                                    return (
                                        <div key={sectionId} className="confluence-section">
                                            <h4 className="confluence-section-title">
                                                {items[0].sectionTitle}
                                            </h4>
                                            <ul className="confluence-list">
                                                {items.map((item, idx) => (
                                                    <li key={idx} className="confluence-list-item">
                                                        <span className="check-icon">✓</span>
                                                        <span className="item-text">{item.label}</span>
                                                        <span className="item-percent">+{item.value}%</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-details">No detailed breakdown available.</p>
                        )}
                    </div>
                )}

                <div className="detail-notes">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Notes</label>
                    <p>{entry.notes}</p>
                </div>

                <div className="detail-actions">
                    <button className="edit-btn" onClick={() => onEdit(entry)}>
                        <Edit size={18} />
                        Edit Entry
                    </button>
                    <button className="delete-btn" onClick={handleDelete}>
                        <Trash2 size={18} />
                        Delete Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalDetail;
