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
        outcome: '',
        tags: '',
        notes: '',
        entryPrice: '',
        exitPrice: '',
        date: new Date().toISOString().slice(0, 16),
    });

    // Effect to pre-fill form when initialData changes (for editing)
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                pair: initialData.pair,
                type: initialData.type,
                outcome: initialData.outcome,
                tags: initialData.tags.join(', '),
                notes: initialData.notes,
                entryPrice: initialData.entryPrice || '',
                exitPrice: initialData.exitPrice || '',
                date: initialData.createdAt ? new Date(initialData.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            });
        } else {
            // Reset form when not editing
            setFormData({
                pair: '',
                type: 'Buy',
                outcome: '',
                tags: '',
                notes: '',
                entryPrice: '',
                exitPrice: '',
                date: new Date().toISOString().slice(0, 16),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const pnlStatus = calculatePnL(formData.type, formData.entryPrice, formData.exitPrice);
        const tradingSession = calculateSession(formData.date);

        const entryData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            pnlStatus,
            tradingSession,
            imageUrls: initialData ? initialData.imageUrls : [],
            createdAt: new Date(formData.date).toISOString(),
        };

        if (initialData) {
            // Update existing entry
            onUpdateEntry({
                ...initialData,
                ...entryData,
            });
        } else {
            // Create new entry
            onAddEntry({
                id: uuidv4(),
                ...entryData,
            });
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
                <div className="form-row">
                    <div className="form-group">
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Forex Pair</label>
                        <input
                            type="text"
                            name="pair"
                            list="pairs"
                            value={formData.pair}
                            onChange={handleChange}
                            placeholder="e.g. EUR/USD"
                            required
                        />
                        <datalist id="pairs">
                            {COMMON_PAIRS.map(pair => <option key={pair} value={pair} />)}
                        </datalist>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            {TRADE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Outcome / Mood</label>
                        <input
                            type="text"
                            name="outcome"
                            list="moods"
                            value={formData.outcome}
                            onChange={handleChange}
                            placeholder="e.g. Happy"
                            required
                        />
                        <datalist id="moods">
                            {MOODS.map(mood => <option key={mood} value={mood} />)}
                        </datalist>
                    </div>
                </div>

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
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Scalp, Asia Session, Breakout"
                    />
                </div>

                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Reflection on the trade..."
                    />
                </div>

                <button type="submit" className="submit-btn">{initialData ? 'Save Changes' : 'Save Entry'}</button>
            </form>
        </div>
    );
};

export default JournalEntryForm;
