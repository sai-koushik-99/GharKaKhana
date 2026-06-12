# HomeBite 🍛

> **Ghar ka swad, door tak** — Home taste, far away.

A platform that connects home chefs (housewives) with customers who want affordable, trustworthy home-cooked meals.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT (30-day tokens) |
| Images | Cloudinary |
| Validation | express-validator |

---

## Project Structure

```
GharKaKhana-main/
├── backend/          # Express REST API
│   ├── config/       # DB + Cloudinary config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, validation, upload
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   └── server.js
├── frontend/         # React SPA
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

See `backend/.env.example` for all required variables.

---

## Deployment

- **Frontend** → Vercel (set `VITE_API_BASE_URL` to your backend URL)
- **Backend** → Render (set all env vars from `.env.example`)
- **Database** → MongoDB Atlas (free M0 cluster)
