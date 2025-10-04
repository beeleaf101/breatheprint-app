import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Your BreathePrint</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-white rounded-full p-2 hover:bg-gray-200"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">Welcome, Environmental Witness</h2>
            <p className="text-gray-400 mt-2">Track your impact and air quality exposure</p>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
            <p className="text-xl text-gray-400 mb-4">Personal BreathePrint Profile</p>
            <p className="text-gray-500">
              Your lifetime pollution exposure tracking coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;