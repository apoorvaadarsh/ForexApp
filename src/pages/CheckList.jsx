import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHECKLIST_SECTIONS, CONFLUENCE_STATUS } from '../types';
import './CheckList.css';

const CheckList = () => {
    const navigate = useNavigate();
    // State for checklist toggles: { [itemId]: boolean }
    const [toggles, setToggles] = useState({});

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
        // Capture data
        const confluenceData = {
            confluenceScore: scores.total,
            confluenceStatus: status.label,
            confluenceColor: status.color
        };

        // Reset checklist
        setToggles({});

        // Redirect to Journal with data
        navigate('/journal', { state: { newEntryFromChecklist: true, confluenceData } });
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
                    </div>

                    {/* Planned Trades List */}
                    <div className="planned-trades-section">
                        <h3 className="planned-trades-header">Planned Trades</h3>
                        {plannedTrades.length > 0 ? (
                            <div className="planned-list">
                                {plannedTrades.map(plan => (
                                    <div key={plan.id} className="planned-card" style={{ borderLeftColor: plan.confluenceColor }}>
                                        <div className="planned-info">
                                            <span className="planned-pair">{plan.pair}</span>
                                            <div className="planned-meta">
                                                <span style={{ color: plan.confluenceColor, fontWeight: 600 }}>
                                                    {plan.confluenceScore}%
                                                </span>
                                                <span>•</span>
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
