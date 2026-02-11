import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Employees from './pages/Employees';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import { ROUTES } from './constants';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.EMPLOYEES} element={<Employees />} />
          <Route path={ROUTES.ATTENDANCE} element={<Attendance />} />
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
