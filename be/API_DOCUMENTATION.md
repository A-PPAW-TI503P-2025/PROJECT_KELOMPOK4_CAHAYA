# 📡 Smart Lighting System - API Documentation

Complete API documentation for the Smart Lighting System IoT Backend.

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in via `/api/auth/login`.

---

## 📍 API Endpoints

### Authentication Endpoints

#### 1. Login
**POST** `/api/auth/login`

Login and receive JWT token.

**Request Body:**
```json
{
  "username": "admin_cahaya",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin_cahaya",
      "role": "admin"
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### 2. Register User
**POST** `/api/auth/register`

Register new user (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "username": "new_user",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 3,
      "username": "new_user",
      "role": "user"
    }
  }
}
```

---

#### 3. Get Profile
**GET** `/api/auth/profile`

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "admin_cahaya",
      "role": "admin",
      "createdAt": "2026-01-04T19:52:32.515Z"
    }
  }
}
```

---

### Device Endpoints (ESP32)

#### 4. Get Configuration
**GET** `/api/device/config`

Get current system configuration (threshold and manual mode).

**No authentication required** - ESP32 needs open access.

**Response (200):**
```json
{
  "success": true,
  "message": "Configuration retrieved successfully",
  "data": {
    "threshold": 2500,
    "manualMode": false
  }
}
```

---

#### 5. Post Sensor Log
**POST** `/api/device/log`

Post sensor data from ESP32.

**No authentication required** - ESP32 needs open access.

**Request Body:**
```json
{
  "lightValue": 3500,
  "lampStatus": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sensor log saved successfully",
  "data": {
    "id": 4,
    "lightValue": 3500,
    "lampStatus": true,
    "timestamp": "2026-01-04T19:52:43.317Z"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "lightValue",
      "message": "Light value must be a positive integer"
    }
  ]
}
```

---

### Web Dashboard Endpoints

#### 6. Get Dashboard Status
**GET** `/api/web/status`

Get latest sensor data and current configuration.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard status retrieved successfully",
  "data": {
    "latestSensorData": {
      "id": 4,
      "lightValue": 3500,
      "lampStatus": true,
      "createdAt": "2026-01-04T19:52:43.317Z"
    },
    "currentConfig": {
      "id": 1,
      "threshold": 2500,
      "manualMode": false,
      "updatedAt": "2026-01-04T19:52:32.519Z",
      "User": {
        "username": "admin_cahaya"
      }
    }
  }
}
```

---

#### 7. Get Sensor Logs
**GET** `/api/web/logs?page=1&limit=50&startDate=&endDate=`

Get paginated sensor logs with optional date filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)

**Response (200):**
```json
{
  "success": true,
  "message": "Sensor logs retrieved successfully",
  "data": {
    "logs": [
      {
        "id": 4,
        "lightValue": 3500,
        "lampStatus": true,
        "createdAt": "2026-01-04T19:52:43.317Z"
      }
    ],
    "pagination": {
      "total": 4,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
}
```

---

#### 8. Update Configuration
**PATCH** `/api/web/config`

Update system configuration (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "threshold": 3000,
  "manualMode": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "data": {
    "config": {
      "id": 1,
      "threshold": 3000,
      "manualMode": false,
      "updatedBy": "admin_cahaya",
      "updatedAt": "2026-01-04T19:53:02.358Z"
    }
  }
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

---

#### 9. Get Statistics
**GET** `/api/web/statistics?period=24h`

Get aggregated statistics (lamp on/off count, average light value).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Time period - `24h`, `7d`, `30d` (default: 24h)

**Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "period": "24h",
    "statistics": {
      "totalLogs": 4,
      "lampOnCount": 3,
      "lampOffCount": 1,
      "lampOnPercentage": "75.00",
      "avgLightValue": 2625,
      "maxLightValue": 3500,
      "minLightValue": 1200
    }
  }
}
```

---

### User Management Endpoints (Admin Only)

#### 10. Get All Users
**GET** `/api/users`

Get list of all users.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin_cahaya",
        "role": "admin",
        "createdAt": "2026-01-04T19:52:32.515Z",
        "updatedAt": "2026-01-04T19:52:32.515Z"
      },
      {
        "id": 2,
        "username": "user_biasa",
        "role": "user",
        "createdAt": "2026-01-04T19:52:32.515Z",
        "updatedAt": "2026-01-04T19:52:32.515Z"
      }
    ]
  }
}
```

---

#### 11. Update User
**PATCH** `/api/users/:id`

Update user details.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "username": "updated_username",
  "password": "new_password",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": 2,
      "username": "updated_username",
      "role": "admin"
    }
  }
}
```

---

#### 12. Delete User
**DELETE** `/api/users/:id`

Delete a user.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

---

## 🔒 Error Responses

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate entry |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation message"
    }
  ]
}
```

---

## 🧪 Testing with cURL

### 1. Login and Save Token
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_cahaya","password":"password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

echo $TOKEN
```

### 2. Get Dashboard Status
```bash
curl -s http://localhost:3000/api/web/status \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
```

### 3. Update Configuration
```bash
curl -s -X PATCH http://localhost:3000/api/web/config \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threshold":3000}' \
  | python3 -m json.tool
```

### 4. ESP32 - Get Config
```bash
curl -s http://localhost:3000/api/device/config \
  | python3 -m json.tool
```

### 5. ESP32 - Post Sensor Data
```bash
curl -s -X POST http://localhost:3000/api/device/log \
  -H "Content-Type: application/json" \
  -d '{"lightValue":3500,"lampStatus":true}' \
  | python3 -m json.tool
```

---

## 📊 Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| admin_cahaya | password123 | admin |
| user_biasa | user123 | user |

**Note:** Passwords are hashed with bcrypt in the database.

---

## 🔧 Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- `express-rate-limit` for API rate limiting
- `express-slow-down` for gradual slowdown

---

## 📝 Notes for Developers

### For Irza (ESP32):
- Use `/api/device/config` to get threshold every 10 seconds
- Use `/api/device/log` to post sensor data every reading
- No authentication required for device endpoints

### For Tama (Frontend):
- All web endpoints require JWT token in Authorization header
- Token expires in 24 hours (configurable in .env)
- Use `/api/web/status` for dashboard real-time data
- Use `/api/web/statistics` for charts and graphs

### For Dhika (Backend):
- All passwords are hashed with bcrypt (10 salt rounds)
- JWT secret is in `.env` file
- Input validation uses express-validator
- Global error handler catches all errors

---

**API Version:** 1.0.0  
**Last Updated:** 2026-01-05  
**Team:** Cahaya - PAW Project 2026
