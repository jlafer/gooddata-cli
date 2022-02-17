/*
  This module supports the 'report' command of the 'gdutil' CLI program.
*/
const {writeToTextFile} = require('jlafer-node-util');
const error = require('../src/error');
const {login} = require('../src/access');
const {exportReport} = require('../src/reports');

module.exports = (args) => {
  const {user, pswd, wrkspc, obj, filters} = args;
  const filterExprs = (filters) ? JSON.parse(filters) : null;
  const path = `/tmp/${wrkspc}_${obj}.csv`;
  login(user, pswd)
  .then((res) => {
    return exportReport(res.tempToken, wrkspc, obj, filterExprs);
  })
  .then((data) => {
    writeToTextFile(path, data);
  })
  .then(() => {
    console.log(`report file written to ${path}`)
  })
  .catch(err => {
    console.log('error:', err)
    error(`${err}`, true);
  });
};