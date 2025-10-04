// This will be your backend API service
// For now, we'll use localStorage for demo

export const apiService = {
  
  // Save witness report
  async saveWitnessReport(report) {
    const reports = this.getWitnessReports();
    const newReport = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...report,
    };
    reports.push(newReport);
    localStorage.setItem('witness_reports', JSON.stringify(reports));
    return newReport;
  },

  // Get all witness reports
  getWitnessReports() {
    const reports = localStorage.getItem('witness_reports');
    return reports ? JSON.parse(reports) : [];
  },

  // Get reports near location
  getReportsNearLocation(lat, lon, radiusKm = 10) {
    const reports = this.getWitnessReports();
    return reports.filter(report => {
      const distance = this.calculateDistance(
        lat, lon,
        report.location.lat,
        report.location.lon
      );
      return distance <= radiusKm;
    });
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  },

  // Save user profile
  saveUserProfile(profile) {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  },

  // Get user profile
  getUserProfile() {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  },
};