import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, CheckSquare, Newspaper, Calculator, Moon, Sun, Menu, ChevronLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './Layout.css';

const Sidebar = ({ isCollapsed, toggleSidebar, closeMobileSidebar }) => {
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { path: '/', icon: <BookOpen size={20} />, label: 'Journal' },
        { path: '/checklist', icon: <CheckSquare size={20} />, label: 'Check List' },
        { path: '/news', icon: <Newspaper size={20} />, label: 'News' },
        { path: '/calculator', icon: <Calculator size={20} />, label: 'Calculator' },
    ];

    // Logic to determine classes based on collapse state and screen size
    // On mobile: !isCollapsed means OPEN (visible). isCollapsed means CLOSED (hidden).
    // On desktop: isCollapsed means MINI. !isCollapsed means FULL.
    // We use CSS media queries to interpret the 'collapsed' class differently or add a 'mobile-open' class.
    // Actually, MainLayout passes 'collapsed' class to wrapper.
    // Here we just need to ensure the className reflects the state.

    // To make it simple with the CSS I wrote:
    // Mobile: .sidebar (hidden), .sidebar.mobile-open (visible)
    // Desktop: .sidebar (full), .sidebar.collapsed (mini)

    // We need to know if we are on mobile to apply 'mobile-open' instead of 'collapsed' logic?
    // Or just rely on the fact that I defined:
    // .sidebar { transform: -100% } on mobile
    // .sidebar.mobile-open { transform: 0 }

    // But I am passing `isCollapsed` prop.
    // If isCollapsed is FALSE (default), on Desktop it is OPEN. On Mobile it should be OPEN?
    // If I want Mobile default to be CLOSED, I should initialize state differently or handle it.
    // But state is shared.

    // Let's assume on Mobile, !isCollapsed means "Mobile Open".

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'mobile-open'}`}>
            <div className="sidebar-header">
                <div className="header-content">
                    {(!isCollapsed || window.innerWidth <= 768) && <h1>Forex Journal</h1>}
                    <button onClick={toggleSidebar} className="sidebar-toggle" aria-label="Toggle Sidebar">
                        {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? item.label : ''}
                        onClick={() => {
                            if (window.innerWidth <= 768) closeMobileSidebar();
                        }}
                    >
                        {item.icon}
                        {(!isCollapsed || window.innerWidth <= 768) && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme" title={isCollapsed ? 'Toggle Theme' : ''}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    {(!isCollapsed || window.innerWidth <= 768) && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
