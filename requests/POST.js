const { get_db } = require('../db/sqlite3_connector');
const { GET } = require('./GET');

function POST(root, req, res) {
  if (req.url === '/success') {
    let newUser = {};
    req.on('data', (data) => {
      data = data.toString('utf8').split('&');
      data = data.map((kv) => kv.split('='));
      for (let pair of data) {
        newUser[pair[0]] = pair[1];
      }
    });
    req.on('end', () => {
      const db = get_db();
      if (newUser.username !== '' && newUser.password !== '') {
        db.run('INSERT INTO user(username, password) VALUES(?, ?)', [newUser.username, newUser.password], (error) => {
          if (error) {
            return console.error(error);
          } else {
            console.log(`
            New user ${newUser.username} inserted into database
            `);
          }
        });
      }
    });
  }
}

module.exports = { POST };
