import React, { useState, useEffect } from 'react';
import { addExpense } from '../services/expenseService';
import { getTrips } from '../services/tripService';

const AddExpenseModal = ({ tripId, onClose, onSuccess }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    const fetchTripMembers = async () => {
      try {
        const trips = await getTrips();
        const trip = trips.find(t => t._id === tripId);
        if (trip) {
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTripMembers();
  }, [tripId]);

  useEffect(() => {
    import('../services/friendService').then(({ getFriends }) => {
      getFriends().then(data => {
        setMembers(data.friends || []);
      });
    });
  }, []);

  const handleToggleFriend = (friendId) => {
    setSelectedFriends(prev => prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    setLoading(true);
    try {
      const payload = {
        tripId,
        amount: Number(amount),
        description,
        category: 'General',
        splitType: 'EQUAL',
        splitBetween: selectedFriends
      };
      await addExpense(payload);
      onSuccess();
    } catch (err) {
      alert('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Description</label>
            <input type="text" className="input-field" placeholder="e.g. Dinner at Luigi's" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label>Total Amount Paid By You (Rs)</label>
            <input type="number" className="input-field" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
          </div>
          <div className="form-group mb-4">
            <label>Split Equally With (Select Friends)</label>
            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>
              {members.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>No friends found.</p>
              ) : (
                members.map(f => (
                  <label key={f._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedFriends.includes(f._id)} onChange={() => handleToggleFriend(f._id)} />
                    <span style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{f.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Adding...' : 'Save Expense'}</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
