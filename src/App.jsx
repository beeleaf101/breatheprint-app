import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Witness from './pages/Witness';
import Map from './pages/Map';
import Profile from './pages/Profile';
import Weather from './pages/weather';
import NASAEarthData from './pages/NASAEarthData';

// Add this route with your other routes:

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/witness" element={<Witness />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/nasa-earth" element={<NASAEarthData />} />
        
      </Routes>
    </Router>
  );
}

export default App;