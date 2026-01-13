# ⚡ Quick Start Guide

Get your Boiler Cofiring Dashboard running in **5 minutes**!

## 🎯 What You'll Get

A fully functional dashboard with:
- ✅ Real-time monitoring
- ✅ 3 ML models (ANN, RSM, LightGBM)
- ✅ AI Copilot chat
- ✅ Operator controls
- ✅ Dark mode
- ✅ Responsive design

## 🚀 Installation (Frontend Only)

This repository contains the **complete frontend** that's ready to run!

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
```

Check your versions:
```bash
node --version
npm --version
```

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- React 18 + Vite
- React Router
- Recharts (for charts)
- Tailwind CSS
- Shadcn/ui components
- Lucide icons
- Sonner (toast notifications)

### Step 2: Run Development Server

```bash
npm run dev
```

Open browser:
```
http://localhost:5173
```

### Step 3: Login

Use demo credentials:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Operator** | `operator` | `operator123` |

## 🎨 Features Demo

### 1. **Home Dashboard**
- Real-time KPI cards (auto-updates every 3 seconds)
- Multiple chart types (Line, Area, Bar, Pie)
- Emission monitoring with gauges
- Status indicators

### 2. **Rekomendasi AI**
- Compare 3 ML models side-by-side
- Radar charts for multi-dimensional analysis
- Best model recommendation (LightGBM)
- Actionable optimization suggestions

### 3. **Detail Boiler**
- Historical data with filters (24h/7d/30d)
- Time-series charts for all parameters
- Interactive data table
- Correlation heat map

### 4. **AI Copilot**
- ChatGPT-like interface
- Context-aware responses
- Quick suggestion buttons
- Real-time data integration

### 5. **Operator Panel**
- Manual parameter controls with sliders
- Auto/Manual mode switching
- Activity logs
- Alarm management
- Data input forms

## 🔧 Configuration

### Mock Data

The app uses **realistic mock data** that simulates:
- Real-time boiler operations
- ML model predictions
- Historical trends
- Operator activities

**No backend needed for frontend demo!**

### Dark Mode

Toggle dark mode from sidebar:
- Persisted in localStorage
- Smooth transitions
- Optimized colors for both themes

## 📊 Understanding the Data

### Key Performance Indicators (KPI)

| Metric | Target Range | Unit |
|--------|-------------|------|
| **Steam Temperature** | 540-550 | °C |
| **Drum Pressure** | 160-170 | bar |
| **Efficiency** | >85 | % |
| **CO₂ Emission** | <800 | mg/Nm³ |
| **Cofiring Ratio** | 15-17 | % |

### ML Model Comparison

| Model | Accuracy | Speed | Best For |
|-------|----------|-------|----------|
| **LightGBM** | 95.2% | 5ms | Production |
| **ANN** | 94.5% | 50ms | Complex patterns |
| **RSM** | 91.8% | 10ms | Statistical analysis |

## 🎓 Learning Path

### For Beginners

1. **Explore the UI** (5 min)
   - Navigate through all 5 menu items
   - Try different features
   - Test dark mode

2. **Understand the Data** (10 min)
   - Watch KPI updates in real-time
   - Check different time ranges
   - Read ML recommendations

3. **Try Operator Controls** (5 min)
   - Adjust parameters with sliders
   - Switch Auto/Manual mode
   - Submit test data

### For Developers

1. **Code Structure** (15 min)
   ```
   /pages           → Main pages (5 routes)
   /components      → Reusable UI components
   /contexts        → Auth & Theme contexts
   /utils           → Mock data generators
   /docs            → Backend/ML/n8n guides
   ```

2. **Key Files**
   - `/App.tsx` → Main app with routing
   - `/utils/mockData.ts` → Data generation
   - `/pages/HomePage.tsx` → Dashboard example

3. **Customization**
   - Modify mock data in `/utils/mockData.ts`
   - Adjust charts in page components
   - Customize theme in `/styles/globals.css`

## 🔌 Backend Integration (Optional)

To connect to real backend:

### Step 1: Set Up Backend

Follow `/docs/BACKEND_GUIDE.md` to:
- Create Express.js server
- Set up PostgreSQL database
- Implement authentication

### Step 2: Update API Calls

Replace mock data with real API calls:

```typescript
// Before (mock):
const [kpi, setKpi] = useState(getCurrentKPI());

// After (real API):
const [kpi, setKpi] = useState(null);

useEffect(() => {
  fetch('https://your-backend.com/api/boiler/current')
    .then(res => res.json())
    .then(data => setKpi(data));
}, []);
```

### Step 3: Add WebSocket (Optional)

For real-time updates:

```typescript
import io from 'socket.io-client';

const socket = io('https://your-backend.com');

socket.on('boiler-update', (data) => {
  setKpi(data);
});
```

## 🤖 ML Integration (Optional)

Follow `/docs/ML_GUIDE.md` to:
- Train models with Python
- Deploy FastAPI service
- Connect to frontend

## 🔄 n8n Automation (Optional)

Follow `/docs/N8N_WORKFLOWS.json` to:
- Set up automated alerts
- Schedule model retraining
- Send notifications

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Output in /dist folder
```

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or use Vercel Dashboard:
1. Import from GitHub
2. Auto-detected as Vite project
3. Deploy!

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Dependencies not installing
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Charts not showing
```bash
# Recharts needs to be properly installed
npm install recharts --force
```

### Build errors
```bash
# Check Node version (must be 18+)
node --version

# Update if needed
nvm install 18
nvm use 18
```

## 📚 Next Steps

### Learn More
- Read `/README.md` for full system architecture
- Check `/docs/BACKEND_GUIDE.md` for backend setup
- See `/docs/ML_GUIDE.md` for ML implementation
- Review `/DEPLOYMENT.md` for production deploy

### Customize
- Modify colors in `/styles/globals.css`
- Add new pages in `/pages`
- Create custom components
- Integrate real data sources

### Contribute
- Report bugs
- Suggest features
- Submit pull requests
- Share your implementation

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl/Cmd + K` → Quick search (if implemented)
- Dark mode toggle in sidebar

### Performance
- Charts limited to 100 data points for smooth rendering
- Real-time updates throttled to every 3 seconds
- Lazy loading for heavy components

### Best Practices
- Keep mock data realistic
- Test all features before deployment
- Monitor console for errors
- Use dark mode for extended use

## 🎉 Success!

You now have a fully functional Boiler Cofiring dashboard!

**What's working:**
✅ All 5 menu pages
✅ Real-time data simulation
✅ ML model comparisons
✅ AI Copilot chat
✅ Dark mode
✅ Responsive design
✅ Authentication

**Ready for production:**
- Follow `/DEPLOYMENT.md`
- Connect real backend
- Train ML models
- Set up automation

---

**Need help?** Check `/README.md` or `/docs/*` for detailed guides!

**Happy monitoring! 🔥📊**
