const { loadEnv } = require('../src/config/env');
const { connectMongo } = require('../src/config/db');
const { ensureSeedData } = require('../src/utils/seed');
const { createApp } = require('../src/app');

let initPromise;
let app;

async function init() {
  loadEnv();
  await connectMongo();
  await ensureSeedData();
  app = createApp();
}

module.exports = async (req, res) => {
  try {
    if (req?.url && typeof req.url === 'string' && req.url.startsWith('/api/health')) {
      const missing = [];
      if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
      if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
      return res.status(200).json({
        ok: missing.length === 0,
        missing,
      });
    }

    if (!initPromise) initPromise = init();
    await initPromise;
    return app(req, res);
  } catch (err) {
    const status = err?.statusCode || 500;
    const message = err?.message || 'Internal Server Error';
    return res.status(status).json({ message });
  }
};
