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
