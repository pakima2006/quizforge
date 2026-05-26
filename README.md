# QuizForge 🧠⚡

**Upload. Parse. Quiz.** — An AI-powered quiz platform that converts `.txt` files into interactive quizzes.

---

## ✨ Features

- 📁 Upload `.txt` files and auto-parse them into quizzes
- 🎮 Interactive quiz player with timer, progress bar, and animated transitions
- 🔀 Randomized answer order every time
- ✅ Instant answer feedback + review screen
- 📊 Score tracking and quiz attempts history
- 🔗 Shareable public quiz links
- 🌙 Dark theme with modern UI
- 💾 Works offline with localStorage fallback (no Supabase needed!)
- 🔐 Supabase Auth (email + password)
- 👤 Guest mode — no account needed

---

## 📝 Quiz File Format

Create a `.txt` file using this format:

```
What is the capital of France?
= Paris
- London
- Berlin
- Madrid

What is 2 + 2?
= 4
- 3
- 5
- 6
```

**Rules:**
- A plain line = question text
- `= Answer` = the **correct** answer (one per question)
- `- Answer` or `* Answer` = **incorrect** answers
- Blank line separates questions
- At least 1 incorrect answer per question required

---

## 🚀 Quick Start (Local)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd quizforge
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

> **No Supabase?** Leave the env vars empty — the app runs in `localStorage` mode automatically. Perfect for local testing!

### 3. Start dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Supabase Setup

### 1. Create a project

Go to [supabase.com](https://supabase.com) → New Project

### 2. Run the SQL script

In your Supabase dashboard → **SQL Editor** → paste and run the contents of `supabase-setup.sql`

This creates:
- `quizzes` table
- `questions` table  
- `quiz_attempts` table
- Row Level Security policies
- Indexes for performance

### 3. Get your keys

**Settings → API** → copy:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 4. Configure Auth

**Authentication → Settings:**
- Site URL: `http://localhost:5173` (local) or your Vercel URL
- Enable email confirmations (optional — disable for easier testing)

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial QuizForge setup"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Vite** (auto-detected)
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` = your Vercel URL
5. Click **Deploy**

### 3. Update Supabase Auth URL

In Supabase → **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## 📂 Project Structure

```
quizforge/
├── public/
│   ├── favicon.svg
│   └── example-quiz.txt        ← Sample quiz file to try
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── CreateQuizModal.jsx
│   │   │   ├── FileUploader.jsx  ← Core parser UI
│   │   │   └── QuizCard.jsx
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   ├── quiz/
│   │   │   ├── QuizPlayer.jsx    ← Main quiz engine
│   │   │   ├── QuizQuestion.jsx
│   │   │   └── QuizResults.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── EmptyState.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       └── Skeleton.jsx
│   ├── hooks/
│   │   ├── useAuth.jsx           ← Auth context
│   │   ├── useQuizzes.js
│   │   └── useTimer.js
│   ├── lib/
│   │   └── supabase.js           ← Supabase client
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── QuizPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── localStorage.js       ← Offline fallback
│   │   └── quizService.js        ← Data abstraction layer
│   ├── utils/
│   │   └── parser.js             ← .txt parser engine
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase-setup.sql            ← Run in Supabase SQL Editor
├── vercel.json
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔧 Adding PDF / DOCX Support (Future)

The parser architecture is designed for extension. To add PDF support:

1. Install a parser: `npm install pdf-parse` or use the PDF.js library
2. Create `src/utils/pdfParser.js` following the same interface as `parser.js`
3. Update `FileUploader.jsx` to accept `.pdf` files and route to the correct parser

---

## 🛟 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Supabase not configured" warning | Add env vars in `.env` — or ignore, app works locally without it |
| Quiz not loading | Check the quiz ID in the URL matches one in your dashboard |
| Parse errors | Check blank lines between questions; each block needs `=` for correct answer |
| Vercel 404 on refresh | `vercel.json` rewrites handle this — make sure it's committed |

---

## 🧩 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Backend | Supabase (Postgres + Auth) |
| Offline | localStorage fallback |
| Toasts | react-hot-toast |
| Icons | lucide-react |
| Hosting | Vercel |

---

Made with ⚡ by QuizForge
