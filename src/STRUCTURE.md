# 📁 Project Structure

Complete overview of the Boiler Cofiring Monitoring System file structure.

## 🎯 Frontend Structure (Current Implementation)

```
boiler-cofiring-dashboard/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # 5-minute setup guide
├── 📄 DEPLOYMENT.md                # Production deployment guide
├── 📄 STRUCTURE.md                 # This file
│
├── 📦 package.json                 # Dependencies & scripts
├── 📦 package-lock.json
├── ⚙️ vite.config.ts               # Vite configuration
├── ⚙️ tsconfig.json                # TypeScript configuration
├── ⚙️ tailwind.config.js           # Tailwind CSS configuration
├── ⚙️ postcss.config.js
│
├── 🌐 index.html                   # HTML entry point
│
├── 📂 src/
│   ├── 📄 App.tsx                  # Main app component
│   │                               # - Routing setup
│   │                               # - Context providers
│   │                               # - Auth wrapper
│   │
│   ├── 📂 pages/                   # Main application pages
│   │   ├── HomePage.tsx            # 🏠 Dashboard with KPI & charts
│   │   ├── RekomendasiPage.tsx     # 💡 ML model comparison
│   │   ├── DetailBoilerPage.tsx    # 📊 Historical data & analytics
│   │   ├── AICopilotPage.tsx       # 🤖 Chat interface
│   │   └── OperatorPage.tsx        # ⚙️ Manual controls & logs
│   │
│   ├── 📂 components/              # Reusable components
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── Layout.tsx              # Page layout wrapper
│   │   ├── LoginPage.tsx           # Authentication page
│   │   │
│   │   ├── 📂 ui/                  # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ... (30+ components)
│   │   │
│   │   └── 📂 figma/
│   │       └── ImageWithFallback.tsx
│   │
│   ├── 📂 contexts/                # React contexts
│   │   ├── AuthContext.tsx         # Authentication state
│   │   │                           # - Login/logout
│   │   │                           # - User management
│   │   │                           # - JWT handling
│   │   │
│   │   └── ThemeContext.tsx        # Dark mode state
│   │                               # - Theme toggle
│   │                               # - LocalStorage persistence
│   │
│   ├── 📂 utils/                   # Utility functions
│   │   └── mockData.ts             # Mock data generators
│   │                               # - generateBoilerData()
│   │                               # - generateTimeSeriesData()
│   │                               # - getMLPredictions()
│   │                               # - getCurrentKPI()
│   │                               # - generateOperatorLogs()
│   │                               # - generateAlarms()
│   │
│   └── 📂 styles/                  # Global styles
│       └── globals.css             # Tailwind & custom CSS
│                                   # - CSS variables
│                                   # - Dark mode styles
│
├── 📂 docs/                        # Documentation
│   ├── BACKEND_GUIDE.md            # Node.js + Express setup
│   │                               # - API endpoints
│   │                               # - Database schema
│   │                               # - Authentication
│   │
│   ├── ML_GUIDE.md                 # Python ML service
│   │                               # - ANN with Keras
│   │                               # - RSM with statsmodels
│   │                               # - LightGBM training
│   │                               # - FastAPI deployment
│   │
│   └── N8N_WORKFLOWS.json          # Automation workflows
│                                   # - Real-time alerts
│                                   # - Model retraining
│                                   # - Weekly reports
│
└── 📂 public/                      # Static assets
    └── (generated images)
```

## 🔧 Backend Structure (Documentation Provided)

