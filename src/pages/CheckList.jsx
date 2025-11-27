import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CHECKLIST_SECTIONS, CONFLUENCE_STATUS } from '../types';
import './CheckList.css';

const CheckList = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useLocalStorage('journal_entries', []);
    
    // State for checklist toggles: { [itemId]: boolean }
    const [toggles, setToggles] = useState({});
    const [editingPlanId, setEditingPlanId] = useState(null);

    // Filter for Planned Trades
    const plannedTrades = useMemo(() => {
        return entries.filter(entry => entry.tradeStatus === 'Planned');
    }, [entries]);

    // Calculate scores
    const scores = useMemo(() => {
        let totalScore = 0;
        const sectionScores = {};

        CHECKLIST_SECTIONS.forEach(section => {
            let sectionTotal = 0;
            section.items.forEach(item => {
                if (toggles[item.id]) {
                    sectionTotal += item.value;
                }
            });
            sectionScores[section.id] = sectionTotal;
            totalScore += sectionTotal;
        });

        return { total: totalScore, sections: sectionScores };
    }, [toggles]);

    // Determine status based on total score
    const status = useMemo(() => {
        const score = scores.total;
        return CONFLUENCE_STATUS.find(s => score >= s.min && score <= s.max) ||
            { label: 'Unknown', color: '#9e9e9e' };
    }, [scores.total]);

    const handleToggle = (itemId) => {
        setToggles(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSaveTrade = () => {
        const confluenceData = {
            confluenceScore: scores.total,
            confluenceStatus: status.label,
            confluenceColor: status.color,
            checklistState: toggles // Save the specific toggles so we can edit later
        };

        if (editingPlanId) {
            // Case 1: Updating an existing Plan
            const updatedEntries = entries.map(entry => {
                if (entry.id === editingPlanId) {
                    return { ...entry, ...confluenceData };
                }
                return entry;
            });
            setEntries(updatedEntries);
            setEditingPlanId(null);
            setToggles({});
        } else {
            // Case 2: Creating a new Trade (redirect to Journal form)
            navigate('/', { 
                state: { 
                    newEntryFromChecklist: true, 
                    confluenceData 
                } 
            });
        }
    };

    const handleEditPlan = (plan) => {
        setEditingPlanId(plan.id);
        // Restore the toggles from the saved plan, or default to empty
        setToggles(plan.checklistState || {});
    };

    const handleDeletePlan = (id) => {
        if (window.confirm('Delete this planned trade?')) {
            setEntries(entries.filter(e => e.id !== id));
            if (editingPlanId === id) {
                setEditingPlanId(null);
                setToggles({});
            }
        }
    };

    const handleMarkAsTaken = (plan) => {
        // Update status to 'Taken' and redirect to journal to fill in execution details
        const updatedEntries = entries.map(entry => 
            entry.id === plan.id ? { ...entry, tradeStatus: 'Taken' } : entry
        );
        setEntries(updatedEntries);
        navigate('/journal');
    };

    return (
        <div className="checklist-page">
            <div className="checklist-header">
                <h2>Trade Confluence Checklist</h2>
            </div>

            <div className="checklist-content">
                {/* Left Column: Checklist Sections */}
                <div className="checklist-sections">
                    {CHECKLIST_SECTIONS.map(section => (
                        <div key={section.id} className="checklist-card">
                            <div className="section-header">
                                <div className="section-title-group">
                                    <h3 className="section-title">{section.title}</h3>
                                    <span className="section-subtitle">confluence</span>
                                </div>
                                <span className="section-score">{scores.sections[section.id]}%</span>
                            </div>
                            <div className="section-items">
                                {section.items.map(item => (
                                    <div key={item.id} className="checklist-item">
                                        <span className="item-label">{item.label}</span>
                                        <span className="item-value">+{item.value}%</span>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={!!toggles[item.id]}
                                                onChange={() => handleToggle(item.id)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Summary & Actions */}
                <div className="checklist-sidebar">
                    <div className="summary-card">
                        <h3 className="summary-title">Confluence Summary</h3>

                        <div className="total-score-container">
                            <span className="total-label">Total Overall Score</span>
                            <span className="total-score" style={{ color: status.color }}>
                                {scores.total}%
                            </span>
                            <span
                                className="status-text"
                                style={{ backgroundColor: status.color + '20', color: status.color }}
                            >
                                {status.label}
                            </span>
                        </div>

                        <div className="breakdown-grid">
                            {CHECKLIST_SECTIONS.map(section => (
                                <div key={section.id} className="breakdown-item">
                                    <span className="breakdown-label">{section.title}</span>
                                    <span className="breakdown-value">{scores.sections[section.id]}%</span>
                                </div>
                            ))}
                        </div>

                        <button className="save-trade-btn" onClick={handleSaveTrade}>
                            {editingPlanId ? 'Update Plan' : 'Save Trade'}
                        </button>
                        
                        {editingPlanId && (
                            <button 
                                className="cancel-edit-btn"
                                style={{ marginTop: '10px', width: '100%', padding: '8px', background: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '6px', cursor: 'pointer' }}
                                onClick={() => {
                                    setEditingPlanId(null);
                                    setToggles({});
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Planned Trades List */}
                    <div className="planned-trades-section">
                        <h3 className="planned-trades-header">Planned Trades</h3>
                        {plannedTrades.length > 0 ? (
                            <div className="planned-list">
                                {plannedTrades.map(plan => (
                                    <div key={plan.id} className="planned-card" style={{ borderLeft: `4px solid ${plan.confluenceColor}` }}>
                                        <div className="planned-info">
                                            <span className="planned-pair">{plan.pair || 'Unknown Pair'}</span>
                                            <div className="planned-meta">
                                                <span style={{ color: plan.confluenceColor, fontWeight: 600 }}>
                                                    {plan.confluenceScore}%
                                                </span>
                                                <span className="meta-dot">•</span>
                                                <span>{plan.confluenceStatus}</span>
                                            </div>
                                        </div>
                                        <div className="planned-actions">
                                            <button
                                                className="action-btn btn-take"
                                                onClick={() => handleMarkAsTaken(plan)}
                                                title="Mark as Taken"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                className="action-btn btn-edit"
                                                onClick={() => handleEditPlan(plan)}
                                                title="Edit Plan"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="action-btn btn-delete"
                                                onClick={() => handleDeletePlan(plan.id)}
                                                title="Delete Plan"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-planned">
                                No planned trades yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckList;