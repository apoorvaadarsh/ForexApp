import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import JournalPage from './pages/JournalPage';
import CheckList from './pages/CheckList';
import News from './pages/News';
import PositionCalculator from './pages/PositionCalculator';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<JournalPage />} />
            <Route path="/checklist" element={<CheckList />} />
            <Route path="/news" element={<News />} />
            <Route path="/calculator" element={<PositionCalculator />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
