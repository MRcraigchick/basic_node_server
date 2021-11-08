const path = require('path');
const { readFile } = require('../lib/resHelpers');

function GET(root, req, res) {
  const extension = path.extname(req.url).split('.')[1];

  if (req.url === '/') {
    res.write(readFile(root, req.url + 'index.html'));
    res.end();
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

module.exports = { GET };
