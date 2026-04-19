import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import jsPDF from 'jspdf';
import '../styles/pages/reports.css';

const CAT_ICONS = { Food:'🍕', Travel:'✈️', Bills:'🧾', Entertainment:'🎬', Shopping:'🛍️', Health:'💊', Education:'📚', Other:'📌' };

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await expenseAPI.getAll();
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    if (!dateRange.start && !dateRange.end) return expenses;
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
      const end = dateRange.end ? new Date(dateRange.end) : new Date();
      return expDate >= start && expDate <= end;
    });
  };

  const filteredExpenses = filterExpenses();
  const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const avg = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;

  // Category breakdown
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount || 0);
    return acc;
  }, {});

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('SmartFinance - Financial Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, 30);
    doc.text(`Period: ${dateRange.start || 'All time'} → ${dateRange.end || 'Now'}`, 20, 38);
    doc.text(`Total Expenses: Rs. ${total.toLocaleString('en-IN')}`, 20, 48);
    doc.text(`Transactions: ${filteredExpenses.length}`, 20, 56);
    let y = 70;
    doc.setFontSize(10);
    filteredExpenses.forEach((exp) => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(`${new Date(exp.date).toLocaleDateString()} | ${exp.category} | Rs. ${parseFloat(exp.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})} | ${exp.notes || ''}`, 20, y);
      y += 8;
    });
    doc.save('smartfinance-report.pdf');
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Category', 'Amount', 'Notes'],
      ...filteredExpenses.map(exp => [
        new Date(exp.date).toLocaleDateString(),
        exp.category,
        parseFloat(exp.amount).toFixed(2),
        exp.notes || ''
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartfinance-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading-state">⏳ Generating your reports...</div>;

  return (
    <div className="reports-page">
      {/* Hero Header */}
      <div className="page-hero">
        <div className="page-hero-row">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Analyze your spending patterns and export detailed financial reports.</p>
          </div>
          <span className="page-hero-icon">📊</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="card stat-card expenses-accent">
          <h3>Total Expenses</h3>
          <div className="stat-value">₹{total.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
          <p className="stat-meta">{filteredExpenses.length} transactions</p>
        </div>
        <div className="card stat-card budgets-accent">
          <h3>Average Expense</h3>
          <div className="stat-value">₹{avg.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
          <p className="stat-meta">Per transaction</p>
        </div>
        <div className="card stat-card goals-accent">
          <h3>Top Category</h3>
          <div className="stat-value" style={{fontSize:'1.5rem'}}>
            {Object.keys(categoryTotals).length > 0
              ? `${CAT_ICONS[Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1])[0][0]] || '📌'} ${Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1])[0][0]}`
              : '—'}
          </div>
          <p className="stat-meta">Highest spending</p>
        </div>
      </div>

      {/* Filters + Export */}
      <div className="card" style={{padding:'2rem', marginBottom:'2rem'}}>
        <h3 style={{marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
          🔍 Filter & Export
        </h3>
        <div className="form-row" style={{marginBottom:'1.5rem'}}>
          <div className="form-group">
            <label>From Date</label>
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
          </div>
        </div>
        <div className="export-actions-row">
          <button onClick={exportPDF} className="btn btn-primary">📄 Export PDF Report</button>
          <button onClick={exportCSV} className="btn btn-secondary">📊 Export CSV Spreadsheet</button>
          {(dateRange.start || dateRange.end) && (
            <button onClick={() => setDateRange({start:'', end:''})} className="btn btn-secondary">✕ Clear Filter</button>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="card" style={{padding:'2rem', marginBottom:'2rem'}}>
          <h3 style={{marginBottom:'1.5rem'}}>📊 Spending by Category</h3>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem'}}>
            {Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1]).map(([cat, amount]) => {
              const pct = total > 0 ? ((amount/total)*100).toFixed(1) : 0;
              return (
                <div key={cat} style={{padding:'1rem', background:'var(--bg-color)', borderRadius:'12px', border:'1px solid var(--border-color)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem'}}>
                    <span style={{fontWeight:600}}>{CAT_ICONS[cat] || '📌'} {cat}</span>
                    <span style={{fontSize:'0.85rem', color:'var(--text-secondary)'}}>{pct}%</span>
                  </div>
                  <div style={{fontWeight:800, color:'var(--text-primary)', fontSize:'1.1rem'}}>₹{amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
                  <div style={{height:'4px', background:'var(--border-color)', borderRadius:'2px', marginTop:'0.5rem'}}>
                    <div style={{width:`${pct}%`, height:'100%', background:'var(--indigo-deep)', borderRadius:'2px'}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div>
        <h3 style={{marginBottom:'1rem', fontWeight:700}}>Recent Transactions ({filteredExpenses.length})</h3>
        {filteredExpenses.length === 0 ? (
          <div className="rich-empty-state">
            <span className="empty-icon">📊</span>
            <h3>No Data to Report</h3>
            <p>Add some expenses first, then come back here to generate beautiful PDF and CSV reports with spending breakdowns.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.slice(0,25).map(expense => (
                  <tr key={expense._id}>
                    <td>{new Date(expense.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
                    <td>
                      <span className={`category-badge category-${expense.category.toLowerCase().replace(' ','-')}`}>
                        {CAT_ICONS[expense.category] || '📌'} {expense.category}
                      </span>
                    </td>
                    <td style={{fontWeight:700, color:'var(--coral)'}}>-₹{parseFloat(expense.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td style={{color:'var(--text-secondary)'}}>{expense.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredExpenses.length > 25 && (
              <div style={{padding:'1rem 1.25rem', color:'var(--text-secondary)', fontSize:'0.9rem', borderTop:'1px solid var(--border-color)'}}>
                Showing 25 of {filteredExpenses.length} transactions. Export PDF/CSV to see all.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
