import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
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
    const [isFromChecklist, setIsFromChecklist] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'dateDesc',
        pair: '',
        type: '',
        outcome: '',
        tag: '',
        session: '',
        status: 'All',
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.newEntryFromChecklist) {
            setIsFromChecklist(true);
            const { confluenceData } = location.state;
            setEditingEntry({
                ...confluenceData,
                tradeStatus: 'Planned' // Default to Planned when coming from checklist
            });
            setShowForm(true);
            // Clear state to prevent reopening on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleAddEntry = (newEntry) => {
        // 1. Add the new entry to the front of the list
        setEntries([newEntry, ...entries]); 
        setIsFromChecklist(false);
        // 2. Close the form
        setShowForm(false); 
    };

    const handleUpdateEntry = (updatedEntry) => {
        setEntries(entries.map(entry =>
            entry.id === updatedEntry.id ? updatedEntry : entry
        ));
        setEditingEntry(null);
        setIsFromChecklist(false);
        setShowForm(false);
    };

    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setShowForm(true);
    };

    const handleDeleteEntry = (entryId) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            setEntries(entries.filter(entry => entry.id !== entryId));
            if (selectedEntry && selectedEntry.id === entryId) {
                setSelectedEntry(null);
            }
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingEntry(null);
        setIsFromChecklist(false);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredEntries = useMemo(() => {
        let result = [...entries];

        // --- FIX START ---
        // Only filter if a status is selected AND it is NOT 'All'
        if (filters.status && filters.status !== 'All') {
            result = result.filter(entry => {
                const status = entry.tradeStatus || 'Taken';
                return status === filters.status; // Use filters.status, not filterStatus
            });
        }
        // --- FIX END ---

        // 2. Filter by other criteria
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
                entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTag))
            );
        }
        if (filters.session) {
            result = result.filter(entry =>
                entry.tradingSession && entry.tradingSession.includes(filters.session)
            );
        }

        // 3. Sort
        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return filters.sortBy === 'dateDesc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [entries, filters]); // Make sure dependencies are correct

    return (
        <div className="journal-page">
            <div className="journal-header">
                <h1>Trading Journal</h1>
                <div className="header-actions">
                    <button className="add-entry-btn" onClick={() => {
                        setEditingEntry(null); // This is correct: ensures initialData is null
                        setShowForm(true);
                        setSelectedEntry(null);
                    }}>
                        <Plus size={20} />
                        Add New Entry
                    </button>
                </div>
            </div>

            {(showForm || editingEntry) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <JournalEntryForm
                            onAddEntry={handleAddEntry} // **<--- This is the key function**
                            onUpdateEntry={handleUpdateEntry}
                            initialData={editingEntry} // Correctly null for new entry
                            onCancel={handleCancelForm}
                            fromChecklist={isFromChecklist}   
                        />
                    </div>
                </div>
            )}

            <JournalFilter
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <div className="journal-content">
                <JournalList
                    entries={filteredEntries}
                    onEntryClick={setSelectedEntry}
                    onEditClick={handleEditEntry}
                    onDeleteClick={handleDeleteEntry}
                />
                {selectedEntry && (
                    <JournalDetail
                        entry={selectedEntry}
                        onClose={() => setSelectedEntry(null)}
                        onEdit={handleEditEntry}
                        onDelete={handleDeleteEntry}
                    />
                )}
            </div>
        </div>
    );
};

export default JournalPage;
