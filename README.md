🌟 Profile Management System — Frontend

Modern React Native + Expo + TypeScript application for managing user profiles with full authentication, JWT session handling, and a clean animated UI.

This frontend communicates with a FastAPI backend and supports both web and Android (via Expo Go).

📑 Table of Contents
Section
🚀 Features
🧰 Tech Stack
📦 Project Structure
⚙️ Setup & Installation
🔗 API Configuration
▶️ Running the App
📱 App Workflow
🎨 UI & UX Enhancements
🧪 Known Issues & Fixes
📂 Demo & Screenshots
⏱ Development Time
📜 License
🚀 Features
Feature	Status
🔐 User Signup & Login	✅
🔑 JWT Authentication	✅
💾 Local Session Storage (AsyncStorage)	✅
👤 Profile View & Update	✅
✨ UI Animations (Fade, Scale, Button Press)	✅
📱 Responsive Layout (Mobile + Web)	✅
🧪 Error Handling (Network/Validation/UI Messages)	✅
⭐ Bonus: Profile Strength Meter	✔️ Completed
🧰 Tech Stack
Category	Technology
Framework	React Native (Expo)
Language	TypeScript
API Client	Fetch
Storage	AsyncStorage
UI	Custom styles + animated interactions
Animation	Animated API
Platform Support	Web + Android
📦 Project Structure
profile-management-frontend/
│
├── sample/                # Screenshots & demo video  
├── assets/               # Fonts, icons (optional)
├── api.ts                # Base API configuration
├── App.tsx               # Main application logic
├── package.json
├── tsconfig.json
└── README.md

⚙️ Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/sejalsharma2002/profile-management-frontend.git
cd profile-management-frontend

2️⃣ Install Dependencies
npm install

🔗 Configure Backend URL

Edit api.ts:

import { Platform } from "react-native";

let API_BASE = "http://127.0.0.1:8000"; // Web

if (Platform.OS === "android") {
  API_BASE = "http://YOUR_LOCAL_IP:8000";
}

export { API_BASE };


👉 Find your local IP:

Windows:

ipconfig


Use something like: 192.168.xxx.xxx

📌 Phone and laptop must be on the same Wi-Fi network.

▶️ Running the App

Start the development server:

npx expo start


Then choose:

Platform	Action
🌐 Web	press w
📱 Android device	scan QR code in Expo Go
📱 Android emulator	press a
📱 App Flow

Sign Up

Creates a new user in backend (POST /auth/signup)

Login

Backend returns access token

Token stored in AsyncStorage

Automatically Load Profile

Fetches user details using token

Edit Profile

Update name & bio with feedback states

Logout

Clears token + resets UI

🎨 UI & UX Details
Enhancement	Description
Fade-in transitions	Smooth screen content change
Button press animation	Scale + shadow feedback
Glassmorphism card	Dark blurred layered UI
Background blobs	Soft neon gradient aesthetic
Toast messages	Error, info, success banners
Profile strength meter	Dynamic score feedback
🧪 Known Issues & Fixes
Issue	Fix
❌ Network error on Android	Use local IP instead of 127.0.0.1
❌ Token not restoring	Ensure AsyncStorage permission OK
❌ Expo Go reload bug	Restart Expo + backend
📂 Demo

📁 Screenshots & full walkthrough video available in:

/sample/
    ├── demo.mp4
    ├── login.png
    ├── signup.png
    ├── profile.png

⏱ Development Time Breakdown
Task	Time
RN + Expo setup	~2 hrs
UI & layout	~3 hrs
API integration	~3 hrs
Token/session logic	~2 hrs
Styling + animations	~2 hrs
Debugging (web vs mobile)	~2 hrs

Total estimated: ~14–15 hours

📜 License

📝 MIT License — free to use & modify.