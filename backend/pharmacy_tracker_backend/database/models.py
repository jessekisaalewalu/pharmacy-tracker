from datetime import datetime
import uuid
import json
from .. import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class Medicine(db.Model):
    __tablename__ = 'medicines'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    quantity = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, nullable=False)
    expiry_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # 'purchase' or 'sale'
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicines.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    
    # Relationships
    medicine = db.relationship('Medicine', backref='transactions')
    supplier = db.relationship('Supplier', backref='transactions')

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
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Pharmacy {self.name}>'

    def to_dict(self):
        # Safely parse services stored as JSON string or return empty list
        services = []
        if self.services:
            try:
                services = json.loads(self.services)
            except (ValueError, TypeError):
                # fall back if already a Python structure stored as string
                services = self.services if isinstance(self.services, (list, dict)) else []

        # Safely format datetimes
        created = self.created_at.isoformat() if self.created_at else None
        updated = self.updated_at.isoformat() if self.updated_at else None

        return {
            'id': str(self.id),
            'name': self.name,
            'contact_person': self.contact_person,
            'phone_number': self.phone_number,
            'email': self.email,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'opening_hours': self.opening_hours,
            'services': services,
            'is_registered_by_pharmacy': self.is_registered_by_pharmacy,
            'created_at': created,
            'updated_at': updated
        }