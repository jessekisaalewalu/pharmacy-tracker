from flask import Blueprint, request, jsonify
from pharmacy_tracker_backend import db
from pharmacy_tracker_backend.database.models import Pharmacy
from sqlalchemy.exc import IntegrityError
import json

pharmacies_bp = Blueprint('pharmacies', __name__)

@pharmacies_bp.route('/pharmacies', methods=['GET'])
def get_pharmacies():
    try:
        # Add query parameters for filtering
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        search = request.args.get('search', '')

        query = Pharmacy.query

        if search:
            query = query.filter(Pharmacy.name.ilike(f'%{search}%'))

        # If coordinates are provided, we could add distance-based filtering here
        # This is a simple implementation; you might want to add proper geospatial queries

        pharmacies = query.all()
        return jsonify({
            'success': True,
            'data': [pharmacy.to_dict() for pharmacy in pharmacies]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@pharmacies_bp.route('/pharmacies/<pharmacy_id>', methods=['GET'])
def get_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({
                'success': False,
                'message': 'Pharmacy not found'
            }), 404
        return jsonify({
            'success': True,
            'data': pharmacy.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@pharmacies_bp.route('/pharmacies', methods=['POST'])
def create_pharmacy():
    try:
        data = request.get_json()
        
        # Convert services list to JSON string if provided
        if 'services' in data:
            data['services'] = json.dumps(data['services'])
        
        new_pharmacy = Pharmacy(**data)
        db.session.add(new_pharmacy)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': new_pharmacy.to_dict(),
            'message': 'Pharmacy created successfully'
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'A pharmacy with this phone number or email already exists'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@pharmacies_bp.route('/pharmacies/<pharmacy_id>', methods=['PUT'])
def update_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({
                'success': False,
                'message': 'Pharmacy not found'
            }), 404

        data = request.get_json()
        
        # Convert services list to JSON string if provided
        if 'services' in data:
            data['services'] = json.dumps(data['services'])
        
        for key, value in data.items():
            setattr(pharmacy, key, value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': pharmacy.to_dict(),
            'message': 'Pharmacy updated successfully'
        }), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'A pharmacy with this phone number or email already exists'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@pharmacies_bp.route('/pharmacies/<pharmacy_id>', methods=['DELETE'])
def delete_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({
                'success': False,
                'message': 'Pharmacy not found'
            }), 404

        db.session.delete(pharmacy)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pharmacy deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500