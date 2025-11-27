import React, { useState, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    startOfWeek,
    endOfWeek,
    isAfter,
    isBefore
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './Journal.css';

const DateRangePicker = ({ startDate, endDate, onChange, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selecting, setSelecting] = useState(false);
    const [tempStart, setTempStart] = useState(startDate);
    const [tempEnd, setTempEnd] = useState(endDate);

    // Initialize state from props when opening
    useEffect(() => {
        if (startDate) {
            setCurrentMonth(startDate);
            setTempStart(startDate);
        }
        if (endDate) {
            setTempEnd(endDate);
        }
    }, [startDate, endDate]);

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleDayClick = (day) => {
        if (!selecting) {
            // First click: Start a new selection
            setTempStart(day);
            setTempEnd(null);
            setSelecting(true);
        } else {
            // Second click: Complete the selection
            if (isBefore(day, tempStart)) {
                setTempEnd(tempStart);
                setTempStart(day);
            } else {
                setTempEnd(day);
            }
            setSelecting(false);
        }
    };

    const handleApply = () => {
        onChange({ start: tempStart, end: tempEnd });
        onClose();
    };

    const handleClear = () => {
        onChange({ start: null, end: null });
        onClose();
    };

    // Generate calendar days
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart);
    const endDateGrid = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDateGrid,
        end: endDateGrid,
    });

    const isSelected = (day) => {
        if (tempStart && isSameDay(day, tempStart)) return true;
        if (tempEnd && isSameDay(day, tempEnd)) return true;
        if (tempStart && tempEnd && isWithinInterval(day, { start: tempStart, end: tempEnd })) return true;
        return false;
    };

    const isRangeStart = (day) => tempStart && isSameDay(day, tempStart);
    const isRangeEnd = (day) => tempEnd && isSameDay(day, tempEnd);
    const isInRange = (day) => tempStart && tempEnd && isWithinInterval(day, { start: tempStart, end: tempEnd }) && !isRangeStart(day) && !isRangeEnd(day);

    return (
        <div className="date-picker-overlay" onClick={onClose}>
            <div className="date-picker-modal" onClick={e => e.stopPropagation()}>
                <div className="date-picker-header">
                    <h3>Select Date Range</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="calendar-container">
                    <div className="calendar-header">
                        <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                        <span>{format(currentMonth, 'MMMM yyyy')}</span>
                        <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
                    </div>

                    <div className="calendar-grid-header">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="calendar-day-label">{day}</div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {calendarDays.map((day, idx) => (
                            <div
                                key={idx}
                                className={`calendar-day 
                                    ${!isSameMonth(day, currentMonth) ? 'outside-month' : ''}
                                    ${isRangeStart(day) ? 'range-start' : ''}
                                    ${isRangeEnd(day) ? 'range-end' : ''}
                                    ${isInRange(day) ? 'in-range' : ''}
                                `}
                                onClick={() => handleDayClick(day)}
                            >
                                {format(day, 'd')}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="date-picker-footer">
                    <div className="selected-range-text">
                        {tempStart ? format(tempStart, 'MMM d, yyyy') : 'Start Date'}
                        {' - '}
                        {tempEnd ? format(tempEnd, 'MMM d, yyyy') : 'End Date'}
                    </div>
                    <div className="footer-actions">
                        <button className="btn-secondary" onClick={handleClear}>Clear</button>
                        <button
                            className="btn-primary"
                            onClick={handleApply}
                            disabled={!tempStart || (selecting && !tempEnd)}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
