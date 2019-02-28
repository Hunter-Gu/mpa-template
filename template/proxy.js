const proxy = require('express-http-proxy')
const proxyTable = require('./proxy-table')

module.exports = function (app) {
  app.use('/api/', proxy(proxyTable.test))
}
