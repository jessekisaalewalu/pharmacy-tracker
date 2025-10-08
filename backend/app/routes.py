from flask import Blueprint, request, jsonify
from app.models import Pharmacy, db
from sqlalchemy.exc import IntegrityError
import json

api_bp = Blueprint('api', __name__)

@api_bp.route('/pharmacies', methods=['GET'])
def get_pharmacies():
    try:
        pharmacies = Pharmacy.query.all()
        return jsonify({
            'success': True,
            'data': [pharmacy.to_dict() for pharmacy in pharmacies]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@api_bp.route('/pharmacies/<pharmacy_id>', methods=['GET'])
def get_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get_or_404(pharmacy_id)
        return jsonify({
            'success': True,
            'data': pharmacy.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@api_bp.route('/pharmacies', methods=['POST'])
def create_pharmacy():
    try:
        data = request.get_json()
        
        if 'services' in data and isinstance(data['services'], list):
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

@api_bp.route('/pharmacies/<pharmacy_id>', methods=['PUT'])
def update_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get_or_404(pharmacy_id)
        data = request.get_json()
        
        if 'services' in data and isinstance(data['services'], list):
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

@api_bp.route('/pharmacies/<pharmacy_id>', methods=['DELETE'])
def delete_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get_or_404(pharmacy_id)
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