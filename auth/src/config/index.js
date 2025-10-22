require("dotenv").config(); //đọc các biến môi trường từ file .env

module.exports = {
  mongoURI: process.env.MONGODB_AUTH_URI,
  jwtSecret: process.env.JWT_SECRET || "secret",
};
