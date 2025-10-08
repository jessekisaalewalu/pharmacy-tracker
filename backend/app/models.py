from app import db
import uuid
from datetime import datetime
import json

class Pharmacy(db.Model):
    __tablename__ = 'pharmacies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(255))
    phone_number = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(255), unique=True)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    opening_hours = db.Column(db.String(255))
    services = db.Column(db.Text)  # Storing as JSON string
    is_registered_by_pharmacy = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_person': self.contact_person,
            'phone_number': self.phone_number,
            'email': self.email,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'opening_hours': self.opening_hours,
            'services': json.loads(self.services) if self.services else [],
            'is_registered_by_pharmacy': self.is_registered_by_pharmacy,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }