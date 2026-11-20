# Notes App – Full Stack MERN Application

A modern, scalable Notes Application built with React, Vite, TypeScript, Tailwind CSS v4, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```text
Current-Project/
├── client/                     # Frontend: React + Vite + TypeScript + Tailwind CSS v4
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Images and SVG assets
│   │   ├── components/
│   │   │   ├── auth/           # LoginForm and AuthScreen components
│   │   │   └── ui/             # Reusable UI primitives (Button, Input, Card)
│   │   ├── pages/              # LoginPage
│   │   ├── services/
│   │   │   ├── api/            # Centralized Axios HTTP client
│   │   │   └── auth/           # Authentication service
│   │   ├── stores/             # Zustand auth state store
│   │   ├── types/              # TypeScript interface definitions
│   │   ├── utils/              # Helper utilities
│   │   ├── validations/        # Zod validation schemas
│   │   ├── App.tsx             # Root application component rendering Login
│   │   ├── main.tsx            # React application entry point
│   │   └── index.css           # Global Tailwind CSS v4 styling & Plus Jakarta Sans font
│   ├── .env                    # Local environment variables (git-ignored)
│   ├── .env.example            # Environment template
│   ├── .gitignore              # Client git ignores
│   ├── tsconfig.json           # Root TypeScript configuration
│   ├── vite.config.ts          # Vite build config with Tailwind v4 & aliases
│   ├── eslint.config.js        # ESLint flat configuration
│   ├── .prettierrc             # Prettier rules
│   └── package.json            # Client dependencies and scripts
│
├── server/                     # Backend: Node.js + Express + MongoDB (ES Modules)
│   ├── src/
│   │   ├── config/             # Database (Mongoose), env.js, Pino logger.js
│   │   ├── modules/
│   │   │   └── auth/           # Routes, controller, service, repository, validation
│   │   ├── models/             # User Mongoose model
│   │   ├── middleware/         # Authenticate, errorHandler, notFound, rateLimiter, validate, requestLogger
│   │   ├── utils/              # ApiError, ApiResponse, asyncHandler, tokenUtils
│   │   ├── app.js              # Express app setup with middleware pipeline
│   │   └── server.js           # Server bootstrap & graceful shutdown
│   ├── logs/                   # Log directory (git-ignored)
│   ├── .env                    # Local environment variables (git-ignored)
│   ├── .env.example            # Environment template
│   ├── .gitignore              # Server git ignores
│   └── package.json            # Server dependencies and scripts
│
├── .gitignore                  # Root git ignores (.env files ignored, .env.example tracked)
├── package.json                # Root package with unified workspace scripts
└── README.md                   # Project documentation
```

---

## 🛠 Tech Stack

### Frontend (`client/`)
- **Framework:** React 19 + Vite 8
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Lucide React icons
- **State Management:** Zustand
- **Form Handling & Validation:** React Hook Form + Zod (`@hookform/resolvers`)
- **HTTP Client:** Axios with centralized interceptors

### Backend (`server/`)
- **Runtime:** Node.js (ECMAScript Modules `"type": "module"`)
- **Framework:** Express 5
- **Database:** MongoDB via Mongoose
- **Security:** Helmet, CORS, Express Rate Limit, bcrypt
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), Cookie Parser
- **Logging:** Pino + Pino HTTP
- **Validation:** Express Validator

---

## ⚙️ Environment Variables

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/notes_app
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
COOKIE_SECRET=replace_with_a_long_random_secret
```

---

## 🚀 Running the Project

Install dependencies for both packages from the repository root before starting the app:

- npm --prefix client install
- npm --prefix server install

```bash
# Start Frontend (http://localhost:5173)
npm run client:dev

# Start Backend (http://localhost:5000)
npm run server:dev

# Build Frontend
npm run client:build
```
