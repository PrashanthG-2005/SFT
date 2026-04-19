import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-brand">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <div className="brand-icon-wrapper">
              <span className="brand-icon">💎</span>
            </div>
            <span className="brand-text">SmartFinance</span>
          </Link>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <NavLink to="/" onClick={() => setIsOpen(false)} end>Home</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                <NavLink to="/expenses" onClick={() => setIsOpen(false)}>Expenses</NavLink>
                <NavLink to="/budgets" onClick={() => setIsOpen(false)}>Budgets</NavLink>
                <NavLink to="/goals" onClick={() => setIsOpen(false)}>Goals</NavLink>
                <NavLink to="/investments" onClick={() => setIsOpen(false)}>Investments</NavLink>
                <NavLink to="/reports" onClick={() => setIsOpen(false)}>Reports</NavLink>
              </>
            )}
          </div>

          <div className="nav-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {!user ? (
              <>
                <Link to="/login" className="nav-btn-text" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link to="/register" className="nav-btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <div className="user-profile-menu">
                <span className="user-name">Hi, {user.name}</span>
                <button onClick={handleLogout} className="nav-btn-logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className={`nav-toggle ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


