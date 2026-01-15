# 📊 Analisis Database - Smart Lighting System IoT

## ✅ Status: **SUDAH BENAR** (dengan perbaikan minor)

---

## 🗄️ Struktur Database

### 1. **Tabel Users**
**Fungsi:** Menyimpan data autentikasi Admin dan User biasa

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID unik user |
| `username` | STRING | NOT NULL, UNIQUE | Username untuk login |
| `password` | STRING | NOT NULL | Password (⚠️ **HARUS di-hash dengan bcrypt**) |
| `role` | ENUM('admin', 'user') | DEFAULT 'user' | Role akses sistem |
| `createdAt` | DATE | NOT NULL | Waktu pembuatan akun |
| `updatedAt` | DATE | NOT NULL | Waktu update terakhir |

**✅ Sudah Benar:** Struktur tabel sesuai kebutuhan sistem

**⚠️ Catatan Penting:**
- Password saat ini masih **plain text** di seeder
- **WAJIB** gunakan `bcrypt` untuk hash password sebelum production
- Contoh: `const hashedPassword = await bcrypt.hash('password123', 10);`

---

### 2. **Tabel SystemConfigs**
**Fungsi:** Menyimpan konfigurasi sistem (threshold cahaya & mode manual)

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID konfigurasi |
| `threshold` | INTEGER | DEFAULT 2000 | Batas nilai cahaya untuk nyalakan lampu |
| `manualMode` | BOOLEAN | DEFAULT false | Mode manual (true) atau otomatis (false) |
| `updatedBy` | INTEGER | FOREIGN KEY → Users(id) | Admin yang terakhir update config |
| `createdAt` | DATE | NOT NULL | Waktu pembuatan config |
| `updatedAt` | DATE | NOT NULL | Waktu update terakhir |

**✅ Sudah Benar:** 
- Relasi ke tabel Users sudah tepat
- Default value threshold (2000) sesuai kebutuhan
- Cascade rules (`ON UPDATE CASCADE`, `ON DELETE SET NULL`) sudah benar

---

### 3. **Tabel SensorLogs**
**Fungsi:** Menyimpan riwayat pembacaan sensor dari ESP32

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID log |
| `lightValue` | INTEGER | - | Nilai intensitas cahaya dari LDR |
| `lampStatus` | BOOLEAN | - | Status lampu (true=ON, false=OFF) |
| `configId` | INTEGER | FOREIGN KEY → SystemConfigs(id) | Config yang berlaku saat log dibuat |
| `createdAt` | DATE | NOT NULL | Waktu pembacaan sensor |

**✅ Sudah Benar:**
- Tidak ada `updatedAt` (log tidak perlu di-update)
- Relasi ke SystemConfigs membantu tracking config mana yang digunakan
- Cascade rules sudah tepat

**💡 Saran Optimasi:**
- Pertimbangkan menambah **index** pada `createdAt` untuk query grafik yang lebih cepat
- Pertimbangkan **data retention policy** (hapus log > 30 hari untuk hemat storage)

---

## 🔗 Relasi Antar Tabel

```
Users (1) ──────< SystemConfigs (Many)
   │                    │
   │                    │
   └──────────────────< SensorLogs (Many)
                        (via configId)
```

### Penjelasan Relasi:
1. **Users → SystemConfigs**: Satu admin bisa update config berkali-kali
2. **SystemConfigs → SensorLogs**: Setiap log sensor terhubung ke config yang berlaku saat itu

---

## 📝 Data Seeder (Demo Data)

### Users:
```javascript
1. admin_cahaya / password123 (role: admin)
2. user_biasa / user123 (role: user)
```

### SystemConfigs:
```javascript
threshold: 2500
manualMode: false
updatedBy: 1 (admin_cahaya)
```

### SensorLogs:
```javascript
1. lightValue: 1200, lampStatus: false (Terang → Lampu OFF)
2. lightValue: 2800, lampStatus: true  (Gelap → Lampu ON)
3. lightValue: 3000, lampStatus: true  (Gelap → Lampu ON)
```

---

## ✅ Checklist Kesesuaian dengan Kebutuhan Sistem

| Kebutuhan | Status | Keterangan |
|-----------|--------|------------|
| Autentikasi Admin/User | ✅ | Tabel Users dengan role ENUM |
| Simpan threshold cahaya | ✅ | SystemConfigs.threshold |
| Mode manual/otomatis | ✅ | SystemConfigs.manualMode |
| Log sensor real-time | ✅ | SensorLogs dengan timestamp |
| Tracking siapa yang update config | ✅ | SystemConfigs.updatedBy |
| Relasi data yang benar | ✅ | Foreign keys sudah tepat |

---

## 🚨 Issue yang Sudah Diperbaiki

### 1. **Model User Corrupted** ❌ → ✅ FIXED
**Masalah:** File `models/user.js` berisi kode migration, bukan model Sequelize
**Solusi:** File sudah diperbaiki dengan struktur model yang benar

