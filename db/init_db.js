const path = require('path');

const { create_db, executeScript } = require('./sqlite3_connector');
const schema = process.argv[3];

const createDB = new Promise((resolve, reject) => {
  resolve(create_db());
});

createDB
  .then(() => {
    executeScript(path.join(__dirname, schema));
  })
  .catch((error) => console.log(error));
