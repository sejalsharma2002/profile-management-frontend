# Profile Management System — Frontend
A cross-platform Profile Management application built using **React Native (Expo)** and **TypeScript**, supporting:

- Web (Desktop + Responsive Mode)
- Android (via Expo Go App)

This frontend communicates securely with the FastAPI backend using JWT authentication.

> This project is part of a full-stack assignment. It demonstrates modern UI, client-side authentication, responsive design, and smooth user experience.

---

## 📌 Table of Contents

- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [Architecture Decisions](#architecture-decisions)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Application Flow](#application-flow)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Time Spent](#time-spent)
- [Future Improvements](#future-improvements)

---

## Project Goals

This frontend fulfills the required assignment objectives, including:

- User Signup, Login, Logout
- Editable Profile (name and bio)
- JWT Token persistence using device-local storage
- Automatic authentication restore on app launch
- Responsive UI for mobile & desktop
- Animated transitions for premium feel
- Bonus: Profile Strength Indicator

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| UI Styling | Custom inline theming (Tailwind-inspired) |
| State Management | React Hooks (useState, useEffect) |
| Local Storage | AsyncStorage |
| API Communication | Fetch (with response handling) |

---

## Architecture Decisions

- **JWT stored in AsyncStorage** to persist login after app close.
- **Reusable UI components** (`Button`, `Input`, `Tab`) ensure clean code organization.
- **API abstraction (`api.ts`)** enables switching between mobile and web environments automatically.
- **Animated screen switching** improves UX without heavy libraries.
- **Client-side validation/ real-time feedback**, including live profile strength scoring, reduces backend load.

---

## Features

### Completed Features
- [x] Signup (POST `/auth/signup`)
- [x] Login (POST `/auth/login`)
- [x] JWT Token storage and restore
- [x] Protected route handling (GET `/profile/me`)
- [x] Profile updating (PUT `/profile/me`)
- [x] Animated and responsive UI
- [x] Profile strength feature (bonus)
---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/sejalsharma2002/profile-management-frontend.git
cd profile-management-frontend
```

### 2. Install Dependencies
```bash
npm install
```
---

## Environment Setup

Update `api.ts` to choose correct backend URL:
```bash
import { Platform } from "react-native";

let API_BASE = "http://127.0.0.1:8000"; // for web

if (Platform.OS === "android") {
API_BASE = "http://YOUR_LOCAL_IP:8000";
}

export { API_BASE };
```

Notes:

- Replace `YOUR_LOCAL_IP` with your laptop's network IP.
- Laptop and mobile must be on the same Wi-Fi for Expo to connect.

---

## Running the App

Start Expo:
```bash
npx expo start
```
Then choose:

| Platform | Method |
|----------|--------|
| Browser | Press `w` |
| Android Device | Scan Expo QR Code |

---

## Application Flow

### Authentication

- Users sign up with name, email, and password.
- Login returns a JWT token stored in AsyncStorage.
- Returning users skip login due to session restore.

### Profile

- Displays email, name, and bio.
- Allows update with instant validation and strength scoring.

### Error Handling

- Validation warnings for missing or bad input.
- Network failure detection.
- Custom toast-style alerts for success, info, and errors.

---

## Screenshots

Desktop | Mobile
--------|--------
![Desktop View](sample/Screenshots_browser/web-login.png) | ![Mobile View](sample/Screenshots_mobile/login.jpeg)

---

## Demo Video

The demonstration recording is located at:  
[Click to open demo video](sample/Demo.mp4)

---

## Time Spent

| Task | Estimated Duration |
|------|--------------------|
| Expo & TypeScript Setup | 3 hr |
| UI | 5 hrs |
| backend debugging | 3 hrs |
| Debugging (Web + Mobile) | 5 hrs |
| Documentation + Cleanup | 4 hr |

Total Estimated Time: **20 hours**

---

## Future Improvements

- Add Forgot Password + Email OTP
- Add Language Switching + Theme Mode
- Deploy Backend + Frontend for public cloud testing
- Convert reusable elements into UI component library
