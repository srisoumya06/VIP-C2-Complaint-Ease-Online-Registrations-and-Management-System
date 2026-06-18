# Complaint Ease – Online Complaint Registration and Management System

## 📌 Project Overview

Complaint Ease is a full-stack MERN web application developed to simplify complaint registration and management processes. The platform allows users to register complaints online, track complaint status, and communicate with assigned agents. Administrators can manage complaints, users, agents, and monitor complaint activities through a centralized dashboard.

This project is developed using the MERN Stack:

* MongoDB
* Express.js
* React.js
* Node.js

---

# 🚀 Features

## 👤 User Module

* User Registration & Login
* JWT Authentication
* Create Complaint
* Upload Complaint Details
* Track Complaint Status
* View Complaint History
* Edit Profile
* Feedback Submission

---

## 🛠️ Agent Module

* View Assigned Complaints
* Update Complaint Status
* Add Resolution Notes
* Manage Complaint Workflow

---

## 🛡️ Admin Module

* Admin Dashboard
* Manage Users
* Manage Agents
* View All Complaints
* Assign Complaints to Agents
* Monitor Complaint Status

---

# 🔄 Complaint Workflow

Pending
⬇
Assigned
⬇
In Progress
⬇
Resolved

---

# 🧰 Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios
* Context API

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* express-validator
* dotenv
* cors
* multer

## Database

* MongoDB
* Mongoose

---

# 📁 Project Structure

```bash
ComplaintEase/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── agent/
│   │   │   ├── common/
│   │   │   └── user/
│   │   │
│   │   ├── App.js
│   │   └── index.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── .env
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/srisoumya06/VIP-C2-Complaint-Ease-Online-Registrations-and-Management-System
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Complaints

```http
POST /api/complaints
GET /api/complaints
GET /api/complaints/:id
PUT /api/complaints/:id
DELETE /api/complaints/:id
```

---

## Admin

```http
GET /api/admin/users
GET /api/admin/agents
GET /api/admin/complaints
PUT /api/admin/assign-agent/:id
```

---

# 🖥️ User Interface

* Responsive Design
* Dashboard Layout
* Tailwind CSS Styling
* Sidebar Navigation
* Status Tracking UI
* Complaint Management Pages

---

# 🧪 Testing

Testing performed using:

* Postman API Testing
* Browser Developer Tools
* MongoDB Testing

---

# 🔮 Future Enhancements

* Real-Time Chat using Socket.io
* Email Notifications
* Analytics Dashboard
* AI-Based Complaint Categorization
* Mobile App Integration

---

---

# 👨‍💻 Author

Boddupalli Lalitha Sri Soumya

---

# 📜 License

This project is developed for educational and internship purposes.
