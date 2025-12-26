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
  if (!initPromise) initPromise = init();
  await initPromise;
  return app(req, res);
};

