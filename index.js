const mongoose = require('mongoose')
const util = require('util')

//config should be imported before importing other file
const config = require('./config/config')
const app = require('./config/express')

const debug = require('debug')('dev:index')

mongoose.Promise = global.Promise

const mongoUri = config.mongo.host
mongoose.connect(mongoUri, {
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
})
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
  })
}

if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} ${config.env}`)
  })
}

module.exports = app