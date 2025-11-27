import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { TRADE_TYPES, COMMON_PAIRS, MOODS } from '../../types';
import DateRangePicker from './DateRangePicker';
import './Journal.css';

const JournalFilter = ({ filters, onFilterChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    const handleDateRangeChange = (range) => {
        onFilterChange('dateRange', range);
    };

    const formatDateRange = () => {
        const { start, end } = filters.dateRange || {};
        if (start && end) {
            return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
        }
        return 'All Dates';
    };

    return (
        <div className="filter-container">
            <div className="filter-group">
                <label>Date Range</label>
                <button
                    className="filter-date-btn"
                    onClick={() => setShowDatePicker(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <Calendar size={16} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formatDateRange()}
                    </span>
                </button>
                {showDatePicker && (
                    <DateRangePicker
                        startDate={filters.dateRange?.start}
                        endDate={filters.dateRange?.end}
                        onChange={handleDateRangeChange}
                        onClose={() => setShowDatePicker(false)}
                    />
                )}
            </div>

            <div className="filter-group">
                <label>Sort By</label>
                <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
                    <option value="dateDesc">Date (Newest)</option>
                    <option value="dateAsc">Date (Oldest)</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Pair</label>
                <select name="pair" value={filters.pair} onChange={handleChange}>
                    <option value="">All Pairs</option>
                    {COMMON_PAIRS.map(pair => <option key={pair} value={pair}>{pair}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label>Type</label>
                <select name="type" value={filters.type} onChange={handleChange}>
                    <option value="">All Types</option>
                    {TRADE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label>Outcome</label>
                <select name="outcome" value={filters.outcome} onChange={handleChange}>
                    <option value="">All Outcomes</option>
                    {MOODS.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label>Session</label>
                <select name="session" value={filters.session || ''} onChange={handleChange}>
                    <option value="">All Sessions</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="London">London</option>
                    <option value="New York">New York</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Status</label>
                <select name="status" value={filters.status || ''} onChange={handleChange}>
                    <option value="">All Status</option>
                    <option value="Taken">Taken</option>
                    <option value="Planned">Planned</option>
                    <option value="Discarded">Discarded</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Tags</label>
                <input
                    type="text"
                    name="tag"
                    value={filters.tag}
                    onChange={handleChange}
                    placeholder="Filter by tag..."
                />
            </div>
        </div>
    );
};

export default JournalFilter;
