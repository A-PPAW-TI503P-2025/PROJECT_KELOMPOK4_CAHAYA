# Database Documentation

Folder ini berisi semua file yang berkaitan dengan **Database** untuk Smart Light IoT System.

## 📁 Struktur Folder

```
database/
├── config/           # Konfigurasi koneksi database (Sequelize)
├── migrations/       # Migration files untuk schema database
├── models/           # Model definitions (User, SystemConfig, SensorLog)
├── seeders/          # Seed data untuk testing
├── DATABASE_ANALYSIS.md  # Dokumentasi analisis database
└── database.sqlite   # File database SQLite (jika ada)
```

## 🗃️ Database Schema

### Tables:
1. **Users** - Tabel untuk menyimpan data user
2. **SystemConfigs** - Tabel untuk konfigurasi sistem (threshold, mode, lampStatus)
3. **SensorLogs** - Tabel untuk log data sensor

## 🚀 Cara Penggunaan

1. Install dependencies di folder BE:
   ```bash
   cd be
   npm install
   ```

2. Jalankan migration:
   ```bash
   npx sequelize-cli db:migrate
   ```

3. Jalankan seeder (opsional):
   ```bash
   npx sequelize-cli db:seed:all
   ```

## 👤 Job Desk: Database Engineer

Tugas:
- Design database schema
- Membuat migration files
- Membuat model definitions
- Membuat seed data
- Dokumentasi database
