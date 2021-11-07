const path = require('path');

const { create_db, executeScript } = require('./sqlite3_connector');

const createDB = new Promise((resolve, reject) => {
  resolve(create_db());
});

createDB
  .then(() => {
    executeScript(`DROP TABLE IF EXISTS user;

    CREATE TABLE user(
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );`);
  })
  .catch((error) => console.log(error));
