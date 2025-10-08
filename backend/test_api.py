import requests
import json
import uuid

BASE_URL = 'http://127.0.0.1:5000/api/v1'

def test_create_pharmacy():
    data = {
        "name": "City Pharmacy",
        "contact_person": "John Doe",
        "phone_number": "+256700123456",
        "email": "city@pharmacy.com",
        "address": "123 Main St, Kampala",
        "latitude": 0.3476,
        "longitude": 32.5825,
        "opening_hours": "Mon-Fri: 8am-8pm",
        "services": ["Prescription", "OTC Medicines", "Consultations"]
    }
    
    response = requests.post(f'{BASE_URL}/pharmacies', json=data)
    print("\n=== Create Pharmacy ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json().get('data', {}).get('id')

def test_get_all_pharmacies():
    response = requests.get(f'{BASE_URL}/pharmacies')
    print("\n=== Get All Pharmacies ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_get_pharmacy(pharmacy_id):
    response = requests.get(f'{BASE_URL}/pharmacies/{pharmacy_id}')
    print("\n=== Get Single Pharmacy ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_update_pharmacy(pharmacy_id):
    data = {
        "name": "City Pharmacy Updated",
        "opening_hours": "Mon-Sun: 24/7",
        "services": ["Prescription", "OTC Medicines", "Consultations", "24/7 Service"]
    }
    
    response = requests.put(f'{BASE_URL}/pharmacies/{pharmacy_id}', json=data)
    print("\n=== Update Pharmacy ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_delete_pharmacy(pharmacy_id):
    response = requests.delete(f'{BASE_URL}/pharmacies/{pharmacy_id}')
    print("\n=== Delete Pharmacy ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == '__main__':
    # Run all tests
    pharmacy_id = test_create_pharmacy()
    test_get_all_pharmacies()
    
    if pharmacy_id:
        test_get_pharmacy(pharmacy_id)
        test_update_pharmacy(pharmacy_id)
        test_delete_pharmacy(pharmacy_id)