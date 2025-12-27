const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error('MONGODB_URI is not set');
    err.statusCode = 500;
    throw err;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 8000),
  });
  return mongoose.connection;
}

module.exports = { connectMongo };
