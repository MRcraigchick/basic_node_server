const bcrypt = require('bcrypt');
const { rx } = require('../lib/regexps');
const { signUpError } = require('../templates/signUpError');
const { loginError } = require('../templates/loginError');
const oneDayCookieAge = 3600 * 24;

const { get_db } = require('../db/sqlite3_connector');

function POST(req, res) {
  if (req.url === '/newuser') {
    handleuserData(req, res);
  } else if (req.url === '/loginuser') {
    handleUserLoginData(req, res);
  }
}

function handleuserData(req, res) {
  req.on('data', (data) => {
    data = parseHTMLFormData(data);
    req.emit('validate', data);
  });
  req.on('validate', (data) => {
    let user = data;
    let error = '';
    console.log('validating');

    if (user.email === '') {
      error = ['email', 'An email is required'];
    } else if (user.username === '') {
      error = ['username', 'A username is required'];
    } else if (user.password === '') {
      error = ['password', 'A password is required'];
    }
    if (error === '') {
      user.email = user.email.split('%40').join('@');
      if (!rx.email.test(user.email)) {
        console.log(user.email);
        error = ['email', 'Invalid email'];
      } else if (user.username.length < 6 || user.username.length > 16) {
        error = ['username', 'Username must be at least 6 and no more than 16 characters long'];
      } else if (!rx.pword.test(user.password)) {
        error = [
          'password',
          'Password must contain at least one upper case, one lower case, one number, one special character and be at least 8 and no more than 16 characters long',
        ];
      }
    }

    if (error !== '') {
      console.log(error);
      res.end(signUpError(user, error));
    } else {
      const db = get_db();
      db.get('SELECT * FROM user WHERE email = ?', [user.email], (err, row) => {
        if (err) {
          console.log(err);
          res.header(500);
          res.end();
        }
        if (row !== undefined) {
          res.end(signUpError(['email', 'This email already exists']));
          return;
        }
      });
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          res.header(500);
          res.end();
        }
        db.run(
          'INSERT INTO user(email, username, password) VALUES(?,?,?)',
          [user.email, user.username, hash],
          (err) => {
            if (err) {
              console.log(err);
              res.header(500);
              res.end();
            } else {
              res.writeHead(302, {
                'Location': '/login',
              });
              res.end();
            }
          }
        );
      });
    }
  });
}

function handleUserLoginData(req, res) {
  req.on('data', (data) => {
    data = parseHTMLFormData(data);
    req.emit('validate', data);
  });
  req.on('validate', (data) => {
    let user = data;
    let error = '';
    console.log('validating');

    if (user.email === '') {
      error = ['email', 'An email is required'];
    } else if (user.password === '') {
      error = ['password', 'A password is required'];
    }
    if (error === '') {
      user.email = user.email.split('%40').join('@');
      if (!rx.email.test(user.email)) {
        error = ['email', 'Invalid email'];
      }
    }

    if (error !== '') {
      console.log(error);
      res.end(loginError(user, error));
    } else {
      const db = get_db();
      db.get('SELECT * FROM user WHERE email = ?', [user.email], (err, row) => {
        if (err) {
          console.log(err);
          res.header(500);
          res.end();
        }
        bcrypt.compare(user.password, row.password, (err, result) => {
          if (err) {
            console.log(err);
            res.header(500);
            res.end();
          }
          if (result) {
            res.writeHead(302, {
              'Set-Cookie': `id=${row.user_id} Max-Age=${oneDayCookieAge}`,
              'Location': '/dashboard',
            });
            res.end();
          } else {
            res.end(loginError(error));
          }
        });
      });
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
