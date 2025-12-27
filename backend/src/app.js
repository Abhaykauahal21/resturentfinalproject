const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/orders.routes');
const settingsRoutes = require('./routes/settings.routes');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: false,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  const healthResponse = () => {
    const missing = [];
    if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
    return { ok: missing.length === 0, missing };
  };

  app.get('/', (req, res) => res.json({ service: 'quickserve-backend', ...healthResponse() }));
  app.get('/health', (req, res) => res.json(healthResponse()));
  app.get('/api/health', (req, res) => res.json(healthResponse()));

  app.use('/api/auth', authRoutes);
  app.use('/api/menu', menuRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/settings', settingsRoutes);

  app.use('/auth', authRoutes);
  app.use('/menu', menuRoutes);
  app.use('/orders', orderRoutes);
  app.use('/settings', settingsRoutes);

  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  return app;
}

module.exports = { createApp };
