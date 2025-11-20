from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import logging
import traceback

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='../../app', static_url_path='')
    
    # Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    
    # Use SQLite for simplicity (can switch to PostgreSQL later)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, '..', 'app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Basic logging
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    
    # Register blueprints
    from pharmacy_tracker_backend.routes.pharmacies import pharmacies_bp
    app.register_blueprint(pharmacies_bp, url_prefix='/api')
    
    # Health check route
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({
            'success': True,
            'message': 'Pharmacy Tracker Backend is running',
            'status': 'operational'
        }), 200
    
    # Root route - serve index.html
    @app.route('/')
    def index():
        return send_from_directory(app.static_folder, 'index.html')
    
    # Fallback for SPA - redirect all unmapped routes to index.html
    @app.route('/<path:path>')
    def catch_all(path):
        if path.startswith('api'):
            return jsonify({'success': False, 'message': 'API route not found'}), 404
        return send_from_directory(app.static_folder, 'index.html')
    
    # Create tables
    with app.app_context():
        db.create_all()

    # Global error handler to return JSON on unhandled exceptions
    @app.errorhandler(Exception)
    def handle_exception(e):
        # Log traceback
        tb = traceback.format_exc()
        app.logger.error('Unhandled exception: %s\n%s', e, tb)
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    
    return app