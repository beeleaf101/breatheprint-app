from flask import Flask, jsonify, request
from flask_cors import CORS
from pipeline import run_demo
from aqi import aqi_pm25, category

app = Flask(__name__)
CORS(app)

@app.route('/api/forecast', methods=['GET'])
def forecast():
    lat = float(request.args.get('lat', 29.3759))
    lon = float(request.args.get('lon', 47.9774))
    
    try:
        result = run_demo(lat=lat, lon=lon)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/aqi-calculate', methods=['POST'])
def calculate_aqi():
    data = request.json
    pm25 = data.get('pm25')
    aqi = aqi_pm25(pm25)
    return jsonify({
        "aqi": aqi,
        "category": category(aqi)
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)