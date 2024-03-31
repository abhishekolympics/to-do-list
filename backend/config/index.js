require('dotenv').config();

const config = {
  // Database configuration
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  },
  // Server configuration
  server: {
    port: process.env.PORT || 5000
  },
  jwtSecret: process.env.JWT_SECRET
};

module.exports = config;
