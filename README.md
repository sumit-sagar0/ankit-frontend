# 🎨 Artistic Ankit - Studio Gallery (Frontend)

Welcome to the **Artistic Ankit Studio Gallery** frontend repository! This is a modern, responsive, and dynamic web application built for Ankit, a passionate YouTube anime art creator. The platform serves as a digital exhibition and commission hub where fans can view high-quality physical canvas paintings and request custom artworks.

![Artistic Ankit Hero Banner](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

## ✨ Key Features
- **Dynamic 3D Gallery**: Interactive painting cards with a custom 3D tilt effect on hover.
- **Admin Panel**: A secure, password-protected (`ANKIT2024`) section for the creator to upload, edit, and delete paintings directly from the website.
- **Commission Requests**: A seamless flow for clients to request custom canvas paintings (Anime, Watercolor, Acrylic, etc.).
- **User Authentication**: Simple login/signup system allowing users to track their orders and chat with the artist.
- **WhatsApp Integration**: Direct one-click chat floating button connecting clients straight to Ankit.

## 🛠️ Tech Stack
- **Framework**: Next.js (App & Pages logic via `src/`)
- **Library**: React 19
- **Styling**: Vanilla CSS (Custom design system, glassmorphism, responsive grids)
- **API Calls**: Axios (Connected to Spring Boot backend)

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sumit-sagar0/ankit-frontend.git
   cd sartisticankit-next
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Ensure your `.env.local` is set with the correct backend URL.
   ```env
   NEXT_PUBLIC_API_URL=https://ankit-backend-yxoi.onrender.com
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🌐 Live Website
The frontend is continuously deployed on **Vercel**. Any push to the `main` branch automatically triggers a new build.

---
*Crafted with 💙 for the Anime Art community.*
