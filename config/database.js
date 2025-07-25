const { Sequelize } = require("sequelize");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql2 = require("mysql2");

const sequelize = new Sequelize({
  dialect: "mysql",
  dialectModule: mysql2,
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "laiyolobaru_db",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
