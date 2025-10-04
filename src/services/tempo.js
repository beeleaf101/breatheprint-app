import { fetchTempoMeasurements } from './nasaTempo';

// North American regions with detailed characteristics
const northAmericaRegions = {
  // United States - Major Cities
  'New York City': { lat: 40.7128, lon: -74.0060, type: 'urban', traffic: 'high', country: 'USA' },
  'Los Angeles': { lat: 34.0522, lon: -118.2437, type: 'urban', traffic: 'high', country: 'USA' },
  'Chicago': { lat: 41.8781, lon: -87.6298, type: 'urban', traffic: 'high', country: 'USA' },
  'Houston': { lat: 29.7604, lon: -95.3698, type: 'urban', traffic: 'high', country: 'USA' },
  'Phoenix': { lat: 33.4484, lon: -112.0740, type: 'desert', traffic: 'medium', country: 'USA' },
  'Philadelphia': { lat: 39.9526, lon: -75.1652, type: 'urban', traffic: 'high', country: 'USA' },
  'San Antonio': { lat: 29.4241, lon: -98.4936, type: 'urban', traffic: 'medium', country: 'USA' },
  'San Diego': { lat: 32.7157, lon: -117.1611, type: 'coastal', traffic: 'medium', country: 'USA' },
  'Dallas': { lat: 32.7767, lon: -96.7970, type: 'urban', traffic: 'high', country: 'USA' },
  'San Jose': { lat: 37.3382, lon: -121.8863, type: 'urban', traffic: 'high', country: 'USA' },
  
  // Canada - Major Cities
  'Toronto': { lat: 43.6532, lon: -79.3832, type: 'urban', traffic: 'high', country: 'Canada' },
  'Montreal': { lat: 45.5017, lon: -73.5673, type: 'urban', traffic: 'high', country: 'Canada' },
  'Vancouver': { lat: 49.2827, lon: -123.1207, type: 'coastal', traffic: 'medium', country: 'Canada' },
  'Calgary': { lat: 51.0447, lon: -114.0719, type: 'urban', traffic: 'medium', country: 'Canada' },
  'Ottawa': { lat: 45.4215, lon: -75.6972, type: 'urban', traffic: 'medium', country: 'Canada' },
  
  // Mexico - Major Cities
  'Mexico City': { lat: 19.4326, lon: -99.1332, type: 'urban', traffic: 'high', country: 'Mexico' },
  'Guadalajara': { lat: 20.6597, lon: -103.3496, type: 'urban', traffic: 'high', country: 'Mexico' },
  'Monterrey': { lat: 25.6866, lon: -100.3161, type: 'urban', traffic: 'high', country: 'Mexico' },
  'Tijuana': { lat: 32.5149, lon: -117.0382, type: 'urban', traffic: 'high', country: 'Mexico' }
};

const getClosestRegion = (lat, lon) => {
  // Check if coordinates are in North America
  // Latitude: roughly 15°N to 70°N
  // Longitude: roughly -170°W to -50°W
  if (lat < 15 || lat > 70 || lon < -170 || lon > -50) {
    console.warn('⚠️ Location outside North America detected. Using default location.');
    // Default to New York City if location is outside North America
    return { 
      name: 'New York City', 
      lat: 40.7128, 
      lon: -74.0060, 
      type: 'urban', 
      traffic: 'high',
      country: 'USA',
      isDefault: true
    };
  }

  let closest = null;
  let minDistance = Infinity;

  // Find closest North American city
  for (const [name, region] of Object.entries(northAmericaRegions)) {
    const distance = Math.sqrt(
      Math.pow(lat - region.lat, 2) + Math.pow(lon - region.lon, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = { name, ...region };
    }
  }

  return closest || { 
    name: 'New York City', 
    type: 'urban', 
    traffic: 'medium',
    country: 'USA',
    lat: 40.7128,
    lon: -74.0060
  };
};

const getHealthMessage = (aqi, areaType) => {
  if (aqi <= 50) {
    return 'Air quality is good. Perfect for outdoor activities!';
  } else if (aqi <= 100) {
    return 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.';
  } else if (aqi <= 150) {
    return 'Unhealthy for sensitive groups. Children, elderly, and people with respiratory conditions should reduce outdoor activities.';
  } else if (aqi <= 200) {
    return 'Unhealthy air quality. Everyone should reduce prolonged outdoor exertion. Sensitive groups should avoid outdoor activities.';
  } else if (aqi <= 300) {
    return 'Very unhealthy. Everyone should avoid prolonged outdoor exertion. Stay indoors if possible.';
  } else {
    return 'Hazardous conditions. Everyone should avoid all outdoor activities. Use air purifiers indoors.';
  }
};

export const tempoService = {
  getCurrentAirQuality: async (latitude, longitude) => {
    console.log('🛰️ Fetching NASA TEMPO satellite data for North America...');
    console.log('📍 Coordinates:', latitude, longitude);

    try {
      // Get region information
      const region = getClosestRegion(latitude, longitude);
      
      if (region.isDefault) {
        console.log('📍 Location outside North America - Using default: New York City');
        console.log('💡 TIP: For accurate North American data, use coordinates within USA, Canada, or Mexico');
        // Use the default region's coordinates for data fetching
        latitude = region.lat;
        longitude = region.lon;
      } else {
        console.log(`📍 Location: ${region.name}, ${region.country}`);
      }

      // Fetch TEMPO measurements
      const tempoData = await fetchTempoMeasurements(latitude, longitude);

      // Enhance with region-specific data
      const enhancedData = {
        ...tempoData,
        areaName: region.name,
        areaType: region.type,
        country: region.country,
        healthMessage: getHealthMessage(tempoData.aqi, region.type),
        location: { lat: latitude, lon: longitude },
        isDefaultLocation: region.isDefault || false
      };

      console.log('✅ NASA TEMPO Data Retrieved Successfully');
      console.log(`   Location: ${enhancedData.areaName}, ${enhancedData.country}`);
      console.log(`   AQI: ${enhancedData.aqi} (${getAQICategory(enhancedData.aqi)})`);
      console.log(`   Source: ${enhancedData.dataSource}`);
      console.log(`   Confidence: ${Math.round((enhancedData.confidence || 0.88) * 100)}%`);

      return enhancedData;

    } catch (error) {
      console.error('Error fetching TEMPO data:', error);
      
      // Fallback data for North America
      return {
        aqi: 75,
        pollutants: {
          no2: { value: 30, unit: 'ppb', level: 'moderate', available: true },
          o3: { value: 45, unit: 'ppb', level: 'good', available: true },
          pm25: { value: 25, unit: 'μg/m³', level: 'moderate', available: true },
          pm10: { value: 50, unit: 'μg/m³', level: 'moderate', available: true },
          so2: { value: 10, unit: 'ppb', level: 'good', available: true },
          co: { value: 0.5, unit: 'ppm', level: 'good', available: true }
        },
        dataSource: 'NASA TEMPO Satellite Network (Fallback)',
        isRealData: false,
        areaName: 'North America',
        areaType: 'urban',
        country: 'USA',
        healthMessage: getHealthMessage(75, 'urban'),
        location: { lat: latitude, lon: longitude },
        confidence: 0.75
      };
    }
  },

  // Helper method to manually set a North American location
  getAirQualityForCity: async (cityName) => {
    const city = northAmericaRegions[cityName];
    if (!city) {
      throw new Error(`City ${cityName} not found in North America database`);
    }
    return tempoService.getCurrentAirQuality(city.lat, city.lon);
  },

  // Get list of available cities
  getAvailableCities: () => {
    return Object.keys(northAmericaRegions);
  }
};

const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export default tempoService;