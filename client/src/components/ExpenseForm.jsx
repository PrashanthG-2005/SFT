import React, { useState } from 'react';
import { expenseAPI } from '../services/api';
import CategorySelect from './CategorySelect';

const CAT_OPTIONS = [
  { value: 'Food',          label: '🍕 Food' },
  { value: 'Travel',        label: '✈️ Travel' },
  { value: 'Bills',         label: '🧾 Bills' },
  { value: 'Entertainment', label: '🎬 Entertainment' },
  { value: 'Shopping',      label: '🛍️ Shopping' },
  { value: 'Health',        label: '💊 Health' },
  { value: 'Education',     label: '📚 Education' },
  { value: 'Other',         label: '📌 Other' },
];

const ExpenseForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await expenseAPI.add(formData);
      onAdd(res.data);
      setFormData({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '' });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number" step="0.01" min="0"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <CategorySelect 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})} 
            options={CAT_OPTIONS}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Notes (optional)</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="e.g. Dinner at restaurant"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? '⏳ Adding...' : '➕ Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
