import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';
import { TRADE_TYPES, COMMON_PAIRS, MOODS } from '../../types';
import { calculatePnL, calculateSession } from '../../utils/calculations';
import './Journal.css';

const JournalEntryForm = ({ onAddEntry, onUpdateEntry, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        pair: '',
        type: 'Buy',
        date: new Date().toISOString().slice(0, 16),
        outcome: 'Happy',
        tags: '',
        notes: '',
        entryPrice: '',
        exitPrice: '',
        tradeStatus: 'Taken' // Default status
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                pair: initialData.pair || '',
                type: initialData.type || 'Buy',
                date: initialData.createdAt ? new Date(initialData.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                outcome: initialData.outcome || 'Happy',
                tags: initialData.tags ? initialData.tags.join(', ') : '',
                notes: initialData.notes || '',
                entryPrice: initialData.entryPrice || '',
                exitPrice: initialData.exitPrice || '',
                tradeStatus: initialData.tradeStatus || 'Taken'
            });
        } else {
            // Reset form when not editing
            setFormData({
                pair: '',
                type: 'Buy',
                date: new Date().toISOString().slice(0, 16),
                outcome: 'Happy',
                tags: '',
                notes: '',
                entryPrice: '',
                exitPrice: '',
                tradeStatus: 'Taken'
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let pnlStatus = null;
        let tradingSession = [];

        if (formData.tradeStatus === 'Taken') {
            const entryPrice = parseFloat(formData.entryPrice);
            const exitPrice = parseFloat(formData.exitPrice);
            // Only calculate if prices are valid numbers
            if (!isNaN(entryPrice) && !isNaN(exitPrice)) {
                pnlStatus = calculatePnL(formData.type, entryPrice, exitPrice);
            }
            tradingSession = calculateSession(formData.date);
        }

        const entryData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            pnlStatus,
            tradingSession,
            imageUrls: initialData ? initialData.imageUrls : [],
            createdAt: new Date(formData.date).toISOString(),
            // Preserve confluence data if available, else default to NA
            confluenceScore: initialData?.confluenceScore ?? 'NA',
            confluenceStatus: initialData?.confluenceStatus,
            confluenceColor: initialData?.confluenceColor,
        };

        if (initialData) {
            onUpdateEntry({ ...initialData, ...entryData });
        } else {
            onAddEntry({ id: uuidv4(), ...entryData });
        }
    };

    const handleClose = () => {
        if (onCancel) onCancel();
    };

    return (
        <div className="entry-form-container">
            <div className="form-header">
                <h3>{initialData ? 'Edit Journal Entry' : 'New Journal Entry'}</h3>
                <button className="close-btn" onClick={handleClose}>
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="journal-form">
                {/* Row 1: Status & Pair */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Trade Status</label>
                        <select
                            name="tradeStatus"
                            value={formData.tradeStatus}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="Taken">Taken</option>
                            <option value="Planned">Planned</option>
                            <option value="Discarded">Discarded</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Pair</label>
                        <select
                            name="pair"
                            value={formData.pair}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="" disabled>Select Pair</option>
                            {COMMON_PAIRS.map(pair => (
                                <option key={pair} value={pair}>{pair}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 2: Type & Date */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Trade Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>

                    {formData.tradeStatus === 'Taken' && (
                        <div className="form-group">
                            <label>Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                    )}
                </div>

                {/* Row 3: Prices (Conditional) */}
                {formData.tradeStatus === 'Taken' && (
                    <div className="form-row">
                        <div className="form-group">
                            <label>Entry Price</label>
                            <input
                                type="number"
                                step="0.00001"
                                name="entryPrice"
                                value={formData.entryPrice}
                                onChange={handleChange}
                                placeholder="1.1000"
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Exit Price</label>
                            <input
                                type="number"
                                step="0.00001"
                                name="exitPrice"
                                value={formData.exitPrice}
                                onChange={handleChange}
                                placeholder="1.1050"
                                required
                                className="form-input"
                            />
                        </div>
                    </div>
                )}

                {/* Row 4: Outcome & Tags */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Outcome / Mood</label>
                        <select
                            name="outcome"
                            value={formData.outcome}
                            onChange={handleChange}
                            className="form-select"
                        >
                            {MOODS.map(mood => (
                                <option key={mood} value={mood}>{mood}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="Scalp, Asia Session..."
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Row 5: Notes */}
                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Reflection on the trade..."
                        className="form-textarea"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
                    <button type="submit" className="submit-btn">
                        {initialData ? 'Update Entry' : 'Add Entry'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JournalEntryForm;
