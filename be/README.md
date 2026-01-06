# 🌟 Smart Lighting System - Backend API

Sistem IoT untuk monitoring dan kontrol lampu otomatis berdasarkan intensitas cahaya menggunakan ESP32, LDR, dan LED.

**Status:** ✅ **PRODUCTION READY**

---

## 📋 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcrypt, express-validator
- **CORS:** Enabled untuk integrasi Frontend

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env if needed (default values work for development)
```

### 3. Setup Database
```bash
# Run migrations
npx sequelize-cli db:migrate

# Seed demo data
npx sequelize-cli db:seed:all
```

### 4. Start Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

---

## 🗄️ Database Structure

### Tables:
1. **Users** - Autentikasi Admin & User dengan password hashing
2. **SystemConfigs** - Konfigurasi threshold & mode (dengan tracking admin)
3. **SensorLogs** - Riwayat pembacaan sensor dari ESP32

### Demo Accounts:
```
Admin: admin_cahaya / password123
User:  user_biasa / user123
```

✅ **Passwords are hashed with bcrypt (10 salt rounds)**

---

## 📡 API Endpoints

### Authentication (3 endpoints)
```
POST   /api/auth/login      - Login dan dapatkan JWT token
POST   /api/auth/register   - Register user baru (Admin only)
GET    /api/auth/profile    - Get user profile (Authenticated)
```

### Device - ESP32 (2 endpoints)
```
GET    /api/device/config   - Ambil threshold terbaru (No auth)
POST   /api/device/log      - Kirim data sensor (No auth)
```

### Web Dashboard (4 endpoints)
```
GET    /api/web/status      - Dashboard data (Authenticated)
GET    /api/web/logs        - Riwayat sensor dengan pagination (Authenticated)
PATCH  /api/web/config      - Update threshold/mode (Admin only)
GET    /api/web/statistics  - Statistik lamp on/off (Authenticated)
```

### User Management (3 endpoints)
```
GET    /api/users           - List semua user (Admin only)
PATCH  /api/users/:id       - Update user (Admin only)
DELETE /api/users/:id       - Delete user (Admin only)
```

**Total: 12 Endpoints** ✅

📖 **Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk detail lengkap dengan contoh request/response**

---

## 🔐 Security Features

- ✅ **Password Hashing:** bcrypt dengan 10 salt rounds
- ✅ **JWT Authentication:** Token expires dalam 24 jam
- ✅ **Role-Based Authorization:** Admin dan User roles
- ✅ **Input Validation:** express-validator untuk semua input
- ✅ **SQL Injection Protection:** Sequelize ORM
- ✅ **Global Error Handling:** Consistent error responses
- ✅ **CORS Enabled:** Cross-origin requests allowed

---

## 📁 Project Structure

```
be/
├── .env                     # Environment variables
├── server.js                # Main server dengan semua routes
├── config/
│   └── config.json          # Database configuration
├── database/
│   └── database.db          # SQLite database
├── models/                  # Sequelize models
│   ├── user.js
│   ├── systemconfig.js
│   └── sensorlog.js
├── migrations/              # Database migrations
├── seeders/                 # Demo data (passwords hashed)
├── utils/                   # Utilities
│   ├── jwtUtils.js         # JWT generation/verification
│   ├── passwordUtils.js    # Password hashing
│   └── responseFormatter.js # API response formatter
├── middleware/              # Express middleware
│   ├── authMiddleware.js   # JWT authentication
│   ├── roleMiddleware.js   # Role authorization
│   ├── validationMiddleware.js # Input validation
│   └── errorHandler.js     # Global error handler
├── controllers/             # Business logic
│   ├── authController.js
│   ├── deviceController.js
│   ├── webController.js
│   └── userController.js
└── routes/                  # API routes
    ├── authRoutes.js
    ├── deviceRoutes.js
    ├── webRoutes.js
    └── userRoutes.js
```

---

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_cahaya","password":"password123"}'
```

### Test ESP32 Endpoints
```bash
# Get config
curl http://localhost:3000/api/device/config

# Post sensor data
curl -X POST http://localhost:3000/api/device/log \
  -H "Content-Type: application/json" \
  -d '{"lightValue":3500,"lampStatus":true}'
```

### Test Protected Endpoints
```bash
# Save token from login
TOKEN="your-jwt-token-here"

# Get dashboard status
curl http://localhost:3000/api/web/status \
  -H "Authorization: Bearer $TOKEN"

# Update config (admin only)
curl -X PATCH http://localhost:3000/api/web/config \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threshold":3000}'
```

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Database migrations
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all

# Database seeders
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

# Check database content
sqlite3 database/database.db "SELECT * FROM Users;"
sqlite3 database/database.db "SELECT * FROM SystemConfigs;"
sqlite3 database/database.db "SELECT * FROM SensorLogs;"
```

---

## ✅ Implementation Status

### Core Features
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Role-Based Authorization
- ✅ Input Validation
- ✅ Global Error Handling
- ✅ Request Logging
- ✅ CORS Support

### API Endpoints
- ✅ Authentication (3/3)
- ✅ Device/ESP32 (2/2)
- ✅ Web Dashboard (4/4)
- ✅ User Management (3/3)

### Testing
- ✅ All endpoints tested
- ✅ Authentication verified
- ✅ Authorization verified
- ✅ Validation verified
- ✅ Error handling verified

### Documentation
- ✅ README.md
- ✅ API_DOCUMENTATION.md
- ✅ DATABASE_ANALYSIS.md
- ✅ .env.example

**Status: 100% Complete** 🎉

---

## 👥 Team Integration Guide

### **Irza (ESP32)** 🤖
Backend siap! Gunakan:
- `GET /api/device/config` - Ambil threshold setiap 10 detik
- `POST /api/device/log` - Kirim data sensor setiap pembacaan
- **Tidak perlu authentication** untuk ESP32 endpoints

### **Tama (Frontend)** 🎨
Backend siap! Gunakan:
- `POST /api/auth/login` - Login dan simpan JWT token
- `GET /api/web/status` - Dashboard real-time data
- `GET /api/web/statistics` - Data untuk charts
- **Semua web endpoints butuh JWT token** di header Authorization

### **Salma (Dokumentasi)** 📝
Gunakan dokumen ini untuk:
- ERD: Lihat `DATABASE_ANALYSIS.md`
- API Docs: Lihat `API_DOCUMENTATION.md`
- Sequence Diagrams: Flow ada di dokumentasi

### **Rani (Laporan)** 📊
Include dalam laporan:
- Architecture: MVC dengan middleware layers
- Security: Bcrypt + JWT
- Testing: 12 endpoints tested ✅
- Tech Stack: Node.js, Express, Sequelize, SQLite

---

## 📚 Documentation

- **[README.md](./README.md)** - This file (Quick start & overview)
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[DATABASE_ANALYSIS.md](./DATABASE_ANALYSIS.md)** - Database structure analysis

---

## 🐛 Troubleshooting

### Server tidak jalan?
```bash
# Pastikan dependencies terinstall
npm install

# Restart server
npm run dev
```

### Database error?
```bash
# Reset database
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### JWT error?
```bash
# Pastikan .env file ada dan JWT_SECRET terisi
cp .env.example .env
```

---

## 🎯 Next Steps

1. ✅ **Backend** - COMPLETE
2. 🔄 **ESP32 Integration** - Irza can start
3. 🔄 **Frontend Development** - Tama can start
4. 🔄 **Documentation** - Salma can start
5. 🔄 **Final Report** - Rani can start

---

**Created by:** Team Cahaya - PAW Project 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-01-05

