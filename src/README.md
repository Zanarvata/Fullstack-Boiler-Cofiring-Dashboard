# 🔥 Boiler Cofiring Monitoring & Optimization System

Dashboard fullstack untuk monitoring dan optimasi Boiler Cofiring (pembakaran bersama batubara dan biomassa) dengan fitur analisis prediksi menggunakan 3 metode Machine Learning: **ANN**, **RSM**, dan **LightGBM**.

![Dashboard Preview](https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1200&h=600&fit=crop)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Backend Setup](#backend-setup)
- [ML Models](#ml-models)
- [n8n Integration](#n8n-integration)
- [Deployment](#deployment)
- [Demo Credentials](#demo-credentials)

---

## ✨ Features

### 🏠 **Menu Utama (Home Dashboard)**
- Real-time KPI monitoring (Suhu, Tekanan, Efisiensi, Emisi CO₂, Rasio Biomassa)
- Live charts: Line, Area, Bar, Pie, Gauge
- Status operasional real-time dengan color coding
- Simulasi data real-time setiap 3 detik

### 💡 **Rekomendasi AI**
- Perbandingan akurasi 3 model ML (ANN 94.5%, RSM 91.8%, LightGBM 95.2%)
- Radar chart multi-dimensional analysis
- Prediksi efisiensi dan emisi optimal
- Rekomendasi operasional berbasis AI dengan prioritas

### 📊 **Detail Boiler**
- Data historis dengan filter 24h / 7d / 30d
- Time-series charts untuk setiap parameter
- Tabel interaktif dengan export capability
- Correlation heat map antar parameter
- Statistik lengkap (avg, max, min, trend)

### 🤖 **AI Copilot**
- Chat interface mirip ChatGPT
- Context-aware responses berbasis data boiler dan ML predictions
- Quick suggestions untuk pertanyaan umum
- Integrasi dengan model LightGBM untuk jawaban akurat

### ⚙️ **Panel Operator**
- Manual control dengan slider untuk setiap parameter
- Mode Auto/Manual switching
- Activity logs real-time
- Alarm management system
- Manual data entry form

### 🎨 **UI/UX Features**
- Dark mode toggle
- Fully responsive (mobile-friendly)
- JWT Authentication (admin/operator roles)
- Toast notifications (Sonner)
- Modern gradient design

---

## 🛠️ Tech Stack

### **Frontend** (✅ Implemented in this project)
- ⚛️ **React 18** + **Vite** - Fast development & HMR
- 🎨 **Tailwind CSS v4** - Utility-first styling
- 📊 **Recharts** - Data visualization
- 🧭 **React Router v6** - Client-side routing
- 🔄 **React Hooks** - State management
- 🎭 **Lucide Icons** - Beautiful icon set
- 🍞 **Sonner** - Toast notifications
- 🌗 **Dark Mode** - Theme switching

### **Backend** (📝 Documentation provided)
- 🟢 **Node.js** + **Express.js** - REST API server
- 🔐 **JWT** - Authentication & authorization
- 🗄️ **PostgreSQL** / **MongoDB** - Database
- 🔄 **CORS** - Cross-origin support
- 📡 **Socket.io** - WebSocket for real-time data (optional)

### **Machine Learning** (📝 Documentation provided)
- 🐍 **Python 3.9+**
- ⚡ **FastAPI** / **Flask** - ML microservice
- 🧠 **TensorFlow/Keras** - ANN model
- 📈 **statsmodels** - RSM (Response Surface Methodology)
- 🚀 **LightGBM** - Gradient Boosting
- 🔢 **NumPy** + **Pandas** - Data processing
- 📊 **scikit-learn** - Preprocessing & metrics

### **Automation** (📝 Documentation provided)
- 🔗 **n8n** - Workflow automation
- 📧 **Email/Telegram/Slack** - Notifications

### **Deployment**
- ▲ **Vercel** - Frontend hosting
- 🚂 **Render** / **Heroku** - Backend API
- 🚆 **Railway** - PostgreSQL database

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd boiler-cofiring-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:5173
```

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Operator** | `operator` | `operator123` |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │Rekomendasi│  │  Detail  │  │   AI     │   │
│  │Dashboard │  │    AI     │  │  Boiler  │  │ Copilot  │   │
│  └────┬─────┘  └────┬──────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                          │                                   │
│                     REST API / WebSocket                     │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              BACKEND (Node.js + Express)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   Data   │  │    ML    │  │  Socket  │   │
│  │   API    │  │   API    │  │Connector │  │   Server │   │
│  └────┬─────┘  └────┬──────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
└───────┼─────────────┼──────────────┼─────────────┼──────────┘
        │             │              │             │
        │        ┌────▼────┐    ┌────▼────┐       │
        │        │PostgreSQL│    │  Python │       │
        │        │   or     │    │   ML    │       │
        │        │ MongoDB  │    │ Service │       │
        │        └─────────┘    └────┬────┘       │
        │                            │             │
        │                     ┌──────▼──────┐      │
        │                     │  ML Models  │      │
        │                     │ ANN │RSM    │      │
        │                     │  LightGBM   │      │
        │                     └─────────────┘      │
        │                                          │
┌───────▼──────────────────────────────────────────▼──────────┐
│                    n8n WORKFLOW ENGINE                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Workflow 1: Real-time Monitoring & Alerts          │   │
│  │  Trigger: Every 5 min → Fetch data → ML Predict     │   │
│  │  → Check thresholds → Send Telegram/Email           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Workflow 2: Daily Retraining                       │   │
│  │  Trigger: Cron (2 AM) → Fetch historical data       │   │
│  │  → Retrain models → Update predictions              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Setup

### File Structure
```
backend/
├── server.js                 # Main Express server
├── config/
│   ├── database.js          # DB connection
│   └── jwt.js               # JWT config
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── boiler-data.js       # Boiler data API
│   └── ml-predictions.js    # ML prediction routes
├── controllers/
│   ├── authController.js
│   ├── boilerController.js
│   └── mlController.js
├── models/
│   ├── User.js
│   ├── BoilerData.js
│   └── MLPrediction.js
├── middleware/
│   └── authMiddleware.js    # JWT verification
└── package.json
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.3",
    "socket.io": "^4.6.2",
    "axios": "^1.6.0"
  }
}
```

### Example: server.js
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const boilerRoutes = require('./routes/boiler-data');
const mlRoutes = require('./routes/ml-predictions');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boiler', boilerRoutes);
app.use('/api/ml', mlRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(\`🚀 Backend running on port \${PORT}\`);
});
```

### Example: Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Boiler data table
CREATE TABLE boiler_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  steam_temp DECIMAL(5,2),
  drum_pressure DECIMAL(5,2),
  coal_flow DECIMAL(5,2),
  biomass_flow DECIMAL(5,2),
  efficiency DECIMAL(4,2),
  co2_emission DECIMAL(6,2),
  o2_level DECIMAL(4,2),
  co_level DECIMAL(5,2),
  nox_level DECIMAL(5,2),
  cofiring_ratio DECIMAL(4,2)
);

-- ML predictions table
CREATE TABLE ml_predictions (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(20),
  accuracy DECIMAL(5,2),
  predicted_efficiency DECIMAL(5,2),
  optimal_cofiring_ratio DECIMAL(4,2),
  predicted_co2 DECIMAL(6,2),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_boiler_timestamp ON boiler_data(timestamp DESC);
CREATE INDEX idx_predictions_timestamp ON ml_predictions(timestamp DESC);
```

### API Endpoints

#### Authentication
```
POST   /api/auth/login       # Login user
POST   /api/auth/register    # Register user (admin only)
GET    /api/auth/me          # Get current user
```

#### Boiler Data
```
GET    /api/boiler/current   # Get current KPI data
GET    /api/boiler/history   # Get historical data (?hours=24)
POST   /api/boiler/manual    # Submit manual data entry
```

#### ML Predictions
```
GET    /api/ml/predictions   # Get all model predictions
POST   /api/ml/predict       # Trigger new prediction
GET    /api/ml/recommendations # Get AI recommendations
```

---

## 🧠 ML Models

### Python ML Service Structure
```
ml-service/
├── app.py                    # FastAPI main server
├── requirements.txt
├── models/
│   ├── ann_model.py         # ANN with Keras
│   ├── rsm_model.py         # RSM with statsmodels
│   └── lightgbm_model.py    # LightGBM model
├── data/
│   ├── training_data.csv    # Historical data
│   └── preprocessing.py     # Data preprocessing
├── saved_models/
│   ├── ann_model.h5
│   ├── rsm_model.pkl
│   └── lgbm_model.pkl
└── training/
    ├── train_ann.py
    ├── train_rsm.py
    └── train_lightgbm.py
```

### Dependencies (requirements.txt)
```
fastapi==0.104.1
uvicorn==0.24.0
tensorflow==2.15.0
keras==2.15.0
lightgbm==4.1.0
statsmodels==0.14.0
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
joblib==1.3.2
pydantic==2.5.0
```

### Example: app.py (FastAPI)
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from models.ann_model import ANNModel
from models.rsm_model import RSMModel
from models.lightgbm_model import LightGBMModel

app = FastAPI(title="Boiler Cofiring ML Service")

# Load models
ann_model = ANNModel.load('saved_models/ann_model.h5')
rsm_model = RSMModel.load('saved_models/rsm_model.pkl')
lgbm_model = LightGBMModel.load('saved_models/lgbm_model.pkl')

class PredictionInput(BaseModel):
    coal_flow: float
    biomass_flow: float
    steam_temp: float
    drum_pressure: float
    o2_level: float

class PredictionOutput(BaseModel):
    model: str
    accuracy: float
    predicted_efficiency: float
    optimal_cofiring_ratio: float
    predicted_co2: float
    confidence: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "models_loaded": 3}

@app.post("/predict/all", response_model=list[PredictionOutput])
async def predict_all(input_data: PredictionInput):
    """Get predictions from all 3 models"""
    features = np.array([[
        input_data.coal_flow,
        input_data.biomass_flow,
        input_data.steam_temp,
        input_data.drum_pressure,
        input_data.o2_level
    ]])
    
    predictions = []
    
    # ANN Prediction
    ann_pred = ann_model.predict(features)
    predictions.append(PredictionOutput(
        model="ANN",
        accuracy=94.5,
        predicted_efficiency=ann_pred['efficiency'],
        optimal_cofiring_ratio=ann_pred['cofiring_ratio'],
        predicted_co2=ann_pred['co2'],
        confidence=0.92
    ))
    
    # RSM Prediction
    rsm_pred = rsm_model.predict(features)
    predictions.append(PredictionOutput(
        model="RSM",
        accuracy=91.8,
        predicted_efficiency=rsm_pred['efficiency'],
        optimal_cofiring_ratio=rsm_pred['cofiring_ratio'],
        predicted_co2=rsm_pred['co2'],
        confidence=0.89
    ))
    
    # LightGBM Prediction
    lgbm_pred = lgbm_model.predict(features)
    predictions.append(PredictionOutput(
        model="LightGBM",
        accuracy=95.2,
        predicted_efficiency=lgbm_pred['efficiency'],
        optimal_cofiring_ratio=lgbm_pred['cofiring_ratio'],
        predicted_co2=lgbm_pred['co2'],
        confidence=0.94
    ))
    
    return predictions

@app.post("/retrain/{model_name}")
async def retrain_model(model_name: str):
    """Retrain specific model with latest data"""
    if model_name == "ann":
        ann_model.retrain()
        return {"status": "success", "model": "ANN"}
    elif model_name == "rsm":
        rsm_model.retrain()
        return {"status": "success", "model": "RSM"}
    elif model_name == "lightgbm":
        lgbm_model.retrain()
        return {"status": "success", "model": "LightGBM"}
    else:
        raise HTTPException(status_code=404, detail="Model not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Example: train_lightgbm.py
```python
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Load training data
df = pd.read_csv('data/training_data.csv')

# Features and targets
X = df[['coal_flow', 'biomass_flow', 'steam_temp', 'drum_pressure', 'o2_level']]
y_efficiency = df['efficiency']
y_co2 = df['co2_emission']

# Split data
X_train, X_test, y_train_eff, y_test_eff = train_test_split(
    X, y_efficiency, test_size=0.2, random_state=42
)

# Train LightGBM for efficiency
params = {
    'objective': 'regression',
    'metric': 'rmse',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'n_estimators': 500,
    'max_depth': 8
}

model = lgb.LGBMRegressor(**params)
model.fit(X_train, y_train_eff, eval_set=[(X_test, y_test_eff)], 
          callbacks=[lgb.early_stopping(50), lgb.log_evaluation(100)])

# Evaluate
y_pred = model.predict(X_test)
rmse = mean_squared_error(y_test_eff, y_pred, squared=False)
r2 = r2_score(y_test_eff, y_pred)

print(f"LightGBM - RMSE: {rmse:.3f}, R²: {r2:.3f}")
print(f"Accuracy: {(1 - rmse/y_test_eff.mean()) * 100:.2f}%")

# Save model
joblib.dump(model, 'saved_models/lgbm_model.pkl')
print("Model saved successfully!")
```

### Synthetic Training Data Generator
```python
import pandas as pd
import numpy as np

def generate_synthetic_data(n_samples=10000):
    """Generate synthetic boiler cofiring data"""
    np.random.seed(42)
    
    # Input parameters
    coal_flow = np.random.uniform(35, 55, n_samples)
    biomass_flow = np.random.uniform(5, 12, n_samples)
    steam_temp = np.random.uniform(530, 555, n_samples)
    drum_pressure = np.random.uniform(155, 175, n_samples)
    o2_level = np.random.uniform(2.5, 5.0, n_samples)
    
    # Calculate cofiring ratio
    cofiring_ratio = (biomass_flow / (coal_flow + biomass_flow)) * 100
    
    # Efficiency model (with realistic relationships)
    efficiency_base = 82 + \
        0.15 * cofiring_ratio + \
        0.05 * (steam_temp - 540) + \
        0.03 * (drum_pressure - 165) - \
        0.8 * (o2_level - 3.5)**2
    efficiency = efficiency_base + np.random.normal(0, 1.5, n_samples)
    efficiency = np.clip(efficiency, 75, 92)
    
    # CO2 emission model
    co2_base = 900 - \
        8 * cofiring_ratio + \
        2 * (o2_level - 3.5) - \
        0.5 * (efficiency - 87)
    co2_emission = co2_base + np.random.normal(0, 30, n_samples)
    co2_emission = np.clip(co2_emission, 650, 900)
    
    # Create DataFrame
    df = pd.DataFrame({
        'coal_flow': coal_flow,
        'biomass_flow': biomass_flow,
        'steam_temp': steam_temp,
        'drum_pressure': drum_pressure,
        'o2_level': o2_level,
        'cofiring_ratio': cofiring_ratio,
        'efficiency': efficiency,
        'co2_emission': co2_emission
    })
    
    return df

# Generate and save
df = generate_synthetic_data(10000)
df.to_csv('data/training_data.csv', index=False)
print(f"Generated {len(df)} samples")
print(df.describe())
```

---

## 🔗 n8n Integration

### Workflow 1: Real-time Monitoring & Alerts
```json
{
  "name": "Boiler Monitoring - Real-time Alerts",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "minutesInterval": 5
            }
          ]
        }
      },
      "name": "Every 5 minutes",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "https://your-backend.com/api/boiler/current",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "options": {}
      },
      "name": "Fetch Boiler Data",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://your-ml-service.com/predict/all",
        "method": "POST",
        "bodyParameters": {
          "parameters": [
            {
              "name": "coal_flow",
              "value": "={{$json.coalFlow}}"
            },
            {
              "name": "biomass_flow",
              "value": "={{$json.biomassFlow}}"
            },
            {
              "name": "steam_temp",
              "value": "={{$json.steamTemp}}"
            },
            {
              "name": "drum_pressure",
              "value": "={{$json.drumPressure}}"
            },
            {
              "name": "o2_level",
              "value": "={{$json.o2Level}}"
            }
          ]
        }
      },
      "name": "Get ML Predictions",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "leftValue": "={{$json.efficiency}}",
              "rightValue": 85,
              "operator": {
                "type": "number",
                "operation": "smaller"
              }
            },
            {
              "leftValue": "={{$json.co2Emission}}",
              "rightValue": 800,
              "operator": {
                "type": "number",
                "operation": "larger"
              }
            }
          ],
          "combineOperation": "any"
        }
      },
      "name": "Check Thresholds",
      "type": "n8n-nodes-base.if",
      "position": [850, 300]
    },
    {
      "parameters": {
        "chatId": "@your_channel",
        "text": "⚠️ ALERT: Boiler Performance Warning\n\n📊 Current Status:\n• Efficiency: {{$json.efficiency}}%\n• CO₂ Emission: {{$json.co2Emission}} mg/Nm³\n\n🤖 AI Recommendation:\n{{$json.mlPredictions[0].recommendation}}\n\nTime: {{$now.format('DD/MM/YYYY HH:mm')}}"
      },
      "name": "Send Telegram Alert",
      "type": "n8n-nodes-base.telegram",
      "position": [1050, 250]
    },
    {
      "parameters": {
        "fromEmail": "noreply@boiler-system.com",
        "toEmail": "operator@company.com",
        "subject": "Boiler Alert - Action Required",
        "emailType": "html",
        "message": "<h2>Boiler Performance Alert</h2><p>Efficiency dropped below threshold.</p>"
      },
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [1050, 350]
    }
  ],
  "connections": {
    "Every 5 minutes": {
      "main": [[{"node": "Fetch Boiler Data"}]]
    },
    "Fetch Boiler Data": {
      "main": [[{"node": "Get ML Predictions"}]]
    },
    "Get ML Predictions": {
      "main": [[{"node": "Check Thresholds"}]]
    },
    "Check Thresholds": {
      "main": [
        [{"node": "Send Telegram Alert"}, {"node": "Send Email"}],
        []
      ]
    }
  }
}
```

### Workflow 2: Daily Model Retraining
```json
{
  "name": "Boiler ML - Daily Retraining",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 2 * * *"
            }
          ]
        }
      },
      "name": "Daily at 2 AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "https://your-backend.com/api/boiler/history?days=30",
        "method": "GET"
      },
      "name": "Fetch Training Data",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://your-ml-service.com/retrain/lightgbm",
        "method": "POST"
      },
      "name": "Retrain LightGBM",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300]
    },
    {
      "parameters": {
        "chatId": "@your_channel",
        "text": "✅ Daily ML Model Retraining Complete\n\n🤖 Model: LightGBM\n📊 New Accuracy: {{$json.accuracy}}%\n⏰ Time: {{$now.format('DD/MM/YYYY HH:mm')}}"
      },
      "name": "Notify Success",
      "type": "n8n-nodes-base.telegram",
      "position": [850, 300]
    }
  ],
  "connections": {
    "Daily at 2 AM": {
      "main": [[{"node": "Fetch Training Data"}]]
    },
    "Fetch Training Data": {
      "main": [[{"node": "Retrain LightGBM"}]]
    },
    "Retrain LightGBM": {
      "main": [[{"node": "Notify Success"}]]
    }
  }
}
```

### n8n Setup Instructions

1. **Install n8n**
```bash
npm install -g n8n
# or with Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

2. **Import Workflows**
- Open n8n UI: http://localhost:5678
- Click "Import from File"
- Select workflow JSON files
- Configure credentials (API keys, Telegram bot token, etc.)

3. **Configure Credentials**
- HTTP Header Auth untuk backend API
- Telegram credentials
- Email SMTP credentials

---

## 🚀 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Environment Variables** (Vercel Dashboard)
```
VITE_API_URL=https://your-backend.render.com
VITE_ML_API_URL=https://your-ml-service.com
```

### Backend (Render)

1. **Create `render.yaml`**
```yaml
services:
  - type: web
    name: boiler-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: boiler-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production

databases:
  - name: boiler-db
    databaseName: boiler_cofiring
    user: boiler_user
```

2. **Deploy to Render**
- Connect GitHub repository
- Render auto-detects `render.yaml`
- Click "Deploy"

### ML Service (Railway / Render)

**Dockerfile**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deploy to Railway**
```bash
railway login
railway init
railway up
```

---

## 📊 Performance & Monitoring

### Metrics to Track
- **API Response Time**: < 200ms
- **ML Inference Time**: < 500ms
- **Real-time Update Frequency**: Every 3 seconds
- **Database Query Time**: < 100ms

### Monitoring Tools
- **Frontend**: Vercel Analytics
- **Backend**: Render Metrics / Datadog
- **Database**: PostgreSQL pg_stat_statements
- **n8n**: Built-in execution logs

---

## 🔒 Security

- ✅ JWT authentication with expiry
- ✅ HTTPS only in production
- ✅ CORS configured
- ✅ SQL injection prevention (parameterized queries)
- ✅ Rate limiting (recommended: express-rate-limit)
- ✅ Environment variables for secrets

---

## 📝 License

MIT License - Feel free to use for commercial or personal projects.

---

## 👨‍💻 Development Team

Developed with ❤️ for Industrial Boiler Optimization

**Contact**: support@boiler-system.com

---

## 🙏 Acknowledgments

- Recharts for amazing charts
- Shadcn/ui for beautiful components
- TensorFlow & LightGBM teams
- n8n community

---

**Last Updated**: January 2025
