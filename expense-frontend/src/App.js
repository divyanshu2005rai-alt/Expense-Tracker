import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TripDetails from "./pages/TripDetails";
import Friends from "./pages/Friends";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/trip/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
        <Route path="/dashboard/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;