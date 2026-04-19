import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import CategorySelect from '../components/CategorySelect';
import '../styles/pages/budget-planner.css';

const CATEGORIES = ['Food','Travel','Bills','Entertainment','Shopping','Health','Education','Other'];
const CAT_ICONS = { Food:'🍕', Travel:'✈️', Bills:'🧾', Entertainment:'🎬', Shopping:'🛍️', Health:'💊', Education:'📚', Other:'📌' };

const CAT_OPTIONS = CATEGORIES.map(c => ({ value: c, label: `${CAT_ICONS[c]} ${c}` }));

const BudgetPlanner = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newBudget, setNewBudget] = useState({ category: 'Food', amount: '', spent: '0' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchBudgets(); }, []);

  const fetchBudgets = async () => {
    try {
      const res = await budgetAPI.getAll();
      setBudgets(res.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await budgetAPI.add(newBudget);
      setBudgets([res.data, ...budgets]);
      setNewBudget({ category: 'Food', amount: '', spent: '0' });
    } catch (error) {
      alert(error.msg || 'Error adding budget');
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete) {
        await budgetAPI.delete(itemToDelete);
        setBudgets(budgets.filter(b => b._id !== itemToDelete));
        // Reset edit mode if the deleted item was being edited
        if (itemToDelete === editingId) {
          setEditingId(null);
          setEditData({});
        }
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (budget) => { setEditingId(budget._id); setEditData(budget); };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await budgetAPI.update(editingId, editData);
      setBudgets(budgets.map(b => b._id === editingId ? res.data : b));
      setEditingId(null);
      setEditData({});
    } catch (error) {
      alert('Error updating budget');
    }
  };

  if (loading) return <div className="loading-state">⏳ Loading your budgets...</div>;

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="budget-planner">
      {/* Hero Header */}
      <div className="page-hero">
        <div className="page-hero-row">
          <div>
            <h1>Budget Planner</h1>
            <p>Set spending limits and track how well you're sticking to your plan.</p>
          </div>
          <span className="page-hero-icon">📋</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="card stat-card investments-accent">
          <h3>Total Budget</h3>
          <div className="stat-value">₹{totalBudget.toLocaleString('en-IN')}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>{budgets.length} budgets set</p>
        </div>
        <div className="card stat-card expenses-accent">
          <h3>Total Spent</h3>
          <div className="stat-value">₹{totalSpent.toLocaleString('en-IN')}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>
            {totalBudget > 0 ? ((totalSpent/totalBudget)*100).toFixed(1) : 0}% of budget used
          </p>
        </div>
        <div className="card stat-card goals-accent">
          <h3>Remaining</h3>
          <div className="stat-value" style={{color: remaining >= 0 ? '#10B981' : '#EF4444'}}>₹{Math.abs(remaining).toLocaleString('en-IN')}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>{remaining >= 0 ? 'Available to spend' : 'Over budget!'}</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="card" style={{marginBottom:'2rem', padding:'2rem'}}>
        <h3 style={{marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
          <span>{editingId ? '✏️ Edit Budget' : '➕ Add New Budget'}</span>
        </h3>
        {editingId ? (
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <CategorySelect 
                  value={editData.category||''} 
                  onChange={(e) => setEditData({...editData, category: e.target.value})} 
                  options={CAT_OPTIONS}
                />
              </div>
              <div className="form-group">
                <label>Monthly Amount</label>
                <input type="number" step="0.01" value={editData.amount}
                  onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})} required />
              </div>
              <div className="form-group">
                <label>Amount Spent</label>
                <input type="number" step="0.01" value={editData.spent}
                  onChange={(e) => setEditData({...editData, spent: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
              <button type="submit" className="btn btn-success">Update Budget</button>
              <button type="button" onClick={() => {setEditingId(null); setEditData({});}} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <CategorySelect 
                  value={newBudget.category} 
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})} 
                  options={CAT_OPTIONS}
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Amount</label>
                <input type="number" step="0.01" value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  placeholder="e.g. 5000" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Budget</button>
          </form>
        )}
      </div>

      {/* Budgets List */}
      <div>
        <h3 style={{marginBottom:'1.25rem', color:'var(--slate-dark)', fontWeight:700}}>
          Your Budgets ({budgets.length})
        </h3>
        {budgets.length === 0 ? (
          <div className="rich-empty-state">
            <span className="empty-icon">📋</span>
            <h3>No Budgets Planned Yet</h3>
            <p>Create spending limits for categories like Food, Bills, or Entertainment. Staying within budget is the #1 habit of financially free people.</p>
            <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
              {['Food 🍕','Bills 🧾','Entertainment 🎬','Travel ✈️'].map(c => (
                <span key={c} style={{background:'var(--gray-light)', padding:'0.5rem 1rem', borderRadius:'20px', fontSize:'0.9rem', color:'var(--slate-medium)'}}>{c}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="budgets-grid">
            {budgets.map((budget) => {
              const progress = budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;
              const isOver = budget.spent > budget.amount;
              return (
                <div key={budget._id} className="card budget-card">
                  <div className="budget-header">
                    <div>
                      <span style={{fontSize:'1.75rem'}}>{CAT_ICONS[budget.category] || '📌'}</span>
                      <h4 style={{marginTop:'0.4rem'}}>{budget.category}</h4>
                    </div>
                    <div className="budget-actions">
                      <button onClick={() => handleEdit(budget)} className="btn btn-secondary btn-sm">Edit</button>
                      <button onClick={() => handleDelete(budget._id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </div>
                  <div className="budget-amounts">
                    <div>Budget: <strong>₹{budget.amount.toLocaleString('en-IN')}</strong></div>
                    <div>Spent: <strong style={{color: isOver ? '#EF4444' : 'inherit'}}>₹{budget.spent.toLocaleString('en-IN')}</strong></div>
                    <div>Left: <strong style={{color: isOver ? '#EF4444' : '#10B981'}}>₹{(budget.amount - budget.spent).toLocaleString('en-IN')}</strong></div>
                  </div>
                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width:`${progress}%`, background: isOver ? '#EF4444' : undefined}}></div>
                    </div>
                    <span style={{color: isOver ? '#EF4444' : 'var(--slate-medium)', fontWeight: isOver ? 700 : 500}}>
                      {progress.toFixed(1)}% {isOver ? '⚠️ Over!' : 'used'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete}
        title="Delete Budget?"
        message="Are you sure you want to remove this budget category? This cannot be undone."
      />
    </div>
  );
};

export default BudgetPlanner;
