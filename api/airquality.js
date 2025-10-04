// Vercel Serverless Function
import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat/lon parameters' });
  }

  try {
    // Fetch from OpenAQ server-side (no CORS issues)
    const response = await axios.get(
      `https://api.openaq.org/v3/locations?coordinates=${lat},${lon}&radius=50000&limit=10`,
      {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('OpenAQ Error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
}