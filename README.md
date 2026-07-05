# Tejankit Tech — Smart LMS / Internship Platform (MVP)

MERN stack (MongoDB, Express, React, Node). This is a working core MVP:
auth, internship enrollment, course modules (video + notes), assignments,
submissions, attendance, auto-issued certificates with QR verification,
admin + mentor dashboards, and a leaderboard/daily-challenge layer. Two
"extraordinary" features are wired in as optional AI add-ons: an AI doubt
assistant and an AI assignment evaluator (both call the Anthropic API and
degrade gracefully if no key is set).

## Project structure

```
tejankit-lms/
  backend/     Express API + MongoDB models
  frontend/    React (Vite) app
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — a local MongoDB instance, or a free MongoDB Atlas cluster
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — where your frontend runs (used for CORS and certificate QR links)
- `ANTHROPIC_API_KEY` — optional, enables the AI doubt assistant, AI evaluator,
  and quiz generation. Without it, those features return a friendly
  "not configured yet" message instead of failing.

Run it:
```bash
npm run dev     # nodemon, auto-restarts
# or
npm start
```
API runs on `http://localhost:5000/api` by default.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`. If your API isn't on `localhost:5000`,
create `frontend/.env` with:
```
VITE_API_URL=https://your-api-domain.com/api
```

## 3. Creating your first admin & mentor

There's no public admin signup (by design). Two ways to get started:

**Option A — promote via MongoDB directly** (fastest for a first admin):
Register a normal account through the UI, then in `mongo shell` / Compass:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

**Option B — once you have one admin**, use `POST /api/auth/create-staff`
(admin-only) to create mentor or admin accounts going forward.

## 4. Core user flows already built

- **Student**: register → browse `/internships` → enroll → work through
  modules & assignments on `/course/:internshipId/:enrollmentId` → mark daily
  attendance → get graded → auto-eligible for a certificate once progress
  hits 100%.
- **Mentor**: `/mentor` → create/publish an internship → add modules
  (video URL + notes) and assignments → review submissions, grade manually
  or pull an AI-suggested score/feedback → issue certificates to students
  who've completed the track.
- **Admin**: `/admin` → platform-wide stats, user list (activate/deactivate),
  oversight of every internship regardless of status.
- **Anyone**: `/verify` or the QR code on a certificate → public,
  no-login verification of a certificate ID.

## 5. What's stubbed vs. what's real

Real and working: auth/roles, enrollment, modules, assignments, manual
grading, attendance, progress tracking, certificate issuance + QR + public
verification, admin/mentor dashboards, leaderboard endpoint.

Intentionally left as clean extension points for your next milestone:
- **Payments** — `Enrollment.paymentStatus` exists; wire up Razorpay/Stripe
  in `enrollmentController.enrollInInternship` before flipping paid
  internships live.
- **File uploads** — submissions accept a `fileUrl` string today; add
  `multer` + S3/Cloudinary storage to accept real file uploads instead of
  links.
- **Auto quiz generation** — endpoint exists (`POST /api/ai/quiz/:moduleId`)
  but there's no quiz-taking UI yet; the data shape is ready to build against.
- **Recruiter/student portfolio showcase** — `User.portfolioLinks` and
  `skills` fields exist; a public profile page is the natural next page to add.

## 6. Deploying

- Backend: any Node host (Render, Railway, Fly.io) + MongoDB Atlas.
- Frontend: `npm run build` in `frontend/`, deploy the `dist/` folder to
  Vercel, Netlify, or Cloudflare Pages. Point `VITE_API_URL` at your deployed
  backend.
