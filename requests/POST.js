const { signUpError } = require('../templates/signUpError');
const { get_db } = require('../db/sqlite3_connector');

function POST(req, res) {
  if (req.url === '/newuser') {
    handleNewUserData(req, res);
  }
}

function handleNewUserData(req, res) {
  req.on('data', (data) => {
    data = parseHTMLFormData(data);
    req.emit('validate', data);
  });
  req.on('validate', (data) => {
    let newUser = data;
    let error = '';
    console.log('validating');

    if (newUser.email === '') {
      error = 'An email is required';
    } else if (newUser.username === '') {
      error = 'A username is required';
    } else if (newUser.password === '') {
      error = 'A password is required';
    }
    if (error === '') {
      newUser.email = newUser.email.split('%40').join('@');
    }
    if (error !== '') {
      res.end(signUpError(error));
    } else {
      const db = get_db();
      db.get('SELECT * FROM user WHERE email = ?', [newUser.email], (error, row) => {
        if (row !== undefined) {
          res.end(signUpError('This email already exists'));
          return;
        }
      });
      db.run(
        'INSERT INTO user(email, username, password) VALUES(?,?,?)',
        [newUser.email, newUser.username, newUser.password],
        (error) => {
          if (error) {
            console.log(error);
          } else {
            res.writeHead(302, {
              'Location': '/login',
            });
            res.end();
          }
        }
      );
    }
  });
}

function parseHTMLFormData(data) {
  let dataObj = {};
  data = data.toString('utf8').split('&');
  data = data.map((kv) => kv.split('='));
  for (let pair of data) {
    dataObj[pair[0]] = pair[1].toString('utf8');
  }
  return dataObj;
}

module.exports = { POST };
