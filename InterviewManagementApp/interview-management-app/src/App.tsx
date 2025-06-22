import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Interviews from './pages/Interviews';
import Interviewers from './pages/Interviewers';
import Feedback from './pages/Feedback';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/interviewers" element={<Interviewers />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
