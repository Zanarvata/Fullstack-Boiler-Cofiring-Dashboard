# 🚀 Deployment Guide

Complete step-by-step guide untuk deploy aplikasi Boiler Cofiring ke production.

## 📋 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (Vercel)                                      │
│  - React + Vite                                         │
│  - Auto-deploy from Git                                 │
│  - CDN distribution                                     │
│  URL: https://boiler-cofiring.vercel.app               │
└────────────────┬────────────────────────────────────────┘
                 │ HTTPS API Calls
┌────────────────▼────────────────────────────────────────┐
│  BACKEND (Render)                                       │
│  - Node.js + Express                                    │
│  - Auto-deploy from Git                                 │
│  - Health checks                                        │
│  URL: https://boiler-backend.onrender.com              ��
└────────────────┬────────────────┬───────────────────────┘
                 │                │
         ┌───────▼──────┐  ┌──────▼──────┐
         │ PostgreSQL   │  │  ML Service │
         │ (Railway)    │  │  (Railway)  │
         └──────────────┘  └─────────────┘
```

---

## 🎯 Part 1: Frontend Deployment (Vercel)

### Prerequisites
- GitHub/GitLab account
- Vercel account (free tier)

### Step 1: Prepare Frontend for Production

**1.1. Update environment variables**

Create `.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_ML_API_URL=https://your-ml-service.railway.app
```

**1.2. Build test**
```bash
npm run build
npm run preview  # Test production build locally
```

**1.3. Create `vercel.json`**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git Repository
4. Select your repo
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_API_URL`
   - `VITE_ML_API_URL`
7. Click "Deploy"

**Step 3: Configure Custom Domain (Optional)**

1. Go to Project Settings → Domains
2. Add your domain: `boiler.yourdomain.com`
3. Configure DNS (add CNAME record)
4. SSL automatically provisioned

---

## 🔧 Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend

**1.1. Create `render.yaml`**

```yaml
services:
  # Backend API
  - type: web
    name: boiler-backend
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: CLIENT_URL
        sync: false
      - key: DATABASE_URL
        fromDatabase:
          name: boiler-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: ML_SERVICE_URL
        sync: false

databases:
  - name: boiler-db
    databaseName: boiler_cofiring
    user: boiler_user
    region: singapore
    plan: free
    ipAllowList: []
```

**1.2. Update `package.json`**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.x"
  }
}
```

**1.3. Create `.env.example`**

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_secret_here
ML_SERVICE_URL=https://your-ml-service.railway.app
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up / Login
3. Click "New +" → "Blueprint"
4. Connect GitHub repository
5. Render auto-detects `render.yaml`
6. Click "Apply"
7. Set environment variables:
   - `CLIENT_URL`: Your Vercel URL
   - `ML_SERVICE_URL`: ML service URL
8. Deploy!

**Monitor deployment:**
- Check Logs tab for errors
- Test `/health` endpoint
- Verify database connection

### Step 3: Database Setup

**3.1. Access PostgreSQL**

```bash
# Get connection string from Render dashboard
psql <DATABASE_URL>
```

**3.2. Run migrations**

```sql
-- Create tables (from BACKEND_GUIDE.md)
CREATE TABLE users (...);
CREATE TABLE boiler_data (...);
CREATE TABLE ml_predictions (...);
-- etc.
```

**3.3. Seed initial data**

```bash
npm run seed  # If you have a seed script
```

---

## 🤖 Part 3: ML Service Deployment (Railway)

### Step 1: Prepare ML Service

**1.1. Create `Dockerfile`**

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directory for models
RUN mkdir -p saved_models

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**1.2. Create `railway.json`**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "uvicorn app:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**1.3. Create `.dockerignore`**

```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.pytest_cache/
.coverage
*.log
data/
tests/
```

### Step 2: Deploy to Railway

**Option A: Using Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

**Option B: Using Railway Dashboard (Recommended)**

1. Go to [railway.app](https://railway.app)
2. Sign up / Login
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your ML service repo
6. Railway auto-detects Dockerfile
7. Set environment variables (if needed)
8. Deploy!

**Step 3: Train & Upload Models**

```bash
# Run training locally first
cd ml-service
python training/train_ann.py
python training/train_rsm.py
python training/train_lightgbm.py

# Models saved in saved_models/
# Upload to Railway using volume or S3
```

**Alternative: Train on Railway**

Add to Dockerfile:
```dockerfile
# Run training on first deploy
RUN python training/train_lightgbm.py
```

---

## 🔗 Part 4: n8n Deployment

### Option 1: Docker (Self-hosted)

```bash
# Create docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password
      - N8N_HOST=n8n.yourdomain.com
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.yourdomain.com/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:

# Run
docker-compose up -d
```

### Option 2: n8n Cloud (Easiest)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for free trial
3. Import workflows from `/docs/N8N_WORKFLOWS.json`
4. Configure credentials
5. Activate workflows

### Workflow Setup

```bash
# Import workflows
1. Open n8n UI
2. Click "Import from File"
3. Select N8N_WORKFLOWS.json
4. Configure credentials:
   - HTTP Header Auth (Backend API)
   - Telegram Bot
   - SMTP
   - Slack Webhook
5. Set environment variables
6. Test workflows manually
7. Activate for production
```

---

## 🔐 Part 5: Security & Optimization

### Frontend (Vercel)

**Enable Security Headers**

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Backend (Render)

**Environment Variables Checklist:**
- ✅ `NODE_ENV=production`
- ✅ `JWT_SECRET` (auto-generated)
- ✅ `DATABASE_URL` (from database)
- ✅ `CLIENT_URL` (Vercel URL)
- ✅ Rate limiting enabled
- ✅ CORS properly configured

**Enable Auto-Deploy:**
- Settings → Auto-Deploy: ON
- Deploy on every push to main branch

### Database (Railway)

**Backups:**
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

**Monitoring:**
- Enable query logging
- Set up alerts for slow queries
- Regular vacuum/analyze

---

## 📊 Part 6: Monitoring & Maintenance

### Frontend Monitoring

**Vercel Analytics:**
- Automatically enabled
- View in Dashboard → Analytics

**Custom Logging:**
```javascript
// Add to app
if (import.meta.env.PROD) {
  console.log = () => {};  // Disable console in production
  // Use proper logging service (Sentry, LogRocket)
}
```

### Backend Monitoring

**Health Check Endpoint:**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});
```

**Logging:**
```javascript
// Use Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### ML Service Monitoring

**Metrics to track:**
- Prediction latency
- Model accuracy over time
- Request rate
- Error rate

**Retraining Schedule:**
- Daily: Quick update (last 7 days data)
- Weekly: Full retrain (30 days data)
- Monthly: Model architecture review

---

## 🧪 Part 7: Testing Production

### Smoke Tests

```bash
# Frontend
curl https://your-app.vercel.app
# Should return 200

# Backend health
curl https://your-backend.onrender.com/health
# Should return {"status":"ok"}

# ML Service
curl https://your-ml.railway.app/health
# Should return {"status":"healthy"}

# Test login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# Should return JWT token
```

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test backend
ab -n 1000 -c 10 https://your-backend.onrender.com/api/boiler/current

# Test ML service
ab -n 100 -c 5 -p test_data.json -T application/json \
  https://your-ml.railway.app/predict/all
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] ML models trained and saved
- [ ] CORS configured correctly
- [ ] API keys secured

### Deployment
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Database created on Railway
- [ ] ML service deployed
- [ ] n8n workflows imported
- [ ] Environment variables set

### Post-Deployment
- [ ] Health checks passing
- [ ] Login working
- [ ] Real-time data updating
- [ ] Charts rendering
- [ ] ML predictions working
- [ ] Alerts configured
- [ ] Monitoring enabled

### Monitoring
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics)
- [ ] Database backups scheduled
- [ ] n8n workflows active

---

## 🆘 Troubleshooting

### Common Issues

**Frontend not loading:**
```bash
# Check Vercel build logs
vercel logs

# Verify environment variables
vercel env ls
```

**Backend 502 errors:**
```bash
# Check Render logs
# Verify database connection
# Check health endpoint
```

**ML predictions failing:**
```bash
# Verify models exist in saved_models/
# Check Railway logs
# Test locally with same data
```

**CORS errors:**
```javascript
// Backend: Update CORS config
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

---

## 📞 Support & Maintenance

**Regular Tasks:**
- Weekly: Check error logs
- Monthly: Review performance metrics
- Quarterly: Update dependencies
- Yearly: Security audit

**Useful Commands:**

```bash
# View Vercel logs
vercel logs --follow

# SSH into Render
render shell

# Railway logs
railway logs

# Database backup
railway run pg_dump > backup.sql
```

---

## 🎉 Success Metrics

After deployment, verify:

- ✅ Uptime > 99.9%
- ✅ API response time < 200ms
- ✅ ML inference < 500ms
- ✅ Zero security vulnerabilities
- ✅ Successful monitoring alerts

**Your Boiler Cofiring system is now LIVE! 🚀**
