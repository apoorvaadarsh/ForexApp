import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './Layout.css';

const MainLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('sidebar_collapsed', false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className={`main-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarCollapsed(false)}>
                <Menu size={24} />
            </button>

            <div
                className={`sidebar-backdrop ${!isSidebarCollapsed ? 'visible' : ''}`}
                onClick={() => setIsSidebarCollapsed(true)}
            />

            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                closeMobileSidebar={() => setIsSidebarCollapsed(true)}
            />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
