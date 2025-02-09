const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { Client } = require("pg");
require("dotenv").config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

async function ensureDatabaseExists() {
  const client = new Client({
    user: config.username,
    host: config.host,
    password: config.password,
    port: 5432,
    database: "postgres", // Connect to default DB
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${config.database}'`);
    
    if (res.rowCount === 0) {
      console.log(`Database "${config.database}" does not exist. Creating now...`);
      await client.query(`CREATE DATABASE "${config.database}"`);
      console.log(`✅ Database "${config.database}" created successfully!`);
    } else {
      console.log(`✅ Database "${config.database}" already exists.`);
    }
  } catch (err) {
    console.error("❌ Error checking/creating database:", err);
  } finally {
    await client.end();
  }
}

async function connectDatabase() {
  await ensureDatabaseExists();

  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  try {
    await sequelize.authenticate();
    console.log("🚀 Connected to the database successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }

  return sequelize;
}

let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
