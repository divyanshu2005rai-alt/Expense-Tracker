import { useEffect, useState } from "react";

function Trips() {
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/trips", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTrips(data);
  };

  useEffect(() => { fetchTrips(); }, []);

  return (
    <div style={{ padding: "50px" }}>
      <h2>Your Trips</h2>
      {trips.map((trip) => (
        <div key={trip._id}><p>{trip.name}</p></div>
      ))}
    </div>
  );
}

export default Trips;