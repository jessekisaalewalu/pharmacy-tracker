#!/usr/bin/env python
"""
Seed the database with sample pharmacy records for testing.

This script will add pharmacies only when the DB contains fewer than
`target_count` pharmacies to avoid duplicating entries on repeated runs.

Run from the `backend` folder with PYTHONPATH set so `pharmacy_tracker_backend`
is importable, for example in PowerShell:

    $env:PYTHONPATH = "d:\PERSONAL PROJECTS\pharmacy-tracker\backend" ; python scripts/seed_pharmacies.py

"""
from pharmacy_tracker_backend import create_app, db
from pharmacy_tracker_backend.database.models import Pharmacy
import random
import json


def build_sample_pharmacies():
    # A list of sample base locations (name, lat, lng)
    bases = [
        ('Kigali Central', -1.9536, 29.8739),
        ('Nyarugenge', -1.95, 29.87),
        ('Gasabo', -1.96, 29.88),
        ('Kicukiro', -1.98, 30.05),
        ('Huye', -2.7566, 29.25),
        ('Gisenyi', -1.7, 29.26),
        ('Butare', -2.595, 29.74),
        ('Musanze', -1.5, 29.63),
        ('Kigali Airport', -1.9686, 30.1395),
        ('Kigali Heights', -1.944, 30.062)
    ]

    sample = []
    for i in range(1, 61):
        base = random.choice(bases)
        name = f"Sample Pharmacy {i}"
        # jitter coordinates modestly around base
        lat = base[1] + random.uniform(-0.02, 0.02)
        lng = base[2] + random.uniform(-0.03, 0.03)
        phone = f"+2507{random.randint(10000000,99999999)}"
        address = f"{base[0]} - Block {random.randint(1,50)}"
        services = ['Prescriptions', 'OTC', 'Vaccinations'] if random.random() > 0.6 else ['Prescriptions', 'OTC']
        sample.append({
            'name': name,
            'phone_number': phone,
            'address': address,
            'latitude': lat,
            'longitude': lng,
            'opening_hours': '8:00 AM - 9:00 PM',
            'services': services,
            'is_registered_by_pharmacy': True
        })

    return sample


def real_pharmacy_names():
    # Curated list of real-sounding pharmacy names for seeding/renaming
    return [
        'City Care Pharmacy', 'Green Cross Pharmacy', 'Royal Pharmacy', 'Family Pharmacy',
        'MediPlus Pharmacy', 'HealthFirst Pharmacy', 'CarePoint Pharmacy', 'Community Pharmacy',
        'TotalHealth Pharmacy', 'Pharmacie La Paix', 'Hope Pharmacy', 'Global Pharmacy',
        'Kigali Central Pharmacy', 'PharmaTrust', 'WellBeing Pharmacy', 'Central Health Pharmacy',
        'Goodlife Pharmacy', 'Evercare Pharmacy', 'GoodHealth Pharmacy', 'PrimeCare Pharmacy',
        'Medico Pharmacy', 'Trust Pharmacy', 'Alpha Pharmacy', 'Omega Pharmacy',
        'Sunrise Pharmacy', 'Starlight Pharmacy', 'Northside Pharmacy', 'Southside Pharmacy',
        'EastGate Pharmacy', 'WestEnd Pharmacy', 'Health Hub Pharmacy', 'MediServe Pharmacy',
        'Pulse Pharmacy', 'Vitality Pharmacy', 'Pharmacy Plus', 'RapidCare Pharmacy',
        'Lifeline Pharmacy', 'WellCare Pharmacy', 'HealthPoint Pharmacy', 'PharmCare Rwanda',
        'Neighborhood Pharmacy', 'Pharmacy One', 'Pharmacy 24/7', 'MedLink Pharmacy',
        'SafeMeds Pharmacy', 'CurePoint Pharmacy', 'TrustedMeds Pharmacy', 'Pharmacy Express',
        'CityPlus Pharmacy', 'Urban Health Pharmacy', 'Village Pharmacy', 'Central Drugs',
        'Greenleaf Pharmacy', 'Silverline Pharmacy', 'MedCentral Pharmacy', 'CareWell Pharmacy',
        'NewHope Pharmacy', 'BrightStar Pharmacy', 'Harmony Pharmacy', 'Bridge Pharmacy'
    ]


def seed(target_count=50):
    app = create_app()
    with app.app_context():
        count = Pharmacy.query.count()
        print(f'Current pharmacy count: {count}')
        # First, rename any placeholder 'Sample Pharmacy' entries to real names
        placeholder_pharmacies = Pharmacy.query.filter(Pharmacy.name.like('Sample Pharmacy%')).all()
        names = real_pharmacy_names()
        used_names = set(p.name for p in Pharmacy.query.with_entities(Pharmacy.name).all())

        # Remove already used names from the pool
        available_names = [n for n in names if n not in used_names]

        if placeholder_pharmacies:
            print(f'Renaming {len(placeholder_pharmacies)} placeholder pharmacies...')
            for ph in placeholder_pharmacies:
                if not available_names:
                    break
                new_name = available_names.pop(0)
                print(f"Renaming '{ph.name}' -> '{new_name}'")
                ph.name = new_name
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print('Error renaming placeholders:', e)

        # Refresh count and decide if we need to add more
        count = Pharmacy.query.count()
        if count >= target_count:
            print('No additional seeding needed.')
            return

        to_add = target_count - count
        print(f'Adding {to_add} sample pharmacies...')
        samples = build_sample_pharmacies()[:to_add]

        # Update available_names to include any remaining
        used_names = set(p.name for p in Pharmacy.query.with_entities(Pharmacy.name).all())
        available_names = [n for n in real_pharmacy_names() if n not in used_names]

        for s in samples:
            # Assign a real name if available, otherwise keep generated name
            assigned_name = s['name']
            if available_names:
                assigned_name = available_names.pop(0)
            # Avoid duplicates by phone number
            exists = Pharmacy.query.filter_by(phone_number=s['phone_number']).first()
            if exists:
                continue
            try:
                services_str = json.dumps(s['services']) if s.get('services') is not None else None
            except Exception:
                services_str = None

            p = Pharmacy(
                name=assigned_name,
                phone_number=s['phone_number'],
                address=s['address'],
                latitude=s['latitude'],
                longitude=s['longitude'],
                opening_hours=s['opening_hours'],
                services=services_str,
                is_registered_by_pharmacy=s['is_registered_by_pharmacy']
            )
            db.session.add(p)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print('Error committing seed data:', e)

        print('Seeding completed. New count:', Pharmacy.query.count())


if __name__ == '__main__':
    seed()
