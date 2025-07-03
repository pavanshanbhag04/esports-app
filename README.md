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
 ![image](https://github.com/user-attachments/assets/18e7c5ee-7b4a-4642-863d-60c8ef6c0657)
- Registration Page
  ![image](https://github.com/user-attachments/assets/519d424b-00f4-4c01-b05c-8792d49dab7d)
- Games Available
  ![image](https://github.com/user-attachments/assets/a0cf00ec-28ea-4360-b65b-640640551be2)
- Player Registration
  ![image](https://github.com/user-attachments/assets/aea89085-bca1-4053-bd24-25cd334a555f)
- BGMI Team Registration
  ![image](https://github.com/user-attachments/assets/b949c6a3-f76c-4563-9e1b-62787ad5f9a3)
- CSGO Team Registration
  ![image](https://github.com/user-attachments/assets/93f33526-7170-4262-8d31-4be10d9193e1)
- Check Result
  ![image](https://github.com/user-attachments/assets/042475ac-2da9-447d-bb29-0a6702a03714)
- Result page
  ![image](https://github.com/user-attachments/assets/4e0a2dc8-2f30-406f-b50c-ac4731d173b8)
- Admin Login
  ![image](https://github.com/user-attachments/assets/f837167b-11d8-4df1-8924-4e9e1ad545dc)
- Declare Result
  ![image](https://github.com/user-attachments/assets/710cc37a-bcab-4a65-874c-7d8dd631e820)
- SMS Confirmation
  ![WhatsApp Image 2025-07-03 at 12 36 48_3156ed80](https://github.com/user-attachments/assets/a200e536-8c3d-4f5e-821b-f4e64c19a028)
- MongoDB Atlas
  ![Screenshot 2025-07-03 123909](https://github.com/user-attachments/assets/1dead73c-d632-4dee-a1be-28d89cadb886)














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

