const fs = require('fs');
const path = require('path');
const sl3 = require('sqlite3').verbose();
const instance_path = path.join(__dirname, 'instance');
const dbFileName = process.argv[2];

// A CLI function that takes the first argument of the command as the file name and creates
// the file inside a newly created folder called instance
// then sets a new property on process.env call DB as the path to the file
function create_db() {
  if (!fs.existsSync(instance_path)) {
    fs.mkdirSync(instance_path);
  }
  if (!fs.existsSync(path.join(instance_path, dbFileName))) {
    fs.closeSync(fs.openSync(path.join(instance_path, dbFileName), 'w'));
  }
  process.env.DB = path.join(instance_path, dbFileName);
  console.log('\n<-- Created database -->');
}

// process.env.DB must be set as the path of the database file before connection
function get_db() {
  return new sl3.Database(process.env.DB, sl3.OPEN_READWRITE, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('\n<-- Connected to the database -->');
    }
  });
}

// process.env.DB must be set as the path of the database file before connection
// The function takes an argument of sqlScript defining a schema.sql or a query
// to be executeed on the database defined at process.env.DB
function executeScript(sqlScript) {
  const db = get_db();
  if (fs.existsSync(sqlScript)) {
    sqlScript = fs.readFileSync(sqlScript, { encoding: 'utf8' }).toString().split(';');
  } else {
    sqlScript = sqlScript.toString('utf8').split(';');
  }
  sqlScript = sqlScript.filter((x) => x !== '');
  console.log(`\nSQL script: ${sqlScript}\n`);
  db.serialize(() => {
    db.run('PRAGMA foreign_keys=OFF;');
    db.run('BEGIN TRANSACTION;');
    for (let query of sqlScript) {
      query += ';';
      db.run(query !== ';' ? query : null);
    }
    db.run('COMMIT');
  });
  console.log('<-- Executed script on the database -->\n');
  db.close((err) => {
    if (err) {
      console.log(`\nClose error: ${err}`);
    } else {
      console.log('<-- Closed connection to the database -->\n');
    }
  });
}

module.exports = { create_db, get_db, executeScript };
