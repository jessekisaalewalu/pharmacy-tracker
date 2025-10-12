from pharmacy_tracker_backend import create_app
from waitress import serve
from flask import request, jsonify
import requests
from flask_cors import CORS

app = create_app()
CORS(app)  # Enable CORS for all routes

# RapidAPI credentials
RAPIDAPI_HOST = 'google-map-places-new-v2.p.rapidapi.com'
RAPIDAPI_KEY = 'b36b83498bmsh4ab43d3612416d7p1af516jsnee1311feb0e8'

# Google Maps API key (optional fallback)
GOOGLE_API_KEY = 'REPLACE_WITH_YOUR_ACTUAL_GOOGLE_MAPS_API_KEY'

# Proxy endpoint for Google Places API (pharmacies)
@app.route('/places')
def places():
    country = request.args.get('country', '')
    city = request.args.get('city', '')
    query = f'pharmacy in {city}, {country}' if city else f'pharmacy in {country}'
    url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={GOOGLE_API_KEY}'
    resp = requests.get(url)
    return jsonify(resp.json())

# Proxy endpoint for Google Directions API
@app.route('/directions')
def directions():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    url = f'https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&mode=driving&key={GOOGLE_API_KEY}'
    resp = requests.get(url)
    return jsonify(resp.json())

if __name__ == '__main__':
    print("Starting Waitress WSGI server on http://0.0.0.0:8000...")
    serve(app, host='0.0.0.0', port=8000, threads=4, channel_timeout=30)