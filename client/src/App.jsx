import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import BudgetPlanner from './pages/BudgetPlanner';
import GoalsTracker from './pages/GoalsTracker';
import InvestmentDashboard from './pages/InvestmentDashboard';
import Reports from './pages/Reports';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budgets" element={<BudgetPlanner />} />
            <Route path="/goals" element={<GoalsTracker />} />
            <Route path="/investments" element={<InvestmentDashboard />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;

