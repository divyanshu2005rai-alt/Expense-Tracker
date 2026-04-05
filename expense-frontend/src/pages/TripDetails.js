import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddExpenseModal from '../components/AddExpenseModal';
import { getTripActivity, endTrip, deleteTrip as deleteTripService } from '../services/tripService';
import { getTripSummary } from '../services/expenseService';

const TripDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activityData, summaryData] = await Promise.all([getTripActivity(id), getTripSummary(id)]);
      setActivity(activityData);
      setSummary(summaryData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <div className="page-center"><h3>Loading trip details...</h3></div>;
  const isCompleted = summary?.status === 'completed';

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="flex-between mb-4">
          <h2>Trip Details</h2>
          <div className="flex-gap">
            {!isCompleted && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Expense</button>}
            <button className="btn btn-secondary" onClick={async () => { if (window.confirm('Delete this trip?')) { await deleteTripService(id); navigate('/dashboard'); } }}>Delete Trip</button>
            {!isCompleted && <button className="btn btn-secondary" onClick={async () => { if (window.confirm('End this trip?')) { await endTrip(id); fetchData(); setShowSummaryModal(true); } }}>End Trip</button>}
          </div>
        </div>
      </div>
      {showModal && !isCompleted && <AddExpenseModal tripId={id} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchData(); }} />}
      {showSummaryModal && <div className="modal-overlay"><div className="modal-content"><button onClick={() => setShowSummaryModal(false)}>Close</button><pre>{JSON.stringify(summary, null, 2)}</pre></div></div>}
    </>
  );
};

export default TripDetails;