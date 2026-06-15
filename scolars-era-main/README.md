# 🎓 Scolars Fix — Full-Stack MERN Application

> A production-ready educational platform built with Node.js, Express, MongoDB, and a fully-functional admin panel. Migrated from a static HTML site to a secure, scalable single-origin architecture.

---

## 📁 Project Structure

```
scolars-era/
├── backend/
│   ├── server.js                 ← HTTP server + graceful shutdown
│   ├── app.js                    ← Express app (security, middleware, routes)
│   ├── config/
│   │   └── database.js           ← MongoDB connection with retry logic
│   ├── controllers/
│   │   ├── authController.js     ← Register, login, logout, getMe
│   │   ├── contactController.js  ← Contact form submit, admin read/update
│   │   ├── coursesController.js  ← CRUD for courses
│   │   ├── testimonialsController.js
│   │   └── universitiesController.js
│   ├── middleware/
│   │   ├── auth.js               ← JWT protect + role-based restrictTo()
│   │   ├── errorHandler.js       ← Global error handler + notFound
│   │   ├── rateLimiter.js        ← API / auth / contact rate limits
│   │   └── securityHeaders.js    ← HSTS, Referrer-Policy, Permissions-Policy
│   ├── models/
│   │   ├── Contact.js            ← Contact form submissions
│   │   ├── Course.js             ← Course catalogue (slug auto-generated)
│   │   ├── Testimonial.js        ← Student reviews
│   │   ├── University.js         ← Partner universities
│   │   └── User.js               ← Auth users (bcrypt hashed passwords)
│   ├── routes/
│   │   ├── admin.js              ← All /api/admin/* (protected)
│   │   ├── auth.js               ← /api/auth/*
│   │   ├── contact.js            ← /api/contact
│   │   ├── courses.js            ← /api/courses
│   │   ├── testimonials.js       ← /api/testimonials
│   │   └── universities.js       ← /api/universities
│   ├── services/
│   │   ├── emailService.js       ← Nodemailer (admin + confirmation emails)
│   │   └── recaptchaService.js   ← Google reCAPTCHA v3 verification
│   └── utils/
│       ├── AppError.js           ← Custom operational error class
│       ├── logger.js             ← Winston logger (console + file)
│       └── seeder.js             ← DB seeder (--import / --delete)
│
├── frontend/
│   ├── index.html                ← Main landing page (dynamic courses, testimonials)
│   ├── about.html                ← About page
│   ├── services.html             ← Services page
│   ├── university.html           ← Universities listing (dynamic via API)
│   ├── course1.html              ← Course detail page
│   ├── b-ed-course.html          ← B.Ed course page
│   ├── b-sc-course.html          ← B.Sc course page
│   ├── m-ed-course.html          ← M.Ed course page
│   ├── m-sc-course.html          ← M.Sc course page
│   ├── m-tech-course.html        ← M.Tech course page
│   ├── admin/
│   │   ├── index.html            ← Admin login page
│   │   ├── dashboard.html        ← Stats overview + recent inquiries
│   │   ├── contacts.html         ← View/filter/update contact inquiries
│   │   ├── courses.html          ← Add/edit/delete courses
│   │   ├── universities.html     ← Add/edit/delete universities
│   │   └── testimonials.html     ← Add/edit/delete/feature testimonials
│   └── assets/
│       ├── css/
│       │   ├── style.css         ← Main stylesheet (original + additions)
│       │   └── university.css    ← University page styles
│       ├── js/
│       │   ├── api.js            ← Shared API helper (window.ScolarAPI)
│       │   ├── main.js           ← GSAP animations, navbar, scroll
│       │   ├── contact.js        ← Contact form validation + submission
│       │   ├── courses.js        ← Dynamic course grid loader
│       │   ├── testimonials.js   ← Dynamic testimonials loader
│       │   ├── universities.js   ← Dynamic universities loader
│       │   └── course-detail.js  ← Enroll button handler
│       └── images/               ← All site images (*.jpeg, *.jpg)
│
├── package.json
├── .env.example
├── .env                          ← Your actual config (never commit)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js 20+** — [Download](https://nodejs.org)
- **MongoDB 7+** — Local install or Docker (see below)
- **npm 9+** — Comes with Node.js

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd scolars-era
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` with your values:

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 3000) | No |
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | ✅ Yes |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) | No |
| `SMTP_HOST` | Email server host | For email |
| `SMTP_USER` | SMTP username | For email |
| `SMTP_PASS` | SMTP password / app password | For email |
| `ADMIN_EMAIL` | Where contact form emails go | For email |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret | Optional |

### 3. Start MongoDB

**Option A — Docker (recommended):**
```bash
docker-compose up mongo -d
```

**Option B — Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

### 4. Seed the Database
```bash
npm run seed
```
This creates:
- 6 partner universities
- 6 courses (B.Ed, M.Ed, B.Sc, M.Sc, M.Tech, General)
- 8 testimonials (4 featured)
- 1 admin user: `admin@scolarsfix.com` / `Admin@Scolars1`

> ⚠️ **Change the default admin password immediately after first login!**

### 5. Start the Dev Server
```bash
npm run dev
```

### 6. Open in Browser
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/index.html

---

## 🖥️ Admin Panel Guide

### Login
Navigate to `http://localhost:3000/admin/index.html`

| Field | Value |
|---|---|
| Email | `admin@scolarsfix.com` |
| Password | `Admin@Scolars1` |

### Admin Pages

| Page | URL | What you can do |
|---|---|---|
| Dashboard | `/admin/dashboard.html` | View stats, recent inquiries |
| Contacts | `/admin/contacts.html` | View inquiries, change status, reply via email |
| Courses | `/admin/courses.html` | Add/edit/delete/toggle courses |
| Universities | `/admin/universities.html` | Add/edit/delete partner universities |
| Testimonials | `/admin/testimonials.html` | Add/edit/delete/feature testimonials |

### Managing Contacts
1. Go to **Contacts** in the sidebar
2. Filter by status: All / New / Read / Replied / Spam
3. Change status via the dropdown in each row
4. Click **View** to see the full message and reply via email

### Managing Courses
1. Go to **Courses** in the sidebar
2. Click **Add Course** to create a new one
3. Click **Edit** to modify an existing course
4. Click **Deactivate** to hide a course from the website
5. Click **Delete** to permanently remove a course

---

## 🔌 API Reference

All API responses follow this format:

```json
// Success
{ "success": true, "message": "...", "data": {}, "meta": {} }

// Error
{ "success": false, "message": "...", "errors": { "field": "message" } }
```

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | Get all active courses (filter: `category`, `level`, `isFree`, `page`, `limit`) |
| `GET` | `/api/courses/:slug` | Get single course by slug |
| `GET` | `/api/universities` | Get all active universities |
| `GET` | `/api/universities/:slug` | Get single university |
| `GET` | `/api/testimonials` | Get testimonials (filter: `?featured=true`) |
| `POST` | `/api/contact` | Submit contact form |
| `POST` | `/api/auth/login` | Admin/user login → returns JWT |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/auth/me` | Get current user (requires auth) |

### Admin Endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard stats |
| `GET` | `/api/admin/contacts` | List all contacts (paginated) |
| `PATCH` | `/api/admin/contacts/:id/status` | Update contact status |
| `POST` | `/api/admin/courses` | Create a course |
| `PUT` | `/api/admin/courses/:id` | Update a course |
| `DELETE` | `/api/admin/courses/:id` | Delete a course |
| `POST` | `/api/admin/universities` | Create a university |
| `PUT` | `/api/admin/universities/:id` | Update a university |
| `DELETE` | `/api/admin/universities/:id` | Delete a university |
| `GET` | `/api/admin/testimonials` | List all testimonials |
| `PATCH` | `/api/admin/testimonials/:id` | Update/feature a testimonial |
| `DELETE` | `/api/admin/testimonials/:id` | Delete a testimonial |

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| **HTTPS Headers** | `helmet` with full Content Security Policy |
| **HSTS** | `Strict-Transport-Security: max-age=31536000` (production) |
| **Rate Limiting** | 100 req/15min (API), 5 req/hr (contact form), 10 req/15min (auth) |
| **NoSQL Injection** | `express-mongo-sanitize` strips `$` and `.` from inputs |
| **XSS Protection** | `xss-clean` sanitizes HTML entities in request body |
| **Password Hashing** | `bcryptjs` with cost factor 12 |
| **JWT Auth** | httpOnly cookies + Bearer header support |
| **RBAC** | Role-based access (`admin` / `student`) via `restrictTo()` middleware |
| **Input Validation** | `express-validator` on all form endpoints |
| **CORS** | Configured from `ALLOWED_ORIGINS` env var only |
| **Body Size Limit** | 10kb max request body size |
| **Error Sanitization** | Stack traces never exposed in production |

---

## 🐳 Docker Deployment

### Start All Services
```bash
docker-compose up -d
```

This starts:
- `app` — Node.js server on port 3000
- `mongo` — MongoDB 7 on port 27017
- `mongo-express` — DB admin UI on port 8081 (admin/admin123)

### Seed after Docker start
```bash
docker-compose exec app node backend/utils/seeder.js --import
```

### MongoDB Connection String for Docker
```
MONGODB_URI=mongodb://root:rootpassword@mongo:27017/scolars-era?authSource=admin
```

---

## 🚀 Production Deployment (Ubuntu VPS)

### Step 1 — Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 2 — Install MongoDB 7
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable mongod && sudo systemctl start mongod
```