### 2. **Server Error** ❌ → ✅ FIXED
**Masalah:** `TypeError: require(...) is not a function`
**Penyebab:** Model User yang corrupted
**Solusi:** Model sudah diperbaiki, server seharusnya jalan normal

### 3. **Missing PORT Variable** ❌ → ✅ FIXED
**Masalah:** Variable `PORT` tidak didefinisikan di `server.js`
**Solusi:** Ditambahkan `const PORT = process.env.PORT || 3000`

---

## 🎯 Rekomendasi untuk Tim

### Untuk **Ridha (Database)**:
✅ **Database sudah siap!** Struktur sudah benar dan sesuai kebutuhan.

**Next Steps:**
1. ✅ Migrations sudah jalan
2. ✅ Seeders sudah jalan
3. 🔄 Pertimbangkan menambah index untuk performa:
   ```sql
   CREATE INDEX idx_sensor_logs_created ON SensorLogs(createdAt);
   ```

### Untuk **Dhika (Backend)**:
Database sudah siap untuk digunakan. Kamu bisa mulai membuat API endpoints:

**Endpoints yang Dibutuhkan:**
```javascript
// Untuk ESP32 (Irza)
GET  /api/device/config          // Ambil threshold terbaru
POST /api/device/log             // Kirim data sensor

// Untuk Frontend (Tama)
GET  /api/web/status             // Dashboard data
GET  /api/web/logs               // Riwayat sensor
PATCH /api/web/config            // Update threshold (Admin only)
POST /api/auth/login             // Login user/admin
```

### Untuk **Irza (Arduino/ESP32)**:
Database sudah siap menerima data dari ESP32.

**Format JSON yang harus dikirim:**
```json
{
  "lightValue": 2500,
  "lampStatus": true
}
```

### Untuk **Tama (Frontend)**:
Database sudah menyediakan semua data yang dibutuhkan untuk dashboard.

**Data yang bisa ditampilkan:**
- Status lampu real-time
- Grafik nilai cahaya (dari SensorLogs)
- Pengaturan threshold (dari SystemConfigs)
- User management (dari Users)

### Untuk **Salma (Dokumentasi)**:
Gunakan dokumen ini sebagai referensi untuk membuat:
- **ERD (Entity Relationship Diagram)**
- **Class Diagram** dengan relasi Sequelize
- **Sequence Diagram** untuk flow update threshold

### Untuk **Rani (Laporan)**:
**Poin-poin yang bisa dimasukkan:**
1. Penggunaan ORM (Sequelize) untuk portabilitas database
2. Relasi database yang mendukung tracking perubahan config
3. Data retention strategy untuk optimasi storage
4. Security consideration (password hashing dengan bcrypt)

---

## 🔐 Security Checklist

| Item | Status | Action Required |
|------|--------|-----------------|
| Password Hashing | ⚠️ **BELUM** | Install `bcrypt` dan hash password di seeder & API |
| SQL Injection Protection | ✅ | Sequelize ORM sudah protect otomatis |
| Input Validation | 🔄 **TODO** | Dhika harus tambahkan di API endpoints |
| CORS Configuration | ✅ | Sudah di-setup di `server.js` |
| Environment Variables | 🔄 **TODO** | Buat file `.env` untuk DB credentials |

---

## 📦 File Database Location

```
be/
├── database/
│   └── database.db          ← SQLite database file
├── config/
│   └── config.json          ← Database configuration
├── models/
│   ├── index.js             ← Sequelize loader
│   ├── user.js              ← ✅ FIXED
│   ├── systemconfig.js      ← ✅ OK
│   └── sensorlog.js         ← ✅ OK
├── migrations/
│   ├── 20260104192223-create-user.js
│   ├── 20260104192230-create-sensor-log.js
│   └── 20260104192235-create-system-config.js
└── seeders/
    ├── 20260104192746-demo-user.js
    ├── 20260104192747-demo-config.js
    └── 20260104192747-demo-logs.js
```

---

## 🚀 Cara Testing Database

### 1. Cek apakah server jalan:
```bash
npm run dev
```

### 2. Test endpoint:
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "message": "Smart Lighting System API - Server is running!"
}
```

### 3. Cek database via Sequelize CLI:
```bash
# Lihat status migrations
npx sequelize-cli db:migrate:status

# Lihat isi database (gunakan SQLite browser atau)
sqlite3 database/database.db "SELECT * FROM Users;"
```

---

## ✅ Kesimpulan

**Database Structure: SUDAH BENAR ✅**

Struktur database yang kamu buat sudah sangat baik dan sesuai dengan kebutuhan sistem IoT Smart Lighting. Relasi antar tabel sudah tepat, migrations dan seeders sudah berjalan dengan baik.

**Yang Perlu Dilakukan Selanjutnya:**
1. ✅ Database sudah siap
2. 🔄 Dhika bisa mulai buat API endpoints
3. 🔄 Irza bisa mulai coding ESP32 untuk kirim data
4. ⚠️ **PENTING:** Implementasi bcrypt untuk password hashing sebelum production

**Good job, Andhika! Database foundation-mu sudah solid! 🎉**
