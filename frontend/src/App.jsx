import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Login, Register } from './pages/AuthPages';
// Placeholder for future pages
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/booking/:showtimeId" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