```
backend/
│
├── 📄 server.js                    # Express server entry point
├── 📄 package.json
├── 📄 .env                         # Environment variables
├── 📄 .env.example
├── 📄 render.yaml                  # Render deployment config
│
├── 📂 config/
│   ├── database.js                 # PostgreSQL/MongoDB connection
│   └── jwt.js                      # JWT configuration
│
├── 📂 routes/
│   ├── auth.js                     # POST /api/auth/login, /register
│   ├── boiler-data.js              # GET/POST /api/boiler/*
│   ├── ml-predictions.js           # GET/POST /api/ml/*
│   └── operators.js                # Operator logs & controls
│
├── 📂 controllers/
│   ├── authController.js           # Authentication logic
│   ├── boilerController.js         # Boiler data CRUD
│   ├── mlController.js             # ML predictions
│   └── operatorController.js       # Operator actions
│
├── 📂 models/
│   ├── User.js                     # User schema (Sequelize/Mongoose)
│   ├── BoilerData.js               # Boiler sensor data
│   ├── MLPrediction.js             # ML prediction results
│   ├── OperatorLog.js              # Activity logs
│   └── Alarm.js                    # Alarm history
│
├── 📂 middleware/
│   ├── authMiddleware.js           # JWT verification
│   ├── roleMiddleware.js           # Role-based access
│   └── errorHandler.js             # Global error handler
│
├── 📂 services/
│   ├── mlService.js                # ML API connector
│   ├── dataGenerator.js            # Real-time data simulator
│   └── notificationService.js      # Alert system
│
└── 📂 utils/
    ├── validators.js               # Input validation
    └── logger.js                   # Winston logger
```

## 🤖 ML Service Structure (Documentation Provided)

```
ml-service/
│
├── 📄 app.py                       # FastAPI main application
├── 📄 requirements.txt             # Python dependencies
├── 📄 Dockerfile                   # Docker configuration
├── 📄 railway.json                 # Railway deployment config
│
├── 📂 models/
│   ├── __init__.py
│   ├── ann_model.py                # ANN with Keras/TensorFlow
│   │                               # - 3 hidden layers (128-64-32)
│   │                               # - ReLU activation
│   │                               # - Dropout for regularization
│   │
│   ├── rsm_model.py                # Response Surface Methodology
│   │                               # - Second-order polynomial
│   │                               # - Statsmodels OLS
│   │
│   └── lightgbm_model.py           # LightGBM Gradient Boosting
│                                   # - 500 trees, max depth 8
│                                   # - Learning rate 0.05
│
├── 📂 data/
│   ├── training_data.csv           # Historical boiler data
│   ├── validation_data.csv
│   ├── preprocessing.py            # Feature engineering
│   └── generate_synthetic.py      # Synthetic data generator
│                                   # - 10,000 samples
│                                   # - Realistic relationships
│
├── 📂 saved_models/
│   ├── ann_model.h5                # Keras model weights
│   ├── ann_scaler.pkl              # Feature scaler
│   ├── rsm_model.pkl               # RSM model
│   └── lgbm_models.pkl             # LightGBM models
│
├── 📂 training/
│   ├── train_ann.py                # ANN training script
│   ├── train_rsm.py                # RSM training script
│   └── train_lightgbm.py           # LightGBM training script
│
├── 📂 utils/
│   ├── metrics.py                  # Model evaluation
│   └── validators.py               # Input validation
│
└── 📂 tests/
    └── test_models.py              # Unit tests
```

## 🔗 n8n Workflows Structure

```
n8n-workflows/
│
├── 📄 workflow-1-alerts.json       # Real-time monitoring & alerts
│   ├── Trigger: Every 5 minutes
│   ├── Fetch boiler data
│   ├── Run ML predictions
│   ├── Check thresholds
│   └── Send notifications (Telegram/Email/Slack)
│
├── 📄 workflow-2-retraining.json   # Daily model retraining
│   ├── Trigger: Daily at 2 AM
│   ├── Fetch 30 days data
│   ├── Retrain all 3 models
│   └── Notify completion
│
└── 📄 workflow-3-reports.json      # Weekly performance reports
    ├── Trigger: Monday 8 AM
    ├── Generate statistics
    └── Email to management
```

## 📊 Key Files Explained

### Frontend

#### `/App.tsx`
- **Purpose**: Main application entry point
- **Responsibilities**:
  - Router configuration
  - Context providers (Auth, Theme)
  - Toast notifications
- **Key imports**: React Router, Contexts, Pages

#### `/pages/HomePage.tsx`
- **Purpose**: Main dashboard
- **Features**:
  - 5 KPI cards
  - Real-time charts (Line, Area, Bar, Pie)
  - Auto-refresh every 3 seconds
- **Charts**: Recharts library
- **Data**: `mockData.ts`

#### `/pages/RekomendasiPage.tsx`
- **Purpose**: ML model comparison
- **Features**:
  - 3 model cards (ANN, RSM, LightGBM)
  - Radar chart analysis
  - Optimization recommendations
- **Best practices**: Model selection UI

#### `/pages/AICopilotPage.tsx`
- **Purpose**: AI chat interface
- **Features**:
  - ChatGPT-like UI
  - Context-aware responses
  - Quick suggestions
- **AI**: Rule-based + data integration

#### `/utils/mockData.ts`
- **Purpose**: Generate realistic test data
- **Functions**:
  - `generateBoilerData()` - Single data point
  - `generateTimeSeriesData()` - Historical data
  - `getMLPredictions()` - ML model outputs
  - `getCurrentKPI()` - Dashboard metrics
- **Data quality**: Realistic ranges & relationships

### Backend (Documentation)

#### `server.js`
- Express server setup
- Middleware configuration
- Route registration
- Database connection
- WebSocket setup (optional)

#### `models/BoilerData.js`
- Sequelize/Mongoose schema
- Field definitions
- Indexes for performance
- Validation rules

### ML Service (Documentation)

#### `app.py`
- FastAPI application
- Model loading
- `/predict/all` endpoint
- `/optimize` endpoint
- `/retrain` endpoints

#### `models/ann_model.py`
- Neural network architecture
- Training pipeline
- Prediction method
- Model save/load

## 📦 Dependencies

### Frontend (`package.json`)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.300.0",
    "sonner": "^1.2.0"
  }
}
```

### Backend (`package.json`)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "sequelize": "^6.35.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "socket.io": "^4.6.2"
  }
}
```

### ML Service (`requirements.txt`)

```
fastapi==0.104.1
tensorflow==2.15.0
lightgbm==4.1.0
statsmodels==0.14.0
pandas==2.1.3
numpy==1.26.2
```

## 🔄 Data Flow

```
User Browser
    ↓
Frontend (React)
    ↓
├─→ Mock Data (Development)
│       ↓
│   Display Charts
│
└─→ Backend API (Production)
        ↓
    Database (PostgreSQL)
        ↓
    ML Service (Python)
        ↓
    Predictions
        ↓
    Frontend Display
        ↓
    n8n Workflows
        ↓
    Notifications
```

## 📝 File Naming Conventions

- **Components**: PascalCase (`HomePage.tsx`, `Sidebar.tsx`)
- **Utilities**: camelCase (`mockData.ts`, `validators.ts`)
- **Contexts**: PascalCase + Context (`AuthContext.tsx`)
- **Styles**: kebab-case (`globals.css`)
- **Docs**: UPPERCASE (`README.md`, `DEPLOYMENT.md`)

## 🎨 Styling Structure

```css
/* globals.css */

1. CSS Variables (Light theme)
2. Dark mode overrides
3. Base styles (Tailwind)
4. Component styles
5. Utility classes
```

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_ML_API_URL=http://localhost:8000
```

### Backend (`.env`)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=secret
ML_SERVICE_URL=http://localhost:8000
```

### ML Service (`.env`)
```env
MODEL_PATH=./saved_models
DATA_PATH=./data
```

---

## 📚 Related Documentation

- [`README.md`](./README.md) - Complete system overview
- [`QUICKSTART.md`](./QUICKSTART.md) - 5-minute setup
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Production deployment
- [`docs/BACKEND_GUIDE.md`](./docs/BACKEND_GUIDE.md) - Backend setup
- [`docs/ML_GUIDE.md`](./docs/ML_GUIDE.md) - ML implementation

---

**Last Updated**: January 2025
**Version**: 1.0.0
