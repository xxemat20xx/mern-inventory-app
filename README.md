# MERN Inventory Management System

🔗 **Live Demo:** [https://mern-inventory-app-i0bh.onrender.com/](https://mern-inventory-app-i0bh.onrender.com/)

A full‑stack **MERN Inventory Management & POS System**. This application handles product inventory, stock tracking, sales checkout, dashboard analytics, and role‑based authentication (Admin / User).

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT‑based authentication (Access & Refresh tokens)
* Secure HTTP‑only cookies
* Role‑based access (Admin / User)
* Auto token rotation & logout handling

### 📦 Inventory Management

* Create, update, delete products (Admin only)
* Stock quantity tracking
* Low‑stock alerts
* Product categories & barcode/SKU support

### 📊 Stock Logs

* Automatic stock logs for:

  * Initial stock
  * Restock
  * Manual adjustments
  * Sales deductions
    
* Tracks:
  * Product
  * Quantity change (+ / -)
  * Action type
  * Performed by user
  * Timestamp

### 🧾 POS / Terminal
* Add products to cart
* Quantity control with stock validation
* SKU search
* Checkout flow
* Printable receipt(only for window)

### 📈 Dashboard Analytics
* Total revenue
* Total profit
* Items sold
* Low‑stock summary

---

## 🛠️ Tech Stack

### Frontend
* React (Vite)
* Zustand (state management)
* Tailwind CSS
* Recharts
* Axios

### Backend
* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Cookie‑based sessions

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/xxemat20xx/mern-inventory-app.git
cd mern-inventory-app-
```

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

### 3️⃣ Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Frontend (Vite)

```env
VITE_API_URL=http://localhost:5001/api
```

### Backend

```env
MONGO_URI=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=
```

---

## 👤 User Roles

| Role  | Permissions                                   |
| ----- | --------------------------------------------- |
| Admin | Manage products, view dashboard, adjust stock |
| User  | POS checkout, view products                   |

---

## 🧪 Known Behaviors

* Cookies are **HTTP‑only** and **secure in production**
* Auto‑login only occurs if a valid refresh token exists
* Logout clears both access and refresh tokens

---

## 📌 Future Improvements

* CSV export for stock & sales logs
* User management panel
* Multi‑tax support
* Role‑based dashboard views
* Offline POS mode

---

* GitHub: [https://github.com/xxemat20xx](https://github.com/xxemat20xx)

---

## 📄 License

This project is for portfolio purposes only.

---

⭐ If you like this project, feel free to star the repository!
