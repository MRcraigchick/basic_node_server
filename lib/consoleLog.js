const chalk = require('chalk');

function logRequestsToConsole(req, res) {
  console.log(`
  ${chalk.bold.magenta(req.method)}: ${chalk.bold.blue(req.url)}`);
}

module.exports = { logRequestsToConsole };
