const mongoose = require('mongoose')
const util = require('util')
const http = require('http')
const Session = require('express-session')
const SocketIO = require('socket.io')
const redis = require('redis')
const connectRedis = require('connect-redis')





//config should be imported before importing other file
const config = require('./config/config')
const app = require('./config/express')
const socketConnectionHandlers = require('./server/service')

const server = http.Server(app)

const debug = require('debug')('dev:index')


// Mongodb Store
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
// Session database (Redis)
const redisClient = redis.createClient()
const RedisStore = connectRedis(Session)
const dbSession = new RedisStore({
  client: redisClient,
  host: config.redis.host,
  port: config.redis.port,
  prefix: config.redis.prefix,
  disableTTL: true,
})


// Session

const session = new Session({
  resave: true,
  saveUninitialized: true,
  key: 'ABCED',
  secret: '12345', //config.session.secret,
  store: dbSession,
})
app.use(session)

//Socket.IO

const io = SocketIO(server)
io.use((socket, next) => {
  session(socket.handshake, {}, next)
})

io.on('connection', socketConnectionHandlers)


if (!module.parent) {
  server.listen(config.port, () => {
    console.info(`server started on port ${config.port} ${config.env}`)
  })
}

module.exports = server