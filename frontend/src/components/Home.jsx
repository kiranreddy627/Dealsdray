import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Deals Dray Admin Panel</h1>
      <p className="mt-3">Manage your employees, view analytics, and more.</p>
      <div className="mt-4">
        <Link to="/admin-panel" className="btn btn-primary">
          Go to Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
