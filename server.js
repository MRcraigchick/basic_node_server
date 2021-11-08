const chalk = require('chalk');
const http = require('http');
const path = require('path');
const { logRequestsToConsole } = require('./lib/consoleLog');
const { MIMEtype } = require('./lib/resHelpers');
const { GET } = require('./requests/GET');
const { POST } = require('./requests/POST');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;
const ROOT_DIR = path.join(__dirname, 'public');
process.env.DB = path.join(__dirname, 'db', 'instance', 'database.sqlite');

const server = http.createServer((req, res) => {
  logRequestsToConsole(req, res);

  res.writeHead(200, {
    'Content-type': MIMEtype(req.url),
  });

  if (req.method === 'GET') {
    GET(ROOT_DIR, req, res);
  }
  if (req.method === 'POST') {
    POST(req, res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`
${chalk.bold.yellow('SERVER')}: [ HOST: ${chalk.bold.white(HOST)}, PORT: ${chalk.bold.white(PORT)} ]
http://${HOST}:${PORT}
`);
});
