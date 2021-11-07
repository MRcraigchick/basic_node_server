const { get_db } = require('../db/sqlite3_connector');

function POST(root, req, res) {
  let newUser = {};
  let errors = [];
  if (req.url === '/success') {
    req
      .on('data', (data) => {
        newUser = parseFormData(data);
        const db = get_db();
        console.log(newUser.username);
        if (newUser.email === '') {
          console.log('sq');
          errors.push('An email is required');
        }
        if (newUser.username === '') {
          errors.push('A username is required');
        }
        if (newUser.username === '') {
          errors.push('A password is required');
        }

        db.all('SELECT * FROM user WHERE (email) = (?)', [newUser.email], (error, rows) => {
          if (error) {
            console.log(error);
          }
          if (rows[0] !== undefined) {
            errors.push('User already exists');
          }
        });
        console.log(errors);
        if (errors.length === 0) {
          newUser.email = newUser.email.split('%40').join('@');
          console.log(newUser);
          db.run(
            'INSERT INTO user(email, username, password) VALUES(?, ?, ?)',
            [newUser.email, newUser.username, newUser.password],
            (error) => {
              console.log(error);
            }
          );
        }
      })
      .on('end', () => {
        res.on('error', (error) => {
          console.log(error);
        });
      });
    console.log(errors);
    if (errors.length === 0) {
      res.writeHead(302, {
        'Location': '/login',
      });
      res.write(JSON.stringify(newUser));
      res.end();
    } else {
      res.write(`
<h1>Form Errors</h1>
<ul>
${errors.map((error) => {
  return '<li>' + error + '</li>';
})}
<ul>
`);
      res.end();
    }
  }
}

function parseFormData(data) {
  let dataObj = {};
  data = data.toString('utf8').split('&');
  data = data.map((kv) => kv.split('='));
  for (let pair of data) {
    dataObj[pair[0]] = pair[1].toString('utf8');
  }
  return dataObj;
}

module.exports = { POST };
