import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/friendService';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data.friends || []);
      setRequests(data.requests || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchFriends(); }, []);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await sendFriendRequest(email); setEmail(''); alert('Friend request sent!'); } catch (err) { alert(err.message || 'Failed to send request'); } finally { setLoading(false); }
  };
  const handleAccept = async (id) => { try { await acceptFriendRequest(id); fetchFriends(); } catch (err) { alert('Failed to accept'); } };
  const handleReject = async (id) => { try { await rejectFriendRequest(id); fetchFriends(); } catch (err) { alert('Failed to reject'); } };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Your Friends</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div className="card mb-4">
              <h3 className="card-title mb-3">Add a Friend</h3>
              <form onSubmit={handleSendRequest}><div className="form-group mb-2"><div className="flex-gap"><input type="email" className="input-field" style={{ flex: 1 }} placeholder="friend@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Request'}</button></div></div></form>
            </div>
            {requests.length > 0 && <div className="card mb-4"><h3 className="card-title mb-3 text-primary">Pending Requests</h3><div>{requests.map(req => <div key={req._id} className="list-item" style={{ border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '0.5rem' }}><div><strong>{req.name}</strong><div className="text-muted" style={{ fontSize: '0.85rem' }}>{req.email}</div></div><div className="flex-gap"><button onClick={() => handleAccept(req._id)} className="btn btn-accent" style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>Accept</button><button onClick={() => handleReject(req._id)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>X</button></div></div>)}</div></div>}
          </div>
          <div><div className="card"><h3 className="card-title mb-3">My Friends</h3>{friends.length === 0 ? <p className="text-muted">You haven't added any friends yet.</p> : <div>{friends.map(friend => <div key={friend._id} className="list-item"><div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{friend.name.charAt(0).toUpperCase()}</div><div><strong>{friend.name}</strong><div className="text-muted" style={{ fontSize: '0.85rem' }}>{friend.email}</div></div></div></div>)}</div>}</div></div>
        </div>
      </div>
    </>
  );
};

export default Friends;
