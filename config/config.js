const Joi = require('joi')

require('dotenv').config()

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.strict()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('MongoDB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  REDIS_HOST: Joi.string().required()
    .description('Redis host url'),
  REDIS_PORT: Joi.number().required()
    .default(6379),
  PREFIX: Joi.string().description('redis prefix')
}).unknown()
.required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)

if( error ) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    prefix: envVars.PREFIX,
  }
}


module.exports = config