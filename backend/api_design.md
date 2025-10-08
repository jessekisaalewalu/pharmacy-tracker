# Pharmacy Tracker API Design

This document outlines the RESTful API endpoints for the pharmacy tracking application.

## Base URL
`/api/v1`

## Authentication
(To be implemented later, e.g., JWT for secure access)

## Endpoints

### 1. Register a new pharmacy
- **Endpoint:** `/pharmacies`
- **Method:** `POST`
- **Description:** Allows an administrator or a pharmacy itself to register a new pharmacy.
- **Request Body:**
  ```json
  {
    "name": "Pharmacy Name",
    "contact_person": "John Doe",
    "phone_number": "+250788123456",
    "email": "pharmacy@example.com",
    "address": "123 Main St, Kigali",
    "latitude": -1.9403,
    "longitude": 29.8739,
    "opening_hours": "Mon-Fri 8 AM - 8 PM",
    "services": ["Delivery", "Consultation"],
    "is_registered_by_pharmacy": true
  }
  ```
- **Response:**
  - `201 Created`: Pharmacy successfully registered.
  - `400 Bad Request`: Invalid input.
  - `409 Conflict`: Pharmacy with given phone number or email already exists.

### 2. Get all pharmacies
- **Endpoint:** `/pharmacies`
- **Method:** `GET`
- **Description:** Retrieves a list of all registered pharmacies.
- **Query Parameters:**
  - `limit`: Number of results to return (default: 10)
  - `offset`: Number of results to skip (for pagination)
- **Response:**
  - `200 OK`: List of pharmacies.
  ```json
  [
    {
      "id": "uuid-1",
      "name": "Pharmacy A",
      "contact_person": "John Doe",
      "phone_number": "+250788123456",
      "email": "pharmacyA@example.com",
      "address": "123 Main St, Kigali",
      "latitude": -1.9403,
      "longitude": 29.8739,
      "opening_hours": "Mon-Fri 8 AM - 8 PM",
      "services": ["Delivery"],
      "is_registered_by_pharmacy": true,
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    }
  ]
  ```

### 3. Get a single pharmacy by ID
- **Endpoint:** `/pharmacies/{id}`
- **Method:** `GET`
- **Description:** Retrieves details of a specific pharmacy by its ID.
- **Response:**
  - `200 OK`: Pharmacy details.
  - `404 Not Found`: Pharmacy not found.

### 4. Update pharmacy details
- **Endpoint:** `/pharmacies/{id}`
- **Method:** `PUT`
- **Description:** Updates the details of an existing pharmacy.
- **Request Body:** (Partial updates allowed, similar to POST)
  ```json
  {
    "name": "Updated Pharmacy Name",
    "phone_number": "+250788987654"
  }
  ```
- **Response:**
  - `200 OK`: Pharmacy successfully updated.
  - `400 Bad Request`: Invalid input.
  - `404 Not Found`: Pharmacy not found.

### 5. Delete a pharmacy
- **Endpoint:** `/pharmacies/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a pharmacy record by its ID.
- **Response:**
  - `204 No Content`: Pharmacy successfully deleted.
  - `404 Not Found`: Pharmacy not found.

### 6. Find nearest pharmacies
- **Endpoint:** `/pharmacies/nearest`
- **Method:** `GET`
- **Description:** Finds pharmacies nearest to a given location, ordered by proximity.
- **Query Parameters:**
  - `latitude`: User's current latitude (Required)
  - `longitude`: User's current longitude (Required)
  - `radius`: Search radius in kilometers (Optional, default: 5km)
  - `limit`: Maximum number of nearest pharmacies to return (Optional, default: 10)
- **Response:**
  - `200 OK`: List of nearest pharmacies, including distance.
  ```json
  [
    {
      "id": "uuid-1",
      "name": "Pharmacy A",
      "address": "123 Main St, Kigali",
      "latitude": -1.9403,
      "longitude": 29.8739,
      "distance_km": 0.5,
      "phone_number": "+250788123456",
      "email": "pharmacyA@example.com",
      "opening_hours": "Mon-Fri 8 AM - 8 PM",
      "services": ["Delivery"]
    }
  ]
  ```