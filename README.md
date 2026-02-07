# ANEMONE OUTLET SYSTEM - FULLSTACK PROJECT - SANG PUTU MARDIANA

## Project Overview

Sistem pembelian produk untuk franchise dengan banyak outlet.
Head Office (HO) dapat mengelola produk dan memantau pesanan, sedangkan outlet dapat melakukan pembelian produk.

---

## Tujuan Test

Membangun versi mini sistem pembelian produk dengan:

* Backend: Laravel API
* Frontend: React
* Database: MySQL
* Authentication: Role-based (HO & Outlet)

---

## Cara Menjalankan Project

### Prasyarat

* PHP ≥ 8.2
* Composer
* Node.js ≥ 18
* MySQL ≥ 5.7
* Git

---

## 1. Clone Repository

```
git clone <repository-url>
cd anemone-project
```

---

## 2. Backend Setup (Laravel)

```
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Konfigurasi database pada file `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=anemone_db
DB_USERNAME=root
DB_PASSWORD=
```

Migrasi database:

```
php artisan migrate --seed
```

Jalankan server:

```
php artisan serve --port=8000
```

Backend berjalan di:

```
http://localhost:8000
```

---

## 3. Frontend Setup (React)

Buka terminal baru:

```
cd frontend
npm install
npm start
```

Frontend berjalan di:

```
http://localhost:3000
```

---

## 4. Database Setup

Buat database di MySQL:

```
mysql -u root -p -e "CREATE DATABASE anemone_db;"
```

Atau buat manual melalui phpMyAdmin.

---

## Akun Demo

### Head Office (HO)

Email: [ho@anemone.com](mailto:ho@anemone.com)
Password: password

Fitur:

* Dashboard overview
* Lihat semua pesanan
* Update status pesanan
* Kelola produk (Create, Read)

### Outlet

Email: [outlet1@anemone.com](mailto:outlet1@anemone.com)
Password: password

Fitur:

* Lihat daftar produk
* Buat pesanan baru
* Lihat history pesanan

---

## API Endpoints

### Authentication

| Method | Endpoint    | Deskripsi        | Auth | Role |
| ------ | ----------- | ---------------- | ---- | ---- |
| POST   | /api/login  | Login user       | No   | -    |
| POST   | /api/logout | Logout user      | Yes  | -    |
| GET    | /api/me     | Get current user | Yes  | -    |

### Products

| Method | Endpoint      | Deskripsi        | Auth | Role    |
| ------ | ------------- | ---------------- | ---- | ------- |
| GET    | /api/products | Get all products | Yes  | All     |
| POST   | /api/products | Create product   | Yes  | HO only |

### Orders

| Method | Endpoint                | Deskripsi           | Auth | Role                 |
| ------ | ----------------------- | ------------------- | ---- | -------------------- |
| GET    | /api/orders             | Get orders          | Yes  | HO: all, Outlet: own |
| POST   | /api/orders             | Create order        | Yes  | Outlet only          |
| PUT    | /api/orders/{id}/status | Update order status | Yes  | HO only              |

### Dashboard

| Method | Endpoint               | Deskripsi         | Auth | Role    |
| ------ | ---------------------- | ----------------- | ---- | ------- |
| GET    | /api/dashboard/summary | Dashboard summary | Yes  | HO only |

---

## Alur Aplikasi

### Alur Outlet

1. Login sebagai Outlet
2. Masuk ke halaman daftar produk
3. Pilih produk dan tentukan jumlah
4. Submit order
5. Lihat status di halaman My Orders

### Alur Head Office

1. Login sebagai Head Office
2. Masuk ke Dashboard
3. Lihat ringkasan order dan total sales
4. Kelola semua pesanan
5. Update status pesanan
6. Kelola produk

---

## Fitur Implementasi

### Fitur Wajib

* Authentication dengan role-based access
* CRUD Products (HO only)
* Create Order (Outlet only)
* View Orders berdasarkan role
* Update Order Status (HO only)
* Dashboard Summary (HO only)
* Responsive design
* Error handling dan loading states
* Conditional rendering

### Bonus Features

* Validasi stok saat order
* Database transaction saat create order
* Seeder dummy data
* Middleware role check
* Pagination (optional)

---

## Asumsi dan Keterbatasan

### Asumsi

* Menggunakan token sederhana tanpa refresh token
* Tidak ada payment gateway
* Basic validation dan sanitization
* Menggunakan MySQL lokal
* CORS mengizinkan semua origin untuk development

### Keterbatasan

* Tidak ada registrasi user
* Tidak ada reset password
* Tidak ada email notification
* Tidak ada export data
* Tidak ada audit log
* Tidak ada upload gambar produk
* Tidak ada multi-language
* Filter dan search sederhana

---

## Batasan Teknis

* Frontend menggunakan Context API
* Format response API: success, message, data
* Basic error handling
* Validasi form sederhana
* Responsive layout dasar
* Support modern browser

---

## Trade-offs

* Mengutamakan kesederhanaan dibanding optimasi performa
* Security dasar untuk mempercepat development
* Fokus pada fitur wajib
* UI sederhana dengan fokus pada fungsionalitas

---