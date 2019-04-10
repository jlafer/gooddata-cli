/*
  This module supports the 'report' command of the 'gdutil' CLI program.
*/
const ora = require('ora');
const {writeToTextFile} = require('jlafer-node-util');
const error = require('../src/error');
const {login} = require('../src/access');
const {exportReport} = require('../src/reports');

module.exports = (args) => {
  const {user, pswd, wrkspc, obj, filters} = args;
  const spinner = ora().start();
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
    spinner.stop();
    console.log(`report file written to ${path}`)
  })
  .catch(err => {
    spinner.stop();
    console.log('error:', err)
    error(`${err}`);
  });
};