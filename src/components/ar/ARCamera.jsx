import React, { useRef, useEffect, useState } from 'react';
import { Camera, Loader, Wind, MapPin, X, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ARCamera = ({ onCapture, airQualityData }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = async () => {
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(video, 0, 0);
      drawOverlay(ctx, canvas.width, canvas.height);
      
      canvas.toBlob(blob => {
        if (onCapture) {
          onCapture(blob, airQualityData);
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.95);
    }
  };

  const drawOverlay = (ctx, width, height) => {
    if (!airQualityData) return;

    const { aqi, pollutants, areaName } = airQualityData;
    
    // Subtle gradient at bottom
    const gradient = ctx.createLinearGradient(0, height * 0.9, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Very subtle particles
    const particleCount = Math.floor((aqi / 500) * 8);
    const color = getAQIColor(aqi);

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 0.5 + 0.15;
      
      ctx.fillStyle = hexToRgba(color, 0.08);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Compact info panel
    const panelWidth = 280;
    const panelHeight = 110;
    const panelX = 20;
    const panelY = height - panelHeight - 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    roundRect(ctx, panelX, panelY, panelWidth, panelHeight, 12);
    ctx.fill();

    ctx.strokeStyle = getAQIColor(aqi);
    ctx.lineWidth = 2;
    roundRect(ctx, panelX, panelY, panelWidth, panelHeight, 12);
    ctx.stroke();

    // AQI number
    ctx.fillStyle = getAQIColor(aqi);
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`${Math.round(aqi)}`, panelX + 12, panelY + 38);

    // AQI label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(getAQILabel(aqi), panelX + 75, panelY + 28);

    // Area name
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px Arial';
    const areaText = areaName || 'Kuwait';
    ctx.fillText(areaText.substring(0, 20), panelX + 75, panelY + 43);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 12, panelY + 55);
    ctx.lineTo(panelX + panelWidth - 12, panelY + 55);
    ctx.stroke();

    // Top 3 pollutants
    ctx.font = 'bold 9px Arial';
    let xPos = panelX + 12;
    let count = 0;

    Object.entries(pollutants).forEach(([name, data]) => {
      if (data.available !== false && count < 3) {
        // Label
        ctx.fillStyle = '#888888';
        ctx.font = '8px Arial';
        ctx.fillText(name.toUpperCase(), xPos, panelY + 68);

        // Value
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Arial';
        ctx.fillText(`${data.value.toFixed(0)}`, xPos, panelY + 85);

        // Unit
        ctx.fillStyle = '#666666';
        ctx.font = '7px Arial';
        ctx.fillText(data.unit, xPos, panelY + 98);

        xPos += 88;
        count++;
      }
    });

    // Timestamp
    ctx.fillStyle = '#555555';
    ctx.font = '7px Arial';
    const timestamp = new Date().toLocaleString();
    ctx.fillText(timestamp, panelX + 12, panelY + panelHeight - 6);
  };

  const roundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#fbbf24';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    if (aqi <= 300) return '#991b1b';
    return '#581c87';
  };

  const getAQILabel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (!airQualityData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
          </motion.div>
          <p className="text-2xl font-bold text-white mb-2">Analyzing Air Quality</p>
          <p className="text-sm text-white/60">Fetching NASA TEMPO data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video - Full screen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Very subtle particles - reduced */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: getAQIColor(airQualityData.aqi),
              width: 0.4,
              height: 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.08,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start">
        {/* Info Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDetails(!showDetails)}
          className="bg-black/60 backdrop-blur-xl rounded-full p-3 border border-white/15 hover:bg-black/80 transition-all shadow-xl"
        >
          <Info className="w-5 h-5 text-white" />
        </motion.button>

        {/* Close Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="bg-black/60 backdrop-blur-xl rounded-full p-3 border border-white/15 hover:bg-black/80 transition-all shadow-xl"
        >
          <X className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Main Info Card - Simplified */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-20 left-4 right-4 z-40 flex justify-center pointer-events-none"
      >
        <div 
          className="bg-black/70 backdrop-blur-2xl rounded-2xl p-5 border-2 max-w-sm w-full shadow-2xl"
          style={{ borderColor: getAQIColor(airQualityData.aqi) }}
        >
          {/* AQI Display */}
          <div className="flex items-center gap-4 mb-3">
            <motion.div 
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl font-black"
              style={{ color: getAQIColor(airQualityData.aqi) }}
            >
              {Math.round(airQualityData.aqi)}
            </motion.div>
            <div>
              <div className="text-white font-black text-xl">{getAQILabel(airQualityData.aqi)}</div>
              <div className="text-xs text-white/40 uppercase tracking-wide">Air Quality Index</div>
            </div>
          </div>

          {/* Area Info */}
          <div className="mb-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-semibold text-sm">{airQualityData.areaName || 'Kuwait'}</span>
            </div>
            {airQualityData.areaType && (
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {airQualityData.areaType}
                </span>
                {airQualityData.conditions && (
                  <span className="bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {airQualityData.conditions.timeOfDay}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Health Message - Compact */}
          <div className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5">
            <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-xs leading-relaxed">
              {airQualityData.healthMessage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Details Panel - Slide from left */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 max-w-xs pointer-events-auto"
          >
            <div className="bg-black/85 backdrop-blur-2xl rounded-xl p-4 border border-white/15 shadow-2xl max-h-[70vh] overflow-y-auto">
              <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-400" />
                Live Measurements
              </h3>
              
              <div className="space-y-2.5">
                {Object.entries(airQualityData.pollutants).map(([name, data]) => (
                  data.available !== false && (
                    <div key={name} className="bg-white/5 rounded-lg p-2.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-white/50 uppercase font-bold">{name}</span>
                        <span className="text-xs text-white/30">{data.unit}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl font-black text-white">{data.value.toFixed(1)}</span>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                          data.level === 'good' ? 'bg-green-500/15 text-green-400' :
                          data.level === 'moderate' ? 'bg-yellow-500/15 text-yellow-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {data.level}
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Data Source */}
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40 flex items-center gap-1.5">
                <Wind className="w-3 h-3" />
                <span>{airQualityData.dataSource}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture Button */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={capturePhoto}
          disabled={isCapturing}
          className="relative bg-white rounded-full p-6 shadow-2xl disabled:opacity-50"
        >
          {isCapturing ? (
            <Loader className="w-10 h-10 text-gray-800 animate-spin" />
          ) : (
            <Camera className="w-10 h-10 text-gray-800" />
          )}
          
          {!isCapturing && (
            <motion.div
              className="absolute inset-0 rounded-full -z-10"
              style={{ backgroundColor: getAQIColor(airQualityData.aqi) }}
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* NASA Badge */}
      <div className="absolute bottom-4 right-4 z-40">
        <div className="bg-black/50 backdrop-blur-xl rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/10">
          <Wind className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-white/70 text-xs font-semibold">NASA TEMPO</span>
        </div>
      </div>
    </div>
  );
};

export default ARCamera;