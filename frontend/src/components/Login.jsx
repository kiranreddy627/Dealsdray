import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../dealsdray.png'; // Replace with the actual path to your logo file

const LoginPage = () => {
  const [usermail, setUsermail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (usermail === '' || password === '') {
      setError('Please enter both email and password');
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email: usermail,
          password: password,
        });

        const token = response.data.token;
        const user = response.data.username; // Assuming user details are returned in the response

        // Save token and user details to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/home');

        // Clear form fields and error message
        setUsermail('');
        setPassword('');
        setError('');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized: Please check your credentials.');
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '10px' }}>
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Deals Dray Logo"
            style={{ width: '100px', height: 'auto' }}
          />
          <h3 className="mt-3 fw-bold">Welcome to Deals Dray</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={usermail}
              onChange={(e) => setUsermail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-4">
          <p className="mb-0">New to Deals Dray?</p>
          <Link to="/register" className="btn btn-link p-0">Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
