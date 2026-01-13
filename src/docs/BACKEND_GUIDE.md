# 🔧 Backend Development Guide

Complete guide untuk implementasi backend Node.js + Express untuk Boiler Cofiring system.

## 📁 Project Structure

```
backend/
├── server.js                 # Entry point
├── .env                      # Environment variables
├── package.json
├── config/
│   ├── database.js          # PostgreSQL/MongoDB connection
│   └── jwt.js               # JWT configuration
├── routes/
│   ├── auth.js              # POST /api/auth/login, /register
│   ├── boiler-data.js       # GET/POST /api/boiler/*
│   ├── ml-predictions.js    # GET/POST /api/ml/*
│   └── operators.js         # Operator logs & controls
├── controllers/
│   ├── authController.js
│   ├── boilerController.js
│   ├── mlController.js
│   └── operatorController.js
├── models/
│   ├── User.js              # Sequelize/Mongoose User model
│   ├── BoilerData.js        # Boiler sensor data
│   ├── MLPrediction.js      # ML prediction results
│   ├── OperatorLog.js       # Activity logs
│   └── Alarm.js             # Alarm history
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── roleMiddleware.js    # Role-based access
│   └── errorHandler.js      # Global error handler
├── services/
│   ├── mlService.js         # ML API connector
│   ├── dataGenerator.js     # Real-time data simulator
│   └── notificationService.js # Alert system
└── utils/
    ├── validators.js         # Input validation
    └── logger.js             # Winston logger
```

## 🚀 Installation & Setup

### 1. Initialize Project

```bash
mkdir backend && cd backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express cors dotenv
npm install jsonwebtoken bcryptjs
npm install pg pg-hstore sequelize  # PostgreSQL
npm install mongoose                # or MongoDB
npm install socket.io               # WebSocket (optional)
npm install axios                   # ML service connector
npm install express-validator       # Input validation
npm install winston                 # Logging
npm install helmet                  # Security
npm install express-rate-limit      # Rate limiting
npm install nodemailer              # Email notifications

npm install --save-dev nodemon
```

### 3. Create .env File

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boiler_cofiring
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 📝 Code Implementation

### server.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const logger = require('./utils/logger');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boiler', require('./routes/boiler-data'));
app.use('/api/ml', require('./routes/ml-predictions'));
app.use('/api/operator', require('./routes/operators'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Database connection & server start
sequelize.authenticate()
  .then(() => {
    logger.info('✅ Database connected');
    return sequelize.sync({ alter: true }); // Auto-sync models
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(\`🚀 Backend server running on port \${PORT}\`);
    });
  })
  .catch(err => {
    logger.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// WebSocket setup (optional)
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL }
});

// Real-time data broadcast
const { generateBoilerData } = require('./services/dataGenerator');
setInterval(() => {
  const data = generateBoilerData();
  io.emit('boiler-update', data);
}, 3000);

module.exports = { app, io };
```

### config/database.js

```javascript
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = { sequelize };
```

### models/User.js

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'operator'),
    defaultValue: 'operator'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
```

### models/BoilerData.js

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BoilerData = sequelize.define('BoilerData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  steamTemp: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  drumPressure: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  coalFlow: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  biomassFlow: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  efficiency: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  co2Emission: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  },
  o2Level: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  coLevel: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  noxLevel: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  cofringRatio: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'boiler_data',
  timestamps: false,
  indexes: [
    { fields: ['timestamp'] }
  ]
});

module.exports = BoilerData;
```

### routes/auth.js

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authController.authMiddleware, authController.getMe);

module.exports = router;
```

### controllers/authController.js

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register (Admin only)
exports.register = async (req, res, next) => {
  try {
    const { username, password, role, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create user
    const user = await User.create({ username, password, role, name });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Auth middleware
exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role', 'name']
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
```

### routes/boiler-data.js

```javascript
const express = require('express');
const router = express.Router();
const boilerController = require('../controllers/boilerController');
const { authMiddleware } = require('../controllers/authController');

router.get('/current', authMiddleware, boilerController.getCurrent);
router.get('/history', authMiddleware, boilerController.getHistory);
router.post('/manual', authMiddleware, boilerController.submitManual);

module.exports = router;
```

### controllers/boilerController.js

```javascript
const BoilerData = require('../models/BoilerData');
const { Op } = require('sequelize');

// Get current KPI
exports.getCurrent = async (req, res, next) => {
  try {
    const latest = await BoilerData.findOne({
      order: [['timestamp', 'DESC']]
    });

    if (!latest) {
      return res.status(404).json({ error: 'No data available' });
    }

    // Calculate status
    let status = 'optimal';
    if (latest.efficiency < 85 || latest.co2Emission > 800) {
      status = 'warning';
    }
    if (latest.efficiency < 82 || latest.co2Emission > 850) {
      status = 'critical';
    }

    res.json({
      ...latest.toJSON(),
      status
    });
  } catch (error) {
    next(error);
  }
};

// Get historical data
exports.getHistory = async (req, res, next) => {
  try {
    const { hours = 24 } = req.query;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const data = await BoilerData.findAll({
      where: {
        timestamp: {
          [Op.gte]: startTime
        }
      },
      order: [['timestamp', 'ASC']],
      limit: 1000
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Submit manual data
exports.submitManual = async (req, res, next) => {
  try {
    const data = await BoilerData.create({
      ...req.body,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Data submitted successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};
```

### services/mlService.js

```javascript
const axios = require('axios');

const ML_API_URL = process.env.ML_SERVICE_URL;

exports.getPredictions = async (boilerData) => {
  try {
    const response = await axios.post(\`\${ML_API_URL}/predict/all\`, {
      coal_flow: boilerData.coalFlow,
      biomass_flow: boilerData.biomassFlow,
      steam_temp: boilerData.steamTemp,
      drum_pressure: boilerData.drumPressure,
      o2_level: boilerData.o2Level
    });

    return response.data;
  } catch (error) {
    console.error('ML Service error:', error.message);
    throw new Error('ML prediction failed');
  }
};

exports.retrainModel = async (modelName) => {
  try {
    const response = await axios.post(
      \`\${ML_API_URL}/retrain/\${modelName}\`
    );
    return response.data;
  } catch (error) {
    throw new Error(\`Failed to retrain \${modelName}\`);
  }
};
```

### middleware/errorHandler.js

```javascript
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 🔄 Real-time Data Simulation

### services/dataGenerator.js

```javascript
exports.generateBoilerData = () => {
  return {
    steamTemp: 540 + Math.random() * 20 - 10,
    drumPressure: 165 + Math.random() * 10 - 5,
    coalFlow: 45 + Math.random() * 10 - 5,
    biomassFlow: 8 + Math.random() * 4 - 2,
    efficiency: 87 + Math.random() * 6 - 3,
    co2Emission: 780 + Math.random() * 80 - 40,
    o2Level: 3.5 + Math.random() * 1.5 - 0.75,
    coLevel: 45 + Math.random() * 30 - 15,
    noxLevel: 185 + Math.random() * 60 - 30,
    cofringRatio: 15 + Math.random() * 4 - 2,
    timestamp: new Date()
  };
};
```

## 🧪 Testing

### Install Testing Dependencies

```bash
npm install --save-dev jest supertest
```

### Example Test (tests/auth.test.js)

```javascript
const request = require('supertest');
const { app } = require('../server');

describe('Auth API', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' });

    expect(res.statusCode).toBe(401);
  });
});
```

## 📝 package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --watchAll",
    "seed": "node scripts/seedDatabase.js"
  }
}
```

---

**Next Steps**: Configure database, test endpoints, deploy to Render!
