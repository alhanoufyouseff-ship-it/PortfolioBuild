 🚀 PortfolioBuild - Interactive Portfolio Builder
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FontAwesome](https://img.shields.io/badge/Font_Awesome-6-528DD7?style=for-the-badge&logo=font-awesome&logoColor=white)](https://fontawesome.com/)
An interactive, high-performance web application designed for university students, software engineers, and tech innovators to craft and publish personal developer portfolios in minutes.
---
## ✨ Key Features
### 1. 🛠️ Dynamic Profile Builder
- **Personal Information:** Full Name, Bio, Education/University, and direct profile picture upload with instant preview.
- **Technical Skills:** Interactive tag-based technical skill badges.
- **Featured Projects:** Showcase projects with titles, descriptions, tech stack tags, local image uploads, and external live demo links.
- **Work Experience & Internships:** Chronological career timeline with role descriptions.
- **Certificates & Accreditations:** Display verified certificates, issuers, completion years, and badge visuals.
- **Volunteering & Student Clubs:** Dedicated section highlighting leadership, student club affiliations, and organization logos.
- **Contact Channels:** Direct interactive buttons for Email, Phone, LinkedIn, and GitHub.
### 2. 🔗 LinkedIn Quick Sync Simulation
- Optional one-click **LinkedIn Sync** assistant with a realistic multi-step progress animation.
- Automatically populates rich developer profile data while keeping all fields 100% editable.
### 3. 🎨 Real-Time Live Customizer
- **5 Visual Themes:**
  - `Modern Glass`: Sleek glassmorphism with subtle backdrop blur.
  - `Minimal Clean`: Crisp borders with high contrast.
  - `Creative Glow`: Developer neon glow with dynamic drop shadows.
  - `Professional`: Corporate classic elegance.
  - `Dark Cyber`: Futuristic cyberpunk dark mode with accented geometry.
- **6 Color Palettes:** Ocean Blue, Deep Purple, Blue + Purple, Emerald Green, Neon Pink, and Monochrome.
- **Bilingual & Bi-directional:** Seamless real-time switching between **Arabic (RTL)** and **English (LTR)** typography and layouts.
### 4. 🧠 Interactive AI Neural Network Canvas
- Physics-based **HTML5 Canvas** particle engine reacting dynamically to mouse cursor motion.
- Euclidean distance calculation with dynamic connecting rays and live synchronization with the active theme color palette.
### 5. 🚀 Publishing & Sharing Ecosystem
- **Local SQLite Database:** Fully persistent relational database (`database.db`) for high performance and privacy.
- **Confetti Celebration:** Canvas Confetti explosion effect upon successful publishing.
- **Unique Shareable URLs:** Generates clean permalinks (e.g., `/p/your-name`).
- **QR Code Sharing:** Auto-generated QR code for instant mobile viewing.
- **Zero-Emoji Professional UI:** Pure vector icon system using **FontAwesome 6**.
---
## 🛠️ Tech Stack
| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Python 3.12, Flask 3.1.3, Werkzeug |
| **Database** | SQLite3 (Built-in Relational Storage) |
| **Media Storage** | Local File System (`/uploads`) |
| **Frontend Framework** | Vanilla ES6+ JavaScript, Modular State Architecture |
| **Styling & UI** | Tailwind CSS, Glassmorphism, CSS Variables |
| **Interactive Canvas** | HTML5 Canvas API (Particle Physics Engine) |
| **Icons & Visuals** | FontAwesome 6 Vector Icons |
| **Animations** | Canvas Confetti Library |
---
## 📁 Project Structure
```bash
PortfolioBuild/
├── app.py                     # Flask REST API, SQLite ORM & Routes
├── database.db                # SQLite database storing published portfolios
├── uploads/                   # Local storage for uploaded images & media
├── static/
│   ├── css/
│   │   └── style.css          # Design system, themes, and RTL/LTR styles
│   ├── js/
│   │   ├── neural-canvas.js   # Interactive AI neural particle engine
│   │   ├── customizer.js      # Real-time theme, color, and language state
│   │   ├── builder.js         # Form collections & live preview sync
│   │   ├── linkedin-sync.js   # LinkedIn sync simulation module
│   │   └── app.js             # Main application orchestrator & publish flow
│   └── assets/
│       └── sample/            # Default vector assets & badges
└── templates/
    ├── index.html             # Main SPA (Welcome, Builder & Preview)
    └── portfolio.html         # Standalone published portfolio viewer (/p/:slug)
🚀 Quick Start Guide
Prerequisites
Python 3.10+
pip package manager
1. Clone the Repository
bash


git clone https://github.com/your-username/PortfolioBuild.git
cd PortfolioBuild
2. Install Dependencies
bash


pip install flask
3. Run the Application
bash


python app.py
4. Open in Browser
Visit http://127.0.0.1:5000 (or access from your mobile device via your local network IP).

🗄️ Database Schema
The local SQLite database schema includes:

Users: Profile credentials, bio, education, skills, social links, active theme, and language.
Projects: Project details, tech stack, image paths, and demo URLs.
Experiences: Career timeline, job titles, companies, and roles.
Certificates: Certifications, issuing bodies, years, and badge assets.
Volunteering: Student clubs, leadership roles, durations, and club logos.
