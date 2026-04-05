import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTrips, createTrip, acceptTripInvitation, rejectTripInvitation } from '../services/tripService';
import { getFriends } from '../services/friendService';

function Dashboard() {
  const [activeTrips, setActiveTrips] = useState([]);
  const [pendingTrips, setPendingTrips] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [tripName, setTripName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const fetchTrips = async () => {
    try {
      const data = await getTrips();
      setActiveTrips(data.activeTrips || []);
      setPendingTrips(data.pendingTrips || []);
    } catch (e) { console.error(e); }
  };

  const fetchFriendsList = async () => {
    try {
      const data = await getFriends();
      setFriends(data.friends || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchTrips(); fetchFriendsList(); }, []);

  const handleToggleFriend = (id) => setSelectedFriends(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  const handleCreateTrip = async (e) => { e.preventDefault(); try { await createTrip({ name: tripName, members: selectedFriends }); setTripName(''); setSelectedFriends([]); setShowCreate(false); fetchTrips(); } catch (err) { alert('Failed to create trip'); } };
  const handleAcceptTrip = async (tripId) => { try { await acceptTripInvitation(tripId); fetchTrips(); } catch (err) { alert('Failed to accept trip'); } };
  const handleRejectTrip = async (tripId) => { try { await rejectTripInvitation(tripId); fetchTrips(); } catch (err) { alert('Failed to reject trip'); } };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {pendingTrips.length > 0 && <div className="card mb-4"><h3 className="card-title text-primary mb-3">Trip Invitations</h3>{pendingTrips.map(trip => <div key={trip._id} className="list-item"><div><h4 style={{ margin: 0 }}>{trip.name}</h4><p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Invited by {trip.createdBy?.name || 'Someone'}</p></div><div className="flex-gap"><button onClick={() => handleAcceptTrip(trip._id)} className="btn btn-accent" style={{ padding: '0.3rem 0.8rem' }}>Accept</button><button onClick={() => handleRejectTrip(trip._id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem' }}>Decline</button></div></div>)}</div>}
        <div className="flex-between mb-4"><h2>Your Trips</h2><button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>{showCreate ? 'Cancel' : '+ New Trip'}</button></div>
        {showCreate && <div className="card mb-4"><h3 className="card-title mb-3">Create a New Trip</h3><form onSubmit={handleCreateTrip}><div className="form-group"><label>Trip Name</label><input type="text" className="input-field" placeholder="e.g. Summer Vacation" value={tripName} onChange={(e) => setTripName(e.target.value)} required /></div><div className="form-group"><label>Who are you inviting?</label>{friends.length === 0 ? <p className="text-muted" style={{ fontSize: '0.9rem' }}>You don't have any friends yet. Add them in the Friends tab!</p> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>{friends.map(f => <label key={f._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}><input type="checkbox" checked={selectedFriends.includes(f._id)} onChange={() => handleToggleFriend(f._id)} /><span>{f.name}</span></label>)}</div>}</div><div className="flex-gap mt-3"><button type="submit" className="btn btn-primary">Save Trip</button></div></form></div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>{activeTrips.length === 0 ? <p className="text-muted">No active trips found. Create one to get started!</p> : activeTrips.map((trip) => <Link to={`/dashboard/trip/${trip._id}`} key={trip._id} style={{ textDecoration: 'none' }}><div className="card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><h3 className="card-title text-main" style={{ margin: 0 }}>{trip.name}</h3>{trip.status === 'completed' && <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--accent)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Completed</span>}</div><p className="text-muted mt-2 mb-1" style={{ fontSize: '0.9rem' }}>Members: {trip.members.length}</p>{trip.pendingMembers?.length > 0 && <p className="text-primary mb-1" style={{ fontSize: '0.8rem' }}>Pending Invites: {trip.pendingMembers.length}</p>}</div></Link>)}</div>
      </div>
    </>
  );
}

export default Dashboard;
