# Profile Management System — Frontend

![GitHub stars](https://img.shields.io/github/stars/sejalsharma2002/profile-management-frontend?style=flat)
![GitHub issues](https://img.shields.io/github/issues/sejalsharma2002/profile-management-frontend)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A cross-platform Profile Management application built using **React Native (Expo)** and **TypeScript**, supporting:

- Web (Desktop + Responsive Mode)
- Android (via Expo Go App)

This frontend communicates securely with the FastAPI backend using JWT authentication.

> This project is part of a full-stack assignment. It demonstrates modern UI practices, client-side authentication management, responsive design, and a smooth user experience.

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
| API Communication | Fetch (with response handling + typed objects) |
| Animation | React Native Animated API |

---

## Architecture Decisions

- **JWT stored in AsyncStorage** to persist login after app close.
- **Reusable UI components** (`Button`, `Input`, `Tab`) ensure clean code organization.
- **API abstraction (`api.ts`)** enables switching between mobile and web environments automatically.
- **Animated screen switching** improves UX without heavy libraries.
- **Client-side validation and real-time feedback**, including live profile strength scoring, reduces backend load.

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

### Optional / Pending
- [ ] Password reset system
- [ ] Deployment-ready build script

---

## Setup Instructions

### 1. Clone Repository

git clone https://github.com/sejalsharma2002/profile-management-frontend.git
cd profile-management-frontend

shell
Copy code

### 2. Install Dependencies

npm install

yaml
Copy code

---

## Environment Setup

Update `api.ts` to choose correct backend URL:
import { Platform } from "react-native";

let API_BASE = "http://127.0.0.1:8000"; // for web and emulator

if (Platform.OS === "android") {
API_BASE = "http://YOUR_LOCAL_IP:8000";
}

export { API_BASE };


Notes:

- Replace `YOUR_LOCAL_IP` with your laptop's network IP.
- Laptop and mobile must be on the same Wi-Fi for Expo to connect.

---

## Running the App

Start Expo:

npx expo start

yaml
Copy code

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

Desktop Login UI:  
`sample/desktop.png`

Mobile View UI:  
`sample/mobile.jpg`

Add image inside GitHub using:



yaml
Copy code

---

## Demo Video

The demonstration recording is located at:  
[Click to open demo video](sample/Demo.mp4)

---

## Time Spent

| Task | Estimated Duration |
|------|--------------------|
| Expo & TypeScript Setup | 1 hr |
| UI Layout + Styling | 3 hrs |
| Authentication Logic | 3 hrs |
| Profile Management | 2 hrs |
| Bonus Features | 1 hr |
| Debugging (Web + Mobile) | 2 hrs |
| Documentation + Cleanup | 1 hr |

Total Estimated Time: **13 hours**

---

## Future Improvements

- Add Forgot Password + Email OTP
- Add Language Switching + Theme Mode
- Deploy Backend + Frontend for public cloud testing
- Convert reusable elements into UI component library
