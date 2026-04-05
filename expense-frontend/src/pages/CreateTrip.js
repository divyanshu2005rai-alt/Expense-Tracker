import { useState } from 'react';

function CreateTrip() {
  const [name, setName] = useState('');

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, members: [] })
    });
    const data = await res.json();
    console.log('Trip created:', data);
    alert('Trip Created');
  };

  return (
    <div style={{ padding: '50px' }}>
      <h2>Create Trip</h2>
      <form onSubmit={handleCreateTrip}>
        <input type="text" placeholder="Trip Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br /><br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateTrip;
