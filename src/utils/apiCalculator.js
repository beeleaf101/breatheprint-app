const PM25_BREAKPOINTS = [
  [0.0, 12.0, 0, 50],
  [12.1, 35.4, 51, 100],
  [35.5, 55.4, 101, 150],
  [55.5, 150.4, 151, 200],
  [150.5, 250.4, 201, 300],
  [250.5, 350.4, 301, 400],
  [350.5, 500.4, 401, 500],
];

function linearAQI(C, breakpoints) {
  for (const [Clow, Chigh, Ilow, Ihigh] of breakpoints) {
    if (C >= Clow && C <= Chigh) {
      return ((Ihigh - Ilow) / (Chigh - Clow)) * (C - Clow) + Ilow;
    }
  }
  return null;
}

export function calculatePM25AQI(pm25) {
  const aqi = linearAQI(pm25, PM25_BREAKPOINTS);
  return aqi ? Math.round(aqi) : null;
}

export function getAQICategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}