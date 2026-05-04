# 💰 Personal Finance Tracker – Backend

A scalable and modular backend API for a Personal Finance Management application that helps users manage income, expenses, budgets, reports, categories, reminders, and profile data.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 💰 Income & Expense Tracking
- 🏷️ Category Management
- 📊 Budget Planning & Monitoring
- 📈 Financial Reports & Analytics
- ⏰ Payment Reminders with Notifications
- 👤 User Profile Management
- 📊 Dashboard Summary APIs

---

## 🧭 Application Modules

This backend is structured into 7 main modules:

1. **Dashboard** – Overview of financial data
2. **Transactions** – Income & Expense management
3. **Categories** – Organize transactions
4. **Budgets** – Set and track spending limits
5. **Reports** – Advanced analytics & insights
6. **Payment Reminders** – Bill & due-date alerts
7. **Profile** – User account management

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- Dotenv
- bcryptjs

---

## 📦 Installation

```bash
git clone https://github.com/ishikasahu022-cmyk/ft-api.git
cd backend
npm install

🔐 Environment Variables

PORT=5000
DB_URL=mongodb://localhost:27017/finance_app
JWT_SECRET=your_secret_key_here
EXPIRE_TIME=7d