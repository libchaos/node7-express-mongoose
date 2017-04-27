const request = require('supertest-as-promised')
const httpStatus = require('http-status')
const {
  config,
  expect
} = require('chai')
const app = require('../../index')


config.includeStack = true

describe('## misc', () => {
  describe('# GET /api/', () => {
    it('should return ok', (done) => {
      request(app)
        .get('/api')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('ok')
          done()
        })
        .catch(done)
    })
  })
  describe('# GET /api/404', () => {
    it('should return 404 not found', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch(done)
    })
  })
})