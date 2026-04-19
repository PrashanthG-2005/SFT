import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/pages/expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete) {
        await expenseAPI.delete(itemToDelete);
        setExpenses(expenses.filter(exp => exp._id !== itemToDelete));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (expense) => { setEditingId(expense._id); setEditData(expense); };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await expenseAPI.update(editingId, editData);
      setExpenses(expenses.map(exp => exp._id === editingId ? res.data : exp));
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const categoryIcons = { Food: '🍕', Travel: '✈️', Bills: '🧾', Entertainment: '🎬', Shopping: '🛍️', Health: '💊', Education: '📚', Other: '📌' };

  if (loading) return <div className="loading-state">⏳ Loading your expenses...</div>;

  return (
    <div className="expenses-page">
      {/* Hero Header */}
      <div className="page-hero">
        <div className="page-hero-row">
          <div>
            <h1>Expense Tracker</h1>
            <p>Monitor and manage your daily spending with ease.</p>
          </div>
          <span className="page-hero-icon">💸</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="card stat-card expenses-accent">
          <h3>Total Spent</h3>
          <div className="stat-value">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
          <p className="stat-meta">{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="card stat-card goals-accent">
          <h3>This Month</h3>
          <div className="stat-value">
            ₹{expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth())
              .reduce((s,e) => s + parseFloat(e.amount||0), 0)
              .toLocaleString('en-IN', {minimumFractionDigits: 2})}
          </div>
          <p className="stat-meta">Current month</p>
        </div>
        <div className="card stat-card investments-accent">
          <h3>Categories</h3>
          <div className="stat-value">{new Set(expenses.map(e => e.category)).size}</div>
          <p className="stat-meta">Unique categories</p>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="card" style={{marginBottom: '2rem', padding: '2rem'}}>
        <h3 style={{marginBottom: '1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
          <span>➕</span> Add New Expense
        </h3>
        <ExpenseForm onAdd={(expense) => setExpenses([expense, ...expenses])} />
      </div>

      {/* Expenses Table */}
      <div>
        <h3 style={{marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700}}>
          Transaction History ({expenses.length})
        </h3>
        {expenses.length === 0 ? (
          <div className="rich-empty-state">
            <span className="empty-icon">💸</span>
            <h3>No Expenses Recorded Yet</h3>
            <p>Start tracking your spending by adding your first expense above. Every rupee counts toward a smarter financial future!</p>
            <div style={{display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap', marginTop:'1rem'}}>
              {['Food 🍕', 'Travel ✈️', 'Bills 🧾', 'Shopping 🛍️'].map(c => (
                <span key={c} style={{background: 'var(--bg-color)', padding:'0.5rem 1rem', borderRadius:'20px', fontSize:'0.9rem', color:'var(--text-secondary)'}}>{c}</span>
              ))}
            </div>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense._id}>
                    <td>{new Date(expense.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
                    <td>
                      <span className={`category-badge category-${expense.category.toLowerCase().replace(' ','-')}`}>
                        {categoryIcons[expense.category] || '📌'} {expense.category}
                      </span>
                    </td>
                    <td style={{fontWeight: 700, color: 'var(--coral)'}}>
                      -₹{parseFloat(expense.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </td>
                    <td style={{color: 'var(--text-secondary)'}}>{expense.notes || '—'}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleEdit(expense)} className="btn btn-secondary btn-sm">Edit</button>
                        <button onClick={() => handleDelete(expense._id)} className="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="edit-modal">
          <div className="edit-card card">
            <h3 style={{marginBottom:'1.5rem'}}>✏️ Edit Expense</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{marginBottom:'1rem'}}>
                <label>Amount</label>
                <input type="number" value={editData.amount} onChange={(e) => setEditData({...editData, amount: e.target.value})} />
              </div>
              <div className="form-group" style={{marginBottom:'1.5rem'}}>
                <label>Category</label>
                <select value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})}>
                  {['Food','Travel','Bills','Entertainment','Shopping','Health','Education','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{display:'flex', gap:'1rem'}}>
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" onClick={() => setEditingId(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete}
        title="Delete Expense?"
        message="Are you sure you want to remove this transaction? This will affect your budget and reports."
      />
    </div>
  );
};

export default Expenses;
