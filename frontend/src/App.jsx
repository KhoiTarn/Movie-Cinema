import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Login, Register } from './pages/AuthPages';
// Placeholder for future pages
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import ManageMovies from './pages/ManageMovies';
import ManageShowtimes from './pages/ManageShowtimes';
import ManageRooms from './pages/ManageRooms';
import FAQ from './pages/FAQ';
import Search from './pages/Search';
import AdminRoute from './components/AdminRoute';

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
        <Route path="/faq" element={<FAQ />} />
        <Route path="/search" element={<Search />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<ManageMovies />} />
          <Route path="/admin/showtimes" element={<ManageShowtimes />} />
          <Route path="/admin/rooms" element={<ManageRooms />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
