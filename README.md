# ResQNet — AI-Powered Disaster Response Coordination System

ResQNet is a high-performance, real-time disaster management platform designed to connect citizens and emergency response teams (Police, Fire, Medical) through a unified, AI-driven interface.

## 🚀 Key Features

- **🚨 Citizen Portal:** Report emergencies with AI-powered image analysis, auto-location detection, and real-time status tracking.
- **🛡️ Emergency Command Center:** A "government-grade" dashboard for response teams featuring a live incident map, smart unit dispatch, and mission-mode coordination.
- **⚡ Real-time Updates:** Powered by Socket.io for instantaneous communication between citizens and responders.
- **🧠 AI Assistance:** Automatic severity detection and incident categorization to prioritize critical life-saving missions.
- **🎨 Premium Aesthetic:** A sophisticated, ultra-modern dark theme with "Linear-style" design, aurora mesh gradients, and glassmorphism.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, React Leaflet.
- **Backend:** Node.js, Express, Socket.io, JWT, Bcrypt.
- **Database:** Supabase (PostgreSQL).

## 📂 Project Structure

```text
disaster-management/
├── frontend/           # React + Vite application
├── backend/            # Node.js + Express API server
└── database/           # SQL schemas and migration files
```

## ⚙️ Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor**.
3. Copy the contents of `database/schema.sql` and run them to initialize your tables (`citizens`, `teams`, `incidents`, `batch_records`).

### 2. Backend Setup
1. Navigate to the `backend/` directory.
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_jwt_secret
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

## 🎨 Design Philosophy

ResQNet prioritizes **Visual Excellence** and **Operational Clarity**:
- **Monochromatic Sophistication:** Deep black backgrounds with subtle white/grey borders for a professional, non-distracting environment.
- **Vibrant Accents:** High-contrast neon accents only for critical information and primary actions.
- **Glassmorphism:** Multi-layered translucent panels to create depth and focus.

---
Built with ❤️ for Resilient Communities.
