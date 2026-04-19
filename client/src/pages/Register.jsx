import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Failed to create account. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">💎</div>
          <h1>SmartFinance</h1>
          <p>Create your free account</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe" required autoComplete="name"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required autoComplete="email"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters" minLength="6"
              required autoComplete="new-password"
            />
          </div>

          {/* Feature highlights */}
          <div className="auth-features">
            <div className="auth-feature"><span>✅</span> Free expense tracking</div>
            <div className="auth-feature"><span>✅</span> Budget planning tools</div>
            <div className="auth-feature"><span>✅</span> Investment portfolio</div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-success auth-submit-btn">
            {loading ? '⏳ Creating account...' : '🚀 Create Free Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
