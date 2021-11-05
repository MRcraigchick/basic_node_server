const path = require('path');

function MIMEtype(url) {
  const fileType = path.extname(url);
  let contentType = '';

  switch (fileType) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/js';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    default:
      contentType = 'text/html';
  }

  return contentType;
}

module.exports = {
  MIMEtype,
};
