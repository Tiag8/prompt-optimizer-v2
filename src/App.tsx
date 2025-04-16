import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { SidebarLayout } from './components/layout/SidebarLayout';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const OptimizerPage = React.lazy(() => import('./pages/OptimizerPage'));
const ApiConfigPage = React.lazy(() => import('./pages/ApiConfigPage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SidebarLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/optimizer" element={<OptimizerPage />} />
              <Route path="/api-config" element={<ApiConfigPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </React.Suspense>
        </SidebarLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;