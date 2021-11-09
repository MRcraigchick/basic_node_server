const path = require('path');
const bcrypt = require('bcrypt');
const { dashboard } = require('../templates/dashboard');
const { readFile } = require('../lib/helpers');
const { get_db } = require('../db/sqlite3_connector');
const removeCookie = `id=null; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`;

function GET(root, req, res) {
  const extension = path.extname(req.url).split('.')[1];

  if (req.url === '/') {
    res.write(readFile(root, req.url + 'index.html'));
    res.end();
  } else if (req.url === '/dashboard') {
    loadUserDashboard(req, res);
  } else if (extension === undefined) {
    res.write(readFile(root, req.url + '.html'));
    res.end();
  } else {
    try {
      res.write(readFile(root, req.url));
      res.end();
    } catch {
      null;
    }
  }
}

function loadUserDashboard(req, res) {
  const idCookie = parseCookie('id', req);
  const userSession = { [idCookie[0]]: idCookie[1] };
  console.log(userSession);
  const db = get_db();

  db.all('SELECT * FROM user_key', [], (err, row) => {
    if (err) {
      console.log(err);
      res.header(500);
      res.end();
      return;
    }
    for (let data of row) {
      bcrypt.compare(userSession.id, data.key, (err, result) => {
        if (err) {
          console.log(err);
          res.header(500);
          res.end();
          return;
        }
        if (result) {
          db.get('SELECT * FROM user WHERE user_id = ?', [data.user_id], (err, row) => {
            if (err) {
              console.log(err);
              res.header(500);
              res.end();
              return;
            }
            res.end(dashboard(row));
          });
        } else {
          res.writeHead(302, {
            'Set-Cookie': removeCookie,
            'Location': '/login',
          });
        }
      });
    }

    return;
  });
}

function parseCookie(key, req) {
  return req.headers.cookie
    .split(';')
    .map((x) => x.split('='))
    .filter((y) => (y[0] === key ? y : null))[0];
}

module.exports = { GET };
