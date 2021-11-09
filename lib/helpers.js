const fs = require('fs');
const path = require('path');
const { MIMEtype } = require('./MIME');

function readFile(root, file) {
  const filePath = path.join(root, file);
  try {
    return fs.readFileSync(filePath);
  } catch {
    console.log(`Failed to read ${filePath}`);
  }
}

function getTomorowsDate() {
  const date = new Date(new Date());
  date.setDate(date.getDate() + 1);
  return date;
}

module.exports = {
  MIMEtype,
  readFile,
  getTomorowsDate,
};
