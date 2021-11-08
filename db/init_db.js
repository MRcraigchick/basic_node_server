const path = require('path');
const fs = require('fs');

const { create_db, executeScript } = require('./sqlite3_connector');

const createDB = new Promise((resolve, reject) => {
  resolve(create_db());
});

createDB
  .then(() => {
    executeScript(fs.readFileSync(path.join(__dirname, 'schema.sql')));
  })
  .catch((error) => console.log(error));
