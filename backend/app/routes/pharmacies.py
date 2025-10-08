from flask import Blueprint, request, jsonify
from app.models import db, Pharmacy
import json
from sqlalchemy.exc import IntegrityError
import math

pharmacies_bp = Blueprint("pharmacies", __name__)

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points on the earth."""
    R = 6371  # Radius of Earth in kilometers

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance

@pharmacies_bp.route("/pharmacies", methods=["POST"])
def register_pharmacy():
    """Register a new pharmacy."""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    required_fields = ["name", "phone_number", "address", "latitude", "longitude"]
    for field in required_fields:
        if field not in data:
            return jsonify({"success": False, "message": f"{field} is required"}), 400

    try:
        new_pharmacy = Pharmacy(
            name=data["name"],
            contact_person=data.get("contact_person"),
            phone_number=data["phone_number"],
            email=data.get("email"),
            address=data["address"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            opening_hours=data.get("opening_hours"),
            services=json.dumps(data.get("services", [])),
            is_registered_by_pharmacy=data.get("is_registered_by_pharmacy", False)
        )
        db.session.add(new_pharmacy)
        db.session.commit()
        return jsonify({"success": True, "data": new_pharmacy.to_dict()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Pharmacy with this phone number or email already exists"
        }), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@pharmacies_bp.route("/pharmacies", methods=["GET"])
def get_all_pharmacies():
    """Get all pharmacies with pagination."""
    try:
        limit = request.args.get("limit", 10, type=int)
        offset = request.args.get("offset", 0, type=int)
        
        pharmacies = Pharmacy.query.offset(offset).limit(limit).all()
        total = Pharmacy.query.count()
        
        return jsonify({
            "success": True,
            "data": [p.to_dict() for p in pharmacies],
            "pagination": {
                "total": total,
                "offset": offset,
                "limit": limit
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@pharmacies_bp.route("/pharmacies/<pharmacy_id>", methods=["GET"])
def get_pharmacy_by_id(pharmacy_id):
    """Get a specific pharmacy by ID."""
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({"success": False, "message": "Pharmacy not found"}), 404
        return jsonify({"success": True, "data": pharmacy.to_dict()}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@pharmacies_bp.route("/pharmacies/<pharmacy_id>", methods=["PUT"])
def update_pharmacy(pharmacy_id):
    """Update a specific pharmacy."""
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({"success": False, "message": "Pharmacy not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Invalid JSON"}), 400

        for key, value in data.items():
            if hasattr(pharmacy, key):
                if key == "services":
                    setattr(pharmacy, key, json.dumps(value))
                else:
                    setattr(pharmacy, key, value)
        
        db.session.commit()
        return jsonify({"success": True, "data": pharmacy.to_dict()}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Another pharmacy with this phone number or email already exists"
        }), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@pharmacies_bp.route("/pharmacies/<pharmacy_id>", methods=["DELETE"])
def delete_pharmacy(pharmacy_id):
    """Delete a specific pharmacy."""
    try:
        pharmacy = Pharmacy.query.get(pharmacy_id)
        if not pharmacy:
            return jsonify({"success": False, "message": "Pharmacy not found"}), 404

        db.session.delete(pharmacy)
        db.session.commit()
        return jsonify({"success": True, "message": "Pharmacy deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@pharmacies_bp.route("/pharmacies/nearest", methods=["GET"])
def get_nearest_pharmacies():
    """Get nearest pharmacies within a specified radius."""
    try:
        user_lat = request.args.get("latitude", type=float)
        user_lon = request.args.get("longitude", type=float)
        radius = request.args.get("radius", 5, type=float)  # Default 5 km
        limit = request.args.get("limit", 10, type=int)

        if user_lat is None or user_lon is None:
            return jsonify({
                "success": False,
                "message": "Latitude and longitude are required"
            }), 400

        all_pharmacies = Pharmacy.query.all()
        pharmacies_with_distance = []

        for pharmacy in all_pharmacies:
            distance = haversine_distance(user_lat, user_lon, pharmacy.latitude, pharmacy.longitude)
            if distance <= radius:
                pharmacy_dict = pharmacy.to_dict()
                pharmacy_dict["distance_km"] = round(distance, 2)
                pharmacies_with_distance.append(pharmacy_dict)

        # Sort by distance
        pharmacies_with_distance.sort(key=lambda x: x["distance_km"])

        return jsonify({
            "success": True,
            "data": pharmacies_with_distance[:limit]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500