# Eyego Dashboard (SmartPharma)

A professional dashboard for managing a pharmacy network (PharmaTrack/SmartPharma). It provides comprehensive control over pharmacy data, statistics, and user management, with a modern and user-friendly interface.

## ✨ Main Features
- Secure authentication with email and password (Firebase Auth)
- Interactive dashboard with statistics and charts (Chart.js)
- Pharmacy data management (add/edit/search)
- User notifications and alerts
- Fully responsive design for all devices
- High performance and fast navigation (Framer Motion, Next.js)

## 🛠️ Tech Stack
- **Next.js** (App Router)
- **React** & **Redux Toolkit** for state management
- **Firebase** (Authentication & Storage)
- **Chart.js** & **react-chartjs-2** for data visualization
- **Tailwind CSS** for UI styling
- **Framer Motion** for animations
- **React Icons** & **Heroicons** for icons
- **React Toastify** for notifications

## ⚙️ Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd eyego-dashboard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Create a `.env.local` file in the root directory if you want to override Firebase config or add API keys.
   - By default, Firebase config is set in `app/firebase/config.ts`. For production, update it as needed.
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```
5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

> You can edit the main page in `app/page.tsx` or the dashboard pages in `app/dashboard/page.tsx`.

## 📦 Build & Deploy
- To build for production:
  ```bash
  npm run build
  ```
- Deploy on Vercel or any platform that supports Next.js.

## 📚 Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

> Developed for Smart Pharma Net. All rights reserved.