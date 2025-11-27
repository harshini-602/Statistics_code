import React from 'react';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import LandingPage from './pages/LandingPage';
import AllPosts from './pages/AllPosts';
import CreateEditPost from './pages/CreateEditPost';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SinglePost from './pages/SinglePost';
import Manage from './pages/Manage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import PostAnalytics from './pages/PostAnalytics';
import Contact from './pages/Contact';
import PrivateRoute from './components/PrivateRoute';


// In your Routes section:

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/posts" element={<AllPosts />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/create-post" element={<PrivateRoute><CreateEditPost /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><CreateEditPost /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/posts/:postId/analytics" element={<PostAnalytics />} />
            <Route path="/users/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/manage" element={<PrivateRoute><Manage /></PrivateRoute>} />
                        <Route path="/posts/:postId/analytics" element={<PrivateRoute><PostAnalytics /></PrivateRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
