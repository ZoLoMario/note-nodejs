module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_HOST: process.env.MONGODB_HOST || 'mongodb://localhost:27017',
  MONGODB_DB: process.env.MONGODB_DB || 'noteapp',
  DB_PREFIX: process.env.DB_PREFIX || 'no-'
}