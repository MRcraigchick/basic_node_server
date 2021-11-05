const path = require('path');
const { readFile } = require('../lib/resHelpers');

function GET(root, req, res) {
  const extension = path.extname(req.url).split('.')[1];

  if (req.url === '/') {
    res.write(readFile(root, req.url + 'index.html'));
  } else if (extension === undefined) {
    console.log('hello');
    res.write(readFile(root, req.url + '.html'));
  } else {
    try {
      res.write(readFile(root, req.url));
    } catch {
      null;
    }
  }
}

module.exports = { GET };
