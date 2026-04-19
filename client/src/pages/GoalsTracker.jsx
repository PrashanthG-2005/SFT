import React, { useState, useEffect } from 'react';
import { goalAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/pages/goals.css';

const GoalsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '' });
  const [loading, setLoading] = useState(true);
  const [addingAmountId, setAddingAmountId] = useState(null);
  const [amountInput, setAmountInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const res = await goalAPI.getAll();
      setGoals(res.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await goalAPI.add(newGoal);
      setGoals([res.data, ...goals]);
      setNewGoal({ title: '', targetAmount: '' });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleAddAmount = async (goalId) => {
    if (!amountInput || isNaN(amountInput)) return;
    try {
      await goalAPI.addAmount(goalId, { amount: parseFloat(amountInput) });
      setAddingAmountId(null);
      setAmountInput('');
      fetchGoals();
    } catch (error) {
      console.error('Error adding to goal:', error);
    }
  };

  const handleDeleteGoal = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete) {
        await goalAPI.delete(itemToDelete);
        setGoals(goals.filter(g => g._id !== itemToDelete));
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const completed = goals.filter(g => g.currentAmount >= g.targetAmount).length;

  if (loading) return <div className="loading-state">⏳ Loading your goals...</div>;

  return (
    <div className="goals-tracker">
      {/* Hero Header */}
      <div className="page-hero">
        <div className="page-hero-row">
          <div>
            <h1>Savings Goals</h1>
            <p>Define your financial dreams and track your progress toward achieving them.</p>
          </div>
          <span className="page-hero-icon">🎯</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="card stat-card goals-accent">
          <h3>Total Saved</h3>
          <div className="stat-value">₹{totalSaved.toLocaleString('en-IN')}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>Across all goals</p>
        </div>
        <div className="card stat-card investments-accent">
          <h3>Target Amount</h3>
          <div className="stat-value">₹{totalTarget.toLocaleString('en-IN')}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>Combined target</p>
        </div>
        <div className="card stat-card budgets-accent">
          <h3>Completed</h3>
          <div className="stat-value">{completed} / {goals.length}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>Goals achieved</p>
        </div>
      </div>

      {/* Create Goal Form */}
      <div className="goal-form card">
        <h3 style={{marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
          ➕ Create New Goal
        </h3>
        <form onSubmit={handleAddGoal}>
          <div className="form-row">
            <div className="form-group">
              <label>Goal Name</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g. Emergency Fund, New Laptop"
                required
              />
            </div>
            <div className="form-group">
              <label>Target Amount</label>
              <input
                type="number"
                step="0.01"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                placeholder="e.g. 50000"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success">Create Goal</button>
        </form>
      </div>

      {/* Goals Grid */}
      <h3 style={{marginBottom:'1.25rem', color:'var(--slate-dark)', fontWeight:700}}>
        Your Goals ({goals.length})
      </h3>
      <div className="goals-grid">
        {goals.length === 0 ? (
          <div className="rich-empty-state">
            <span className="empty-icon">🎯</span>
            <h3>No Savings Goals Yet</h3>
            <p>Great wealth starts with a clear goal. Add your first savings target — whether it's an emergency fund, a vacation, or a new gadget!</p>
            <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
              {['Emergency Fund 🛡️','Vacation ✈️','New Car 🚗','Education 📚'].map(g => (
                <span key={g} style={{background:'var(--gray-light)', padding:'0.5rem 1rem', borderRadius:'20px', fontSize:'0.9rem', color:'var(--slate-medium)'}}>{g}</span>
              ))}
            </div>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1);
            const isComplete = goal.currentAmount >= goal.targetAmount;
            return (
              <div key={goal._id} className="card goal-card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem'}}>
                  <h4>{isComplete ? '✅' : '🎯'} {goal.title}</h4>
                  {isComplete && (
                    <span style={{background:'#D1FAE5', color:'#065F46', padding:'2px 10px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:700}}>
                      Complete!
                    </span>
                  )}
                </div>

                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${progress}%`, background: isComplete ? '#10B981' : undefined}}></div>
                  </div>
                  <span style={{color: isComplete ? '#10B981' : undefined}}>{progress}%</span>
                </div>

                <div className="goal-amounts">
                  <span>Saved: <strong>₹{goal.currentAmount.toLocaleString('en-IN')}</strong></span>
                  <span>Target: <strong>₹{goal.targetAmount.toLocaleString('en-IN')}</strong></span>
                </div>

                <div className="goal-actions">
                  {addingAmountId === goal._id ? (
                    <div className="add-amount-inline">
                      <input
                        type="number"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder="Amount"
                        autoFocus
                      />
                      <button onClick={() => handleAddAmount(goal._id)} className="btn btn-success btn-sm">Save</button>
                      <button onClick={() => setAddingAmountId(null)} className="btn btn-secondary btn-sm">✕</button>
                    </div>
                  ) : (
                    <>
                      {!isComplete && (
                        <button
                          onClick={() => { setAddingAmountId(goal._id); setAmountInput(''); }}
                          className="btn btn-primary btn-sm"
                        >
                          + Add Funds
                        </button>
                      )}
                      <button onClick={() => handleDeleteGoal(goal._id)} className="btn btn-danger btn-sm">Delete</button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete}
        title="Delete Savings Goal?"
        message="Are you sure you want to remove this financial goal? Your progress tracking for this goal will be permanently lost."
      />
    </div>
  );
};

export default GoalsTracker;
