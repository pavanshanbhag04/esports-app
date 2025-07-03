# 🎮 Esports Tournament Management System

Welcome to the Esports Tournament Management System — a web-based platform built with Node.js and MongoDB that helps manage and streamline esports tournaments like BGMI and CSGO.

This app allows players and teams to register, submit match results, and receive SMS notifications. Admins can log in to verify match outcomes and control the flow of tournament results securely.

---

## ✨ Key Features

- 📝 **Team Registration** – Register teams and players for tournaments
- 🏆 **Match Result Submission** – Players can submit match outcomes
- 🔒 **Admin Verification** – Results are verified by admins for integrity
- 📱 **SMS Notifications** – Send alerts to winners using Twilio
- 🗄️ **MongoDB Integration** – Store all data securely
- 🌐 **Simple Web UI** – Easy-to-use HTML frontend

---

## 🧰 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **SMS Service:** Twilio API
- **Frontend:** HTML, CSS, JavaScript (no frontend framework)
- **Authentication:** Sessions using `express-session`
- **Configuration:** Environment variables via `dotenv`

---
## 📸 Demo Screenshot
- Home Page
- ![image](https://github.com/user-attachments/assets/18e7c5ee-7b4a-4642-863d-60c8ef6c0657)
- 





---

## 🚀 Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/pavanshanbhag04/esports-app
cd esports-app
npm install

```
### 2. Create a .env file in the root directory
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SESSION_SECRET=your_random_session_secret
MONGO_URI=your_mongodb_connection_uri

```

### Start the server
```bash
nodemon server.js
```

