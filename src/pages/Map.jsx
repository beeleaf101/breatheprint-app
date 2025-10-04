import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, X, Camera, MapPin, TrendingUp } from 'lucide-react';
import CommunityMap from '../components/map/CommunityMap';
import { apiService } from '../services/api';

const Map = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const reports = apiService.getWitnessReports();

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const getAQILabel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    return 'bg-purple-900';
  };

  return (
    <div className="relative h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Community Witness Map</h1>
              <p className="text-white/60 text-sm">{reports.length} active reports</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/witness')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Camera className="w-5 h-5" />
              <span className="font-semibold">Add Report</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 transition-all backdrop-blur"
            >
              <Home className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {reports.length > 0 && (
        <div className="absolute top-20 left-4 z-40 bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{reports.length}</div>
              <div className="text-xs text-white/60">Reports</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(reports.reduce((sum, r) => sum + (r.airQuality?.aqi || 0), 0) / reports.length)}
              </div>
              <div className="text-xs text-white/60">Avg AQI</div>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      {reports.length === 0 ? (
        // Empty State
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          <div className="text-center text-white p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md">
            <div className="bg-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
              <MapPin className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">No Reports Yet</h2>
            <p className="text-white/70 mb-6">
              Be the first to document air pollution in your area! Use the AR camera to capture evidence.
            </p>
            <button
              onClick={() => navigate('/witness')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:scale-105 transition-all font-semibold flex items-center gap-2 mx-auto"
            >
              <Camera className="w-5 h-5" />
              Create First Report
            </button>
          </div>
        </div>
      ) : (
        <CommunityMap onReportClick={handleReportClick} />
      )}

      {/* Selected Report Panel */}
      {selectedReport && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[70vh] overflow-y-auto animate-fade-in-up">
          <div className="container mx-auto p-6">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Report Image */}
              {selectedReport.image && (
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={selectedReport.image}
                    alt="Pollution evidence"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur rounded-lg px-3 py-2 text-white text-sm font-semibold">
                    📸 Evidence Photo
                  </div>
                </div>
              )}

              {/* Report Details */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${getAQIColor(selectedReport.airQuality?.aqi || 0)} rounded-xl p-4`}>
                    <div className="text-4xl font-black">
                      {Math.round(selectedReport.airQuality?.aqi || 0)}
                    </div>
                    <div className="text-sm opacity-80">AQI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {getAQILabel(selectedReport.airQuality?.aqi || 0)}
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(selectedReport.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Data Source */}
                {selectedReport.airQuality?.dataSource && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                    <div className="text-sm text-blue-400 font-semibold">
                      {selectedReport.airQuality.isRealData ? '✅ Real-Time Data' : '⚠️ Simulated Data'}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {selectedReport.airQuality.dataSource}
                    </div>
                  </div>
                )}

                {/* Station Info */}
                {selectedReport.airQuality?.station && (
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="text-sm font-semibold mb-2">📍 Monitoring Station</div>
                    <div className="text-white/80 text-sm">
                      <div><strong>Name:</strong> {selectedReport.airQuality.station.name}</div>
                      <div><strong>Distance:</strong> {selectedReport.airQuality.station.distance}m away</div>
                      {selectedReport.airQuality.station.city && (
                        <div><strong>Location:</strong> {selectedReport.airQuality.station.city}, {selectedReport.airQuality.station.country}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pollutants Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedReport.airQuality?.pollutants && Object.entries(selectedReport.airQuality.pollutants).map(([name, data]) => (
                    data.available !== false && (
                      <div key={name} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-white/60 uppercase font-semibold mb-1">
                          {name.replace('pm', 'PM')}
                        </div>
                        <div className="text-xl font-bold">
                          {data.value.toFixed(1)}
                        </div>
                        <div className="text-xs text-white/60">
                          {data.unit}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Location */}
                <div className="mt-4 text-xs text-white/40">
                  📍 {selectedReport.location.lat.toFixed(6)}, {selectedReport.location.lon.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;