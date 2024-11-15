
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import AdminPanel from './components/AdminPanel';
import HomePage from './components/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/home" element={<HomePage />} />
        {/* Add a default route if needed */}
      </Routes>
    </Router>
  );
}

export default App;
