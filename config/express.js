const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const expressWinston = require('express-winston')
const expressValidation = require('express-validation')
const httpStatus = require('http-status')

const winstonInstance = require('./winston')
const routes = require('../server/routes/index.route')
const config = require('./config')
const APIError = require('../server/helpers/APIError')


const app = express()

if (config.env === 'development') {
  app.use(logger('dev'))
}
//parse application/json
app.use(bodyParser.json())
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(compress())
app.use(methodOverride())
// secure apps by settings various HTTP headers
app.use(helmet())
//enable CORS - Cross Origin Resource Sharing
app.use(cors())


//enable detailed API loggin in dev env

if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, //log meta data about request 
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true //default green 3xx cyan 4xx yellow 5xx red
  }))
}


// mount all routes on /api path

app.use('/api', routes)

//if error is not an instanceOf APIError, convert it.

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    //Validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
}) 


// catch 404 and forward to error handler

app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

//log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }))
}

//error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
})


module.exports = app