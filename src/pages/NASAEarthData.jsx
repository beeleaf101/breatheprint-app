import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Satellite, Wind, Cloud, Droplets, Sun, Activity, Globe, Layers } from 'lucide-react';

const NASAEarthData = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [activeLayers, setActiveLayers] = useState(['temperature']);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('north-america');

  const regions = {
    'north-america': { center: [40, -100], zoom: 4, name: 'North America' },
    'usa-east': { center: [37, -77], zoom: 5, name: 'USA East Coast' },
    'usa-west': { center: [37, -119], zoom: 5, name: 'USA West Coast' },
    'canada': { center: [56, -106], zoom: 4, name: 'Canada' },
    'mexico': { center: [23, -102], zoom: 5, name: 'Mexico' }
  };

  const layers = {
    temperature: {
      name: 'Surface Temperature',
      icon: Sun,
      color: 'orange',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/{time}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
      description: 'MODIS Terra Land Surface Temperature'
    },
    aerosol: {
      name: 'Aerosol/Dust',
      icon: Cloud,
      color: 'yellow',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_Aerosol/default/{time}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png',
      description: 'MODIS Aerosol Optical Depth'
    },
    precipitation: {
      name: 'Precipitation',
      icon: Droplets,
      color: 'blue',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/{time}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png',
      description: 'GPM IMERG Precipitation'
    },
    no2: {
      name: 'NO₂ (Air Quality)',
      icon: Activity,
      color: 'red',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/OMI_Nitrogen_Dioxide_Tropo_Column/default/{time}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png',
      description: 'Sentinel-5P NO₂ Tropospheric Column'
    },
    clouds: {
      name: 'Cloud Cover',
      icon: Cloud,
      color: 'gray',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png',
      description: 'MODIS True Color Imagery'
    }
  };

  useEffect(() => {
    initMap();
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const region = regions[selectedRegion];
      mapInstanceRef.current.setView(region.center, region.zoom);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateLayers(mapInstanceRef.current, activeLayers);
    }
  }, [activeLayers]);

  const initMap = () => {
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => createMap();
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    // Don't create map if it already exists
    if (mapInstanceRef.current || !mapRef.current || !window.L) {
      return;
    }

    const region = regions[selectedRegion];
    
    const mapInstance = window.L.map(mapRef.current, {
      center: region.center,
      zoom: region.zoom,
      zoomControl: true,
      attributionControl: false
    });

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance);

    mapInstanceRef.current = mapInstance;
    setLoading(false);

    updateLayers(mapInstance, ['temperature']);
  };

  const updateLayers = (mapInstance, layerKeys) => {
    if (!mapInstance) return;

    mapInstance.eachLayer((layer) => {
      if (layer.options && layer.options.isOverlay) {
        mapInstance.removeLayer(layer);
      }
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const timeStr = yesterday.toISOString().split('T')[0];

    layerKeys.forEach(key => {
      const layer = layers[key];
      if (layer && window.L) {
        const url = layer.url.replace('{time}', timeStr);
        window.L.tileLayer(url, {
          maxZoom: 9,
          opacity: 0.7,
          isOverlay: true
        }).addTo(mapInstance);
      }
    });
  };

  const toggleLayer = (layerKey) => {
    const newLayers = activeLayers.includes(layerKey)
      ? activeLayers.filter(k => k !== layerKey)
      : [...activeLayers, layerKey];
    
    setActiveLayers(newLayers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              
              <div className="flex items-center gap-2">
                <Satellite className="w-6 h-6 text-emerald-400" />
                <h1 className="text-white text-2xl font-bold">NASA Earth Data</h1>
              </div>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white/10 backdrop-blur-xl text-white px-4 py-2 rounded-lg border border-white/20 focus:border-white/40 outline-none"
            >
              {Object.entries(regions).map(([key, region]) => (
                <option key={key} value={key} className="bg-slate-900">{region.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h2 className="text-white font-bold">Real-Time Satellite Data</h2>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Live NASA satellite imagery showing environmental conditions across North America. Data updates daily.
              </p>
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
                <div className="text-emerald-400 text-xs font-semibold mb-1">Data Sources:</div>
                <div className="text-white/60 text-xs space-y-1">
                  <div>• MODIS Terra/Aqua</div>
                  <div>• Sentinel-5P</div>
                  <div>• GPM IMERG</div>
                  <div>• NASA GIBS</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-blue-400" />
                <h2 className="text-white font-bold">Map Layers</h2>
              </div>
              
              <div className="space-y-3">
                {Object.entries(layers).map(([key, layer]) => {
                  const Icon = layer.icon;
                  const isActive = activeLayers.includes(key);
                  
                  return (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isActive 
                          ? 'bg-white/10 border-white/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                          <span className={`font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}>
                            {layer.name}
                          </span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          isActive ? 'bg-emerald-400' : 'bg-white/20'
                        }`}></div>
                      </div>
                      <p className="text-white/50 text-xs">{layer.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-3 text-sm">How to Use</h3>
              <div className="space-y-2 text-xs text-white/70">
                <div>• Click layer buttons to toggle visibility</div>
                <div>• Multiple layers can be active</div>
                <div>• Zoom and pan to explore regions</div>
                <div>• Data updates daily from NASA</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <div className="text-white text-xl">Loading NASA satellite data...</div>
                </div>
              )}
              
              <div 
                ref={mapRef} 
                className="w-full h-[calc(100vh-200px)] min-h-[600px]"
                style={{ background: '#0f172a' }}
              />
              
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl rounded-lg p-3 border border-white/20 z-[1000]">
                <div className="text-white/90 text-xs">
                  <div className="font-semibold mb-1">Active Layers:</div>
                  {activeLayers.length === 0 ? (
                    <div className="text-white/60">No layers selected</div>
                  ) : (
                    activeLayers.map(key => (
                      <div key={key} className="text-white/70">• {layers[key].name}</div>
                    ))
                  )}
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xl rounded-lg p-2 border border-white/20 text-xs text-white/60 z-[1000]">
                NASA GIBS | MODIS | Sentinel-5P
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NASAEarthData;