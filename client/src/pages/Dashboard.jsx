import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseAPI, budgetAPI, goalAPI, investmentAPI } from '../services/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler, BarElement
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import '../styles/pages/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler, BarElement);

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, budRes, goalRes, invRes] = await Promise.all([
          expenseAPI.getAll(), budgetAPI.getAll(), goalAPI.getAll(), investmentAPI.getAll(),
        ]);
        setExpenses(expRes.data);
        setBudgets(budRes.data);
        setGoals(goalRes.data);
        setInvestments(invRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  // Get current theme color for text/grid
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const primaryBrand = isDark ? '#60A5FA' : '#1E3A5F';

  // Category breakdown
  const categoryExpenses = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount || 0);
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryExpenses),
    datasets: [{
      data: Object.values(categoryExpenses),
      backgroundColor: ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#06B6D4','#84CC16','#EC4899'],
      borderWidth: isDark ? 0 : 2,
      borderColor: isDark ? 'transparent' : '#fff',
    }],
  };

  // 30-day trend
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const expensesByDay = {};
  expenses.filter(exp => new Date(exp.date) >= thirtyDaysAgo).forEach(exp => {
    const dateKey = new Date(exp.date).toISOString().split('T')[0];
    expensesByDay[dateKey] = (expensesByDay[dateKey] || 0) + parseFloat(exp.amount || 0);
  });
  const thirtyDays = Array.from({length: 30}, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  });
  const trendData = {
    labels: thirtyDays.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Daily Spending',
      data: thirtyDays.map(date => expensesByDay[date] || 0),
      borderColor: primaryBrand,
      backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(30, 58, 95, 0.08)',
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: primaryBrand,
    }],
  };

  // Budget vs Spent bar chart
  const budgetChartData = {
    labels: budgets.map(b => b.category),
    datasets: [
      {
        label: 'Budget',
        data: budgets.map(b => b.amount),
        backgroundColor: isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(30, 58, 95, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Spent',
        data: budgets.map(b => b.spent),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 6,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12, family: 'Inter' }, color: textColor } }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        grid: { color: gridColor },
        ticks: { font: { size: 11 }, color: textColor } 
      },
      x: {
        grid: { display: false },
        ticks: { color: textColor }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 14, font: { size: 12, family: 'Inter' }, color: textColor } }
    }
  };

  const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const totalInvestments = investments.reduce((s, i) => s + parseFloat(i.currentValue || i.amount || 0), 0);
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

  if (loading) {
    return (
      <div className="loading-state">
        <span>⏳</span> Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="page-hero" style={{marginBottom:'2rem'}}>
        <div className="page-hero-row">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            <p>Here's a snapshot of your financial health as of {new Date().toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}.</p>
          </div>
          <span className="page-hero-icon">💎</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="card stat-card expenses-accent">
          <div className="stat-icon">💸</div>
          <h3>Total Expenses</h3>
          <div className="stat-value">₹{totalExpenses.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
          <p className="stat-meta">{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="card stat-card goals-accent">
          <div className="stat-icon">🎯</div>
          <h3>Savings Goals</h3>
          <div className="stat-value">{goals.length}</div>
          <p className="stat-meta">{completedGoals} completed</p>
        </div>
        <div className="card stat-card investments-accent">
          <div className="stat-icon">📈</div>
          <h3>Portfolio Value</h3>
          <div className="stat-value">₹{totalInvestments.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
          <p className="stat-meta">{investments.length} investments</p>
        </div>
        <div className="card stat-card budgets-accent">
          <div className="stat-icon">📋</div>
          <h3>Active Budgets</h3>
          <div className="stat-value">{budgets.length}</div>
          <p className="stat-meta">
            {budgets.filter(b => b.spent > b.amount).length} over limit
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="card">
          <h3 style={{marginBottom:'1.25rem', fontWeight:700}}>📊 Expenses by Category</h3>
          <div className="chart-container">
            {Object.keys(categoryExpenses).length > 0
              ? <Pie data={categoryData} options={pieOptions} />
              : <div className="empty-chart">
                  <span className="empty-icon">📊</span>
                  <span>Add expenses to see breakdown</span>
                </div>
            }
          </div>
        </div>
        <div className="card">
          <h3 style={{marginBottom:'1.25rem', fontWeight:700}}>📉 30-Day Spending Trend</h3>
          <div className="chart-container">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Budget vs Spent Chart */}
      <div className="card" style={{marginBottom:'2rem', padding:'2rem', minHeight:'360px'}}>
        <h3 style={{marginBottom:'1.25rem', fontWeight:700}}>📋 Budget vs. Actual Spending</h3>
        {budgets.length > 0 ? (
          <div style={{height:'280px'}}>
            <Bar data={budgetChartData} options={chartOptions} />
          </div>
        ) : (
          <div className="empty-chart" style={{height:'280px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'var(--bg-color)', borderRadius:'12px', border:'2px dashed var(--border-color)'}}>
            <span className="empty-icon" style={{fontSize:'3.5rem', marginBottom:'1rem', opacity:0.6}}>📋</span>
            <h4 style={{color:'var(--text-primary)', marginBottom:'0.5rem'}}>No Budgets Set Yet</h4>
            <p style={{color:'var(--text-secondary)', fontSize:'0.9rem'}}>Set spending limits in the Budget Planner to see your progress here.</p>
          </div>
        )}
      </div>

      {/* Quick Overview Grid */}
      <div className="charts-grid">
        {/* Recent Expenses */}
        <div className="card dashboard-list-card">
          <h3 className="section-title">🕐 Recent Expenses</h3>
          {expenses.length === 0 ? (
            <div className="empty-state-mini">
              <div className="empty-icon-mini">💸</div>
              <p>No expenses yet. Start tracking!</p>
            </div>
          ) : (
            <div className="recent-list">
              {expenses.slice(0, 5).map(e => (
                <div key={e._id} className="recent-item">
                  <div className="recent-info">
                    <div className="recent-category">{e.category}</div>
                    <div className="recent-date">{new Date(e.date).toLocaleDateString()}</div>
                  </div>
                  <div className="recent-amount">-₹{parseFloat(e.amount).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals Progress */}
        <div className="card dashboard-list-card">
          <h3 className="section-title">🎯 Goals Progress</h3>
          {goals.length === 0 ? (
            <div style={{textAlign:'center', padding:'2rem', color:'var(--slate-medium)'}}>
              <div style={{fontSize:'2rem', marginBottom:'0.5rem'}}>🎯</div>
              <p>No goals yet. Create a savings goal!</p>
            </div>
          ) : (
            <div>
              {goals.slice(0, 4).map(g => {
                const pct = Math.min((g.currentAmount/g.targetAmount)*100, 100);
                return (
                  <div key={g._id} className="goal-overview-item">
                    <div className="goal-overview-header">
                      <span className="goal-title">{g.title}</span>
                      <span className={`goal-pct ${pct >= 100 ? 'status-success' : ''}`}>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="goal-progress-track">
                      <div className={`goal-progress-fill ${pct >= 100 ? 'status-fill-success' : ''}`} style={{width:`${pct}%`}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
