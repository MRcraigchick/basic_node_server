const bcrypt = require('bcrypt');
const { rx } = require('../lib/regexps');
const { getTomorowsDate } = require('../lib/helpers');
const { signUpError } = require('../templates/signUpError');
const { loginError } = require('../templates/loginError');
const { get_db } = require('../db/sqlite3_connector');
const { v4: uuid4 } = require('uuid');
let dateTomorow = getTomorowsDate().toString('utf8');
if (dateTomorow.includes('(')) {
  dateTomorow = dateTomorow.split('(')[0];
}

console.log(dateTomorow);

function POST(req, res) {
  const cookie = req.headers.cookie;
  console.log(cookie);
  if (req.url === '/newuser') {
    handleUserData(req, res);
  } else if (req.url === '/loginuser') {
    handleUserLoginData(req, res);
  }
}

function handleUserData(req, res) {
  req.on('data', (data) => {
    data = parseHTMLFormData(data);
    req.emit('validate', data);
  });
  req.on('validate', (data) => {
    let user = data;
    let errors = {
      top: '',
      email: '',
      username: '',
      password: '',
    };
    console.log('validating');

    if (user.email === '') {
      errors.email = 'An email is required';
    }
    if (user.username === '') {
      errors.username = 'A username is required';
    }
    if (user.password === '') {
      errors.password = 'A password is required';
    }
    if (!Object.values(errors).some((value) => value !== '')) {
      user.email = user.email.split('%40').join('@');

      if (!rx.email.test(user.email)) {
        errors.email = 'Invalid email';
      }
      if (user.username.length < 6 || user.username.length > 16) {
        errors.username = 'Username must be at least 6 and no more than 16 characters long';
      }
      if (!rx.pword.test(user.password)) {
        errors.password =
          'Password must contain at least one upper case, one lower case, one number, one special character and be at least 8 and no more than 16 characters long';
      }
    }

    if (Object.values(errors).some((value) => value !== '')) {
      console.log(errors);
      res.end(signUpError(user, errors));
    } else {
      const db = get_db();
      db.get('SELECT * FROM user WHERE email = ?', [user.email], (err, row) => {
        if (err) {
          console.log(err);
          res.header(500);
          res.end();
        }
        if (row !== undefined) {
          errors.email = 'This email already exists';
          res.end(signUpError(user, errors));
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
    let errors = {
      top: '',
      email: '',
      password: '',
    };
    console.log('validating');

    if (user.email === '') {
      errors.email = 'An email is required';
    }
    if (user.password === '') {
      errors.password = 'A password is required';
    }
    if (!Object.values(errors).some((value) => value !== '')) {
      user.email = user.email.split('%40').join('@');

      if (!rx.email.test(user.email)) {
        errors.top = 'The password or email that you have entered is incorrect';
      }
    }
    if (Object.values(errors).some((value) => value !== '')) {
      console.log(errors);
      res.end(loginError(user, errors));
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
            const session_key = uuid4();
            bcrypt.hash(session_key, 10, (err, hash) => {
              db.run('INSERT INTO user_key (key, user_id) VALUES(?, ?)', [hash, row.user_id]);
              res.writeHead(302, {
                'Set-Cookie': `id=${session_key}; expires=${dateTomorow}; HttpOnly`,
                'Location': '/dashboard',
              });
              res.end();
            });
          } else {
            errors.top = 'The password or email that you have entered is incorrect';
            res.end(loginError(user, errors));
          }
        });
      });
    }
  });
}

function handleUserLogOut(req, res) {
  return;
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