### Step 3 — Deploy App
```bash
sudo mkdir -p /var/www/scolars-era
cd /var/www/scolars-era
git clone <your-repo-url> .
npm install --omit=dev
cp .env.example .env
nano .env   # Set NODE_ENV=production, real SMTP, MongoDB URI
npm run seed
```

### Step 4 — PM2 Process Manager
```bash
npm install -g pm2
pm2 start backend/server.js --name scolars-era
pm2 startup && pm2 save
```

### Step 5 — Nginx Reverse Proxy
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/scolars-era
```

Nginx config:
```nginx
server {
    listen 80;
    server_name scolarsfix.com www.scolarsfix.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/scolars-era /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Step 6 — SSL Certificate (Free)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d scolarsfix.com -d www.scolarsfix.com
```

---

## 🗄️ Database Management

### Seed (add data)
```bash
npm run seed
```

### Clear all data
```bash
npm run seed:delete
```

### Connect to MongoDB shell
```bash
mongosh "mongodb://localhost:27017/scolars-era"
```

---

## 📊 Logs

In development, all logs go to console.

In production, Winston writes to:
- `backend/logs/combined.log` — all levels
- `backend/logs/error.log` — errors only

---

## 📧 Email Configuration (Gmail)

1. Go to **Google Account → Security → App Passwords**
2. Generate a new app password for "Mail"
3. Set in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password
ADMIN_EMAIL=admin@scolarsfix.com
```

---

## 🏗️ How It Works — Architecture Overview

```
Browser Request
     │
     ▼
Express (port 3000)
     │
     ├─ Static files ──► frontend/ (HTML, CSS, JS, images)
     │                   No CORS issues. Same origin.
     │
     └─ /api/* routes
          │
          ├─ Rate limiter
          ├─ Auth middleware (JWT verify)
          │
          ├─ /api/courses       ──► MongoDB (courses collection)
          ├─ /api/universities  ──► MongoDB (universities collection)
          ├─ /api/testimonials  ──► MongoDB (testimonials collection)
          ├─ /api/contact       ──► MongoDB + Email (Nodemailer)
          ├─ /api/auth          ──► MongoDB (users collection) + JWT
          └─ /api/admin         ──► Protected CRUD for all collections
```

**Why single-origin?**
- Express serves both frontend AND API from port 3000
- No CORS configuration needed for the frontend
- All `/assets/...` paths resolve correctly
- Admin panel and public site share the same domain

---

## 🛠️ Common Commands

```bash
npm run dev          # Start dev server with nodemon (auto-restart)
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run seed:delete  # Clear all seeded data
```

---

## 🔐 Default Credentials

| Type | Email | Password |
|---|---|---|
| Admin | `admin@scolarsfix.com` | `Admin@Scolars1` |

> ⚠️ **Change the admin password immediately** in production. You can update it via MongoDB shell:
> ```js
> db.users.updateOne({email:"admin@scolarsfix.com"},{$set:{password:"<bcrypt_hash>"}})
> ```
> Or implement a "Change Password" endpoint.

---

## 📝 Environment Variables Reference

See `.env.example` for full list with inline comments.

---

*Built with ❤️ for Scolars Fix. For support, contact admin@scolarsfix.com.*
