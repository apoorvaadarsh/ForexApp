import React from 'react';
import { TRADE_TYPES, COMMON_PAIRS, MOODS } from '../../types';
import './Journal.css';

const JournalFilter = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <div className="filter-container">
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
