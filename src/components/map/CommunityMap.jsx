import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from '../../services/api';
import { MapPin } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map centering
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 10);
    }
  }, [center, map]);
  
  return null;
}

const CommunityMap = ({ onReportClick }) => {
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Center of USA

  useEffect(() => {
    loadReports();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.log('Could not get location:', error);
        }
      );
    }
  };

  const loadReports = () => {
    const witnessReports = apiService.getWitnessReports();
    setReports(witnessReports);
    
    // If there are reports, center on the first one
    if (witnessReports.length > 0) {
      const firstReport = witnessReports[0];
      setMapCenter([firstReport.location.lat, firstReport.location.lon]);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#fbbf24';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    return '#991b1b';
  };

  const createCustomIcon = (aqi) => {
    const color = getAQIColor(aqi);
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
          <text x="20" y="26" font-size="14" font-weight="bold" text-anchor="middle" fill="white">${Math.round(aqi)}</text>
        </svg>
      `)}`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapUpdater center={mapCenter} />
        
        {/* Free OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <div className="font-bold text-blue-600">Your Location</div>
                <div className="text-sm text-gray-600">📍</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Witness Report Markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lon]}
            icon={createCustomIcon(report.airQuality?.aqi || 50)}
            eventHandlers={{
              click: () => {
                if (onReportClick) {
                  onReportClick(report);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="font-bold text-lg mb-2">
                  AQI: {Math.round(report.airQuality?.aqi || 0)}
                </div>
                
                {report.image && (
                  <img
                    src={report.image}
                    alt="Pollution evidence"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                
                <div className="text-sm text-gray-600 mb-2">
                  {new Date(report.timestamp).toLocaleString()}
                </div>
                
                {report.airQuality?.pollutants && (
                  <div className="text-xs space-y-1">
                    {Object.entries(report.airQuality.pollutants).map(([name, data]) => (
                      data.available !== false && (
                        <div key={name}>
                          <strong>{name.toUpperCase()}:</strong> {data.value.toFixed(1)} {data.unit}
                        </div>
                      )
                    ))}
                  </div>
                )}
                
                {report.airQuality?.dataSource && (
                  <div className="text-xs text-gray-500 mt-2 italic">
                    {report.airQuality.dataSource}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CommunityMap;