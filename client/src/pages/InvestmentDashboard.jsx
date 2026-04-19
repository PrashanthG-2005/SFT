import React, { useState, useEffect } from 'react';
import { investmentAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import CategorySelect from '../components/CategorySelect';
import '../styles/pages/investment-dashboard.css';

const TYPE_CONFIG = {
  'SIP':         { icon: '📈', color: '#10B981', bg: '#D1FAE5', label: 'SIP' },
  'Stock':       { icon: '📊', color: '#3B82F6', bg: '#DBEAFE', label: 'Stock' },
  'Mutual Fund': { icon: '🏦', color: '#6366F1', bg: '#E0E7FF', label: 'Mutual Fund' },
  'FD':          { icon: '🔒', color: '#F59E0B', bg: '#FEF3C7', label: 'FD' },
  'Other':       { icon: '💼', color: '#6B7280', bg: '#F3F4F6', label: 'Other' },
};

const TYPE_OPTIONS = Object.entries(TYPE_CONFIG).map(([val, cfg]) => ({
  value: val,
  label: `${cfg.icon} ${cfg.label}`
}));

const InvestmentDashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({ 
    type: 'SIP', 
    name: '', 
    amount: '', 
    currentValue: '',
    expectedReturn: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { fetchInvestments(); }, []);

  const fetchInvestments = async () => {
    try {
      const res = await investmentAPI.getAll();
      setInvestments(res.data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...newInvestment,
        amount: parseFloat(newInvestment.amount),
        currentValue: newInvestment.currentValue === "" ? parseFloat(newInvestment.amount) : parseFloat(newInvestment.currentValue),
        expectedReturn: parseFloat(newInvestment.expectedReturn || 0)
      };
      const res = await investmentAPI.add(dataToSend);
      setInvestments([res.data, ...investments]);
      setNewInvestment({ 
        type: 'SIP', 
        name: '', 
        amount: '', 
        currentValue: '',
        expectedReturn: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  const handleEdit = (investment) => {
    setEditingId(investment._id);
    setEditData(investment);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = {
        ...editData,
        amount: parseFloat(editData.amount),
        currentValue: parseFloat(editData.currentValue),
        expectedReturn: parseFloat(editData.expectedReturn || 0)
      };
      const res = await investmentAPI.update(editingId, dataToUpdate);
      setInvestments(investments.map(i => i._id === editingId ? res.data : i));
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating investment:', error);
    }
  };

  const handleDeleteInvestment = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete) {
        await investmentAPI.delete(itemToDelete);
        setInvestments(investments.filter(i => i._id !== itemToDelete));
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalCurrentValue = investments.reduce((sum, i) => sum + parseFloat(i.currentValue !== undefined ? i.currentValue : i.amount), 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalGrowth = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  const typeBreakdown = Object.keys(TYPE_CONFIG).map(type => ({
    type,
    total: investments.filter(i => i.type === type).reduce((s, i) => s + i.amount, 0),
    count: investments.filter(i => i.type === type).length,
  })).filter(t => t.count > 0);

  if (loading) return <div className="loading-state">⏳ Loading your portfolio...</div>;

  return (
    <div className="investment-dashboard">
      {/* Hero Header */}
      <div className="page-hero">
        <div className="page-hero-row">
          <div>
            <h1>Investment Portfolio</h1>
            <p>Track your SIPs, stocks, mutual funds, and FDs in one place.</p>
          </div>
          <span className="page-hero-icon">📈</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="card stat-card investments-accent">
          <h3>Total Portfolio Value</h3>
          <div className="stat-value">₹{totalCurrentValue.toLocaleString('en-IN')}</div>
          <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.4rem'}}>
            <span style={{color: totalProfitLoss >= 0 ? '#10B981' : '#EF4444', fontWeight:700, fontSize:'0.9rem'}}>
              {totalProfitLoss >= 0 ? '↑' : '↓'} ₹{Math.abs(totalProfitLoss).toLocaleString('en-IN')} ({totalGrowth.toFixed(1)}%)
            </span>
            <span style={{color:'var(--slate-medium)', fontSize:'0.85rem'}}>Profit/Loss</span>
          </div>
        </div>
        <div className="card stat-card">
          <h3>Total Invested</h3>
          <div className="stat-value" style={{color:'var(--slate-dark)'}}>₹{totalInvested.toLocaleString('en-IN')}</div>
          <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>{investments.length} position{investments.length !== 1 ? 's' : ''}</p>
        </div>
        {typeBreakdown.slice(0, 2).map(t => (
          <div key={t.type} className="card stat-card" style={{borderTopColor: TYPE_CONFIG[t.type]?.color, borderTopWidth:4, borderTopStyle:'solid'}}>
            <h3>{TYPE_CONFIG[t.type]?.icon} {t.type}</h3>
            <div className="stat-value">₹{t.total.toLocaleString('en-IN')}</div>
            <p style={{color:'var(--slate-medium)', fontSize:'0.85rem', marginTop:'0.4rem'}}>{t.count} position{t.count !== 1 ? 's' : ''}</p>
          </div>
        ))}
        {typeBreakdown.length === 0 && (
          <div className="card" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'var(--slate-medium)'}}>
            Add your first investment →
          </div>
        )}
      </div>

      {/* Add Investment Form */}
      <div className="card investment-form">
        <h3 style={{marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
          ➕ Add New Investment
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Investment Type</label>
              <CategorySelect 
                value={newInvestment.type} 
                onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})} 
                options={TYPE_OPTIONS}
              />
            </div>
            <div className="form-group">
              <label>Investment Name</label>
              <input
                type="text"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                placeholder="e.g. HDFC Flexi Cap Fund"
                required
              />
            </div>
            <div className="form-group">
              <label>Current Value</label>
              <input
                type="number"
                step="0.01"
                value={newInvestment.currentValue}
                onChange={(e) => setNewInvestment({...newInvestment, currentValue: e.target.value})}
                placeholder="Initial value (or leave blank if same as invested)"
              />
            </div>
            <div className="form-group">
              <label>Amount Invested</label>
              <input
                type="number"
                step="0.01"
                value={newInvestment.amount}
                onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                placeholder="e.g. 10000"
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Return (%)</label>
              <input
                type="number"
                step="0.1"
                value={newInvestment.expectedReturn}
                onChange={(e) => setNewInvestment({...newInvestment, expectedReturn: e.target.value})}
                placeholder="e.g. 12"
                required
              />
            </div>
            <div className="form-group">
              <label>Investment Date</label>
              <input
                type="date"
                value={newInvestment.date}
                onChange={(e) => setNewInvestment({...newInvestment, date: e.target.value})}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Investment</button>
        </form>
      </div>

      {/* Investments Grid */}
      <h3 style={{marginBottom:'1.25rem', color:'var(--slate-dark)', fontWeight:700}}>
        Your Investments ({investments.length})
      </h3>
      <div className="investments-grid">
        {investments.length === 0 ? (
          <div className="rich-empty-state">
            <span className="empty-icon">📈</span>
            <h3>No Investments Tracked Yet</h3>
            <p>Start building your wealth by adding your first investment. Track SIPs, stocks, and mutual funds all in one place.</p>
            <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
              {['SIP 📈', 'Stocks 📊', 'Mutual Funds 🏦', 'FD 🔒'].map(t => (
                <span key={t} style={{background:'var(--gray-light)', padding:'0.5rem 1rem', borderRadius:'20px', fontSize:'0.9rem', color:'var(--slate-medium)'}}>{t}</span>
              ))}
            </div>
          </div>
        ) : (
          investments.map((investment) => {
            const cfg = TYPE_CONFIG[investment.type] || TYPE_CONFIG['Other'];
            return (
              <div key={investment._id} className="card investment-card">
                <div className="investment-header">
                  <span className="type-badge" style={{background: cfg.bg, color: cfg.color}}>
                    {cfg.icon} {investment.type}
                  </span>
                  <div style={{display:'flex', gap:'0.75rem'}}>
                    <button onClick={() => handleEdit(investment)} className="btn btn-secondary btn-sm" style={{padding:'0.4rem 0.8rem'}}>Edit</button>
                    <button onClick={() => handleDeleteInvestment(investment._id)} className="btn btn-danger btn-sm" style={{padding:'0.4rem 0.8rem'}}>Delete</button>
                  </div>
                </div>

                <h4 style={{margin:'0.75rem 0 1.25rem', color:'var(--slate-dark)', fontSize:'1.25rem'}}>{investment.name}</h4>
                
                <div className="investment-card-grid">
                  <div className="grid-item">
                    <span className="grid-label">Current Value</span>
                    <span className="grid-value" style={{color:'var(--primary-vibrant)'}}>
                      ₹{parseFloat(investment.currentValue !== undefined ? investment.currentValue : investment.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid-item">
                    <span className="grid-label">Invested</span>
                    <span className="grid-value">
                      ₹{parseFloat(investment.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid-item">
                    <span className="grid-label">Expected (%)</span>
                    <span className="grid-value">
                      <span className="target-badge">{investment.expectedReturn || 0}%</span>
                    </span>
                  </div>
                </div>

                {(() => {
                  const invested = parseFloat(investment.amount || 0);
                  const current = parseFloat(investment.currentValue !== undefined ? investment.currentValue : investment.amount);
                  const profit = current - invested;
                  const growth = invested > 0 ? (profit / invested) * 100 : 0;
                  const isPositive = profit >= 0;
                  
                  return (
                    <div className="investment-growth" style={{
                      background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      borderColor: isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      padding: '0.75rem 1rem'
                    }}>
                      <span style={{color: isPositive ? '#059669' : '#DC2626', fontWeight:800, fontSize:'1.1rem'}}>
                        {isPositive ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                      </span>
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <small style={{color: isPositive ? '#059669' : '#DC2626', fontWeight:700, fontSize:'0.85rem'}}>
                          ₹{Math.abs(profit).toLocaleString('en-IN')} {isPositive ? 'Gain' : 'Loss'}
                        </small>
                        <small style={{fontSize:'0.7rem', opacity:0.7, color: isPositive ? '#059669' : '#DC2626'}}>Actual Performance</small>
                      </div>
                    </div>
                  );
                })()}
                
                <div className="investment-footer">
                  <span style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
                    📅 {new Date(investment.date || investment.createdAt || Date.now()).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="edit-modal" style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div className="card" style={{width:'90%', maxWidth:'500px', padding:'2rem'}}>
            <h3 style={{marginBottom:'1.5rem'}}>✏️ Update Investment</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{marginBottom:'1rem'}}>
                <label>Investment Name</label>
                <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Current Value (₹)</label>
                  <input type="number" step="0.01" value={editData.currentValue} onChange={(e) => setEditData({...editData, currentValue: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Invested Amount (₹)</label>
                  <input type="number" step="0.01" value={editData.amount} onChange={(e) => setEditData({...editData, amount: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{marginBottom:'1.5rem'}}>
                <label>Expected Return (%)</label>
                <input type="number" step="0.1" value={editData.expectedReturn} onChange={(e) => setEditData({...editData, expectedReturn: e.target.value})} />
              </div>
              <div style={{display:'flex', gap:'1rem'}}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
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
        title="Delete Investment?"
        message="Are you sure you want to remove this investment from your portfolio? This will update your total net worth tracking."
      />
    </div>
  );
};

export default InvestmentDashboard;
