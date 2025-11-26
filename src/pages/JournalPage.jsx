import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import JournalEntryForm from '../components/Journal/JournalEntryForm';
import JournalList from '../components/Journal/JournalList';
import JournalFilter from '../components/Journal/JournalFilter';
import JournalDetail from '../components/Journal/JournalDetail';
import '../components/Journal/Journal.css';

const JournalPage = () => {
    const [entries, setEntries] = useLocalStorage('journal_entries', []);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'dateDesc',
        pair: '',
        type: '',
        outcome: '',
        tag: '',
        session: '',
    });

    const handleAddEntry = (newEntry) => {
        setEntries([newEntry, ...entries]);
        setShowForm(false);
    };

    const handleUpdateEntry = (updatedEntry) => {
        setEntries(entries.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
        setEditingEntry(null);
        setSelectedEntry(null);
        alert('Trade Updated Successfully');
    };

    const handleDeleteEntry = (id) => {
        setEntries(entries.filter(entry => entry.id !== id));
        setSelectedEntry(null);
    };

    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setSelectedEntry(null);
        setShowForm(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredEntries = useMemo(() => {
        let result = [...entries];

        // Filtering
        if (filters.pair) {
            result = result.filter(entry => entry.pair === filters.pair);
        }
        if (filters.type) {
            result = result.filter(entry => entry.type === filters.type);
        }
        if (filters.outcome) {
            result = result.filter(entry => entry.outcome === filters.outcome);
        }
        if (filters.tag) {
            const searchTag = filters.tag.toLowerCase();
            result = result.filter(entry =>
                entry.tags.some(tag => tag.toLowerCase().includes(searchTag))
            );
        }
        if (filters.session) {
            // Check if the entry's tradingSession array includes the selected filter session
            result = result.filter(entry =>
                entry.tradingSession && entry.tradingSession.includes(filters.session)
            );
        }

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return filters.sortBy === 'dateDesc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [entries, filters]);

    return (
        <div className="journal-page">
            <div className="journal-header">
                <h2>Trading Journal</h2>
                <button className="add-entry-btn" onClick={() => setShowForm(true)}>
                    <Plus size={20} />
                    Add New Entry
                </button>
            </div>

            {(showForm || editingEntry) && (
                <JournalEntryForm
                    onAddEntry={handleAddEntry}
                    onUpdateEntry={handleUpdateEntry}
                    initialData={editingEntry}
                    onCancel={editingEntry ? handleCancelEdit : handleCancelForm}
                />
            )}

            <JournalFilter
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <JournalList
                entries={filteredEntries}
                onEntryClick={setSelectedEntry}
            />

            <JournalDetail
                entry={selectedEntry}
                onClose={() => setSelectedEntry(null)}
                onDelete={() => handleDeleteEntry(selectedEntry.id)}
                onEdit={handleEditEntry}
            />
        </div>
    );
};

export default JournalPage;
