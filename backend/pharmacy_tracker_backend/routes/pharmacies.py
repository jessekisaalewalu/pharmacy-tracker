from flask import Blueprint, request, jsonify  # type: ignore
from pharmacy_tracker_backend import db
from pharmacy_tracker_backend.database.models import Pharmacy
try:
    from sqlalchemy.exc import IntegrityError  # type: ignore
except Exception:  # pragma: no cover
    # Fallback for environments where SQLAlchemy isn't installed (e.g., static analysis)
    class IntegrityError(Exception):
        pass
import json

pharmacies_bp = Blueprint('pharmacies', __name__)


@pharmacies_bp.route('/pharmacies', methods=['GET'])
def get_pharmacies():
    try:
        # Query params
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        search = request.args.get('search', type=str)

        query = Pharmacy.query

        if search:
            query = query.filter(Pharmacy.name.ilike(f'%{search}%'))

        pharmacies = query.all()

        # Optionally, compute distances if coordinates provided
        data = [p.to_dict() for p in pharmacies]

        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

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
        data = request.get_json() or {}

        # Basic validation
        name = data.get('name')
        phone = data.get('phone_number') or data.get('phone')
        address = data.get('address')

        if not name or not phone or not address:
            return jsonify({'success': False, 'message': 'name, phone_number and address are required'}), 400

        # Ensure services are stored as JSON string
        services = data.get('services')
        if services is not None:
            try:
                services_str = json.dumps(services) if not isinstance(services, str) else services
            except Exception:
                services_str = '[]'
        else:
            services_str = None

        new_pharmacy = Pharmacy(
            name=name,
            contact_person=data.get('contact_person'),
            phone_number=phone,
            email=data.get('email'),
            address=address,
            latitude=data.get('latitude') or 0.0,
            longitude=data.get('longitude') or 0.0,
            opening_hours=data.get('opening_hours'),
            services=services_str,
            is_registered_by_pharmacy=bool(data.get('is_registered_by_pharmacy', False))
        )

        db.session.add(new_pharmacy)
        db.session.commit()

        return jsonify({'success': True, 'data': new_pharmacy.to_dict(), 'message': 'Pharmacy created successfully'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'A pharmacy with this phone number or email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@pharmacies_bp.route('/pharmacies/<pharmacy_id>', methods=['PUT'])
def update_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({'success': False, 'message': 'Pharmacy not found'}), 404

        data = request.get_json() or {}

        # Normalize services
        if 'services' in data:
            try:
                services_str = json.dumps(data['services']) if not isinstance(data['services'], str) else data['services']
                data['services'] = services_str
            except Exception:
                data['services'] = None

        # Only set allowed fields
        allowed = {'name', 'contact_person', 'phone_number', 'email', 'address', 'latitude', 'longitude', 'opening_hours', 'services', 'is_registered_by_pharmacy'}
        for key, value in data.items():
            if key in allowed:
                setattr(pharmacy, key, value)

        db.session.commit()

        return jsonify({'success': True, 'data': pharmacy.to_dict(), 'message': 'Pharmacy updated successfully'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'A pharmacy with this phone number or email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@pharmacies_bp.route('/pharmacies/<pharmacy_id>', methods=['DELETE'])
def delete_pharmacy(pharmacy_id):
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({'success': False, 'message': 'Pharmacy not found'}), 404

        db.session.delete(pharmacy)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Pharmacy deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500