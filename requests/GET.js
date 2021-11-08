const path = require('path');
const { dashboard } = require('../templates/dashboard');
const { readFile } = require('../lib/resHelpers');
const { get_db } = require('../db/sqlite3_connector');

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
  const user = { [idCookie[0]]: Number(idCookie[1]) };
  const db = get_db();
  db.get('SELECT * FROM user WHERE user_id = ?', [user.id], (err, row) => {
    if (err) {
      console.log(err);
      res.header(500);
      res.end();
    }
    res.end(dashboard(row));
  });
}

function parseCookie(key, req) {
  return req.headers.cookie
    .split(' ')
    .map((x) => x.split('='))
    .filter((y) => (y[0] === key ? y : null))[0];
}

module.exports = { GET };
