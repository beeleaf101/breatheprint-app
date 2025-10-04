import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import ARCamera from '../components/ar/ARCamera';
import { tempoService } from '../services/tempo';
import { apiService } from '../services/api';

const Witness = () => {
  const navigate = useNavigate();
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndData();
  }, []);

  const getLocationAndData = async () => {
    try {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });

          // Fetch air quality data
          const data = await tempoService.getCurrentAirQuality(latitude, longitude);
          setAirQualityData(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Please enable location services');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleCapture = async (imageBlob, aqData) => {
    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      // Save witness report
      const report = {
        image: base64Image,
        location: location,
        airQuality: aqData,
        description: '',
      };

      try {
        await apiService.saveWitnessReport(report);
        alert('Witness report saved! View it on the map.');
        navigate('/map');
      } catch (error) {
        console.error('Error saving report:', error);
        alert('Failed to save report');
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading camera and air quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* AR Camera */}
      <ARCamera 
        onCapture={handleCapture}
        airQualityData={airQualityData}
      />
    </div>
  );
};

export default Witness;