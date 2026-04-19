require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const institutionRoutes = require('./routes/institutions');
const studentRoutes = require('./routes/student');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superadmin');

const User = require('./models/User');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.NODE_ENV === 'development') {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('Database is empty, running seed...');
        const { seedData } = require('./seed/seed.js');
        await seedData();
        console.log('Seed process completed successfully.');
      }
    }

    app.listen(PORT, () => {
      console.log(`CampusAtlas AI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error?.message || error);
    process.exit(1);
  }
};

startServer();
