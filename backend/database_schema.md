# Pharmacy Tracker Database Schema

## Table: `pharmacies`

This table stores information about registered pharmacies.

| Column Name           | Data Type | Description                                        | Constraints           |
| :-------------------- | :-------- | :------------------------------------------------- | :-------------------- |
| `id`                  | UUID      | Unique identifier for the pharmacy                 | Primary Key, Not Null |
| `name`                | String    | Name of the pharmacy                               | Not Null              |
| `contact_person`      | String    | Name of the primary contact person                 |                       |
| `phone_number`        | String    | Contact phone number of the pharmacy               | Not Null, Unique      |
| `email`               | String    | Email address of the pharmacy                      | Unique                |
| `address`             | String    | Physical address of the pharmacy                   | Not Null              |
| `latitude`            | Float     | Latitude coordinate of the pharmacy's location     | Not Null              |
| `longitude`           | Float     | Longitude coordinate of the pharmacy's location    | Not Null              |
| `opening_hours`       | String    | Operating hours (e.g., "Mon-Fri 9 AM - 6 PM")    |                       |
| `services`            | JSON      | JSON array of services offered (e.g., ["Delivery"]) |                       |
| `is_registered_by_pharmacy` | Boolean   | True if registered by pharmacy, False if by admin  | Default: False        |
| `created_at`          | Timestamp | Timestamp of record creation                       | Not Null, Default: NOW() |
| `updated_at`          | Timestamp | Timestamp of last update                           | Not Null, Default: NOW() |

## Table: `users` (Optional, for future authentication/roles)

This table could store user information if authentication is implemented.

| Column Name | Data Type | Description             | Constraints           |
| :---------- | :-------- | :---------------------- | :-------------------- |
| `id`        | UUID      | Unique user identifier  | Primary Key, Not Null |
| `username`  | String    | User's chosen username  | Not Null, Unique      |
| `email`     | String    | User's email address    | Not Null, Unique      |
| `password`  | String    | Hashed password         | Not Null              |
| `role`      | String    | User role (e.g., 'admin', 'pharmacy_user') | Default: 'pharmacy_user' |
| `created_at`| Timestamp | Timestamp of record creation | Not Null, Default: NOW() |
| `updated_at`| Timestamp | Timestamp of last update | Not Null, Default: NOW() |