const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Shops Endpoints', function() {
  let db

  const { testShops } = helpers.makeDrinksFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/shops`, () => {
    context(`Given no shops`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/shops')
          .expect(200, [])
      })
    })

    context('Given there are shops in the database', () => {
      beforeEach('insert shops', () =>
        helpers.seedShops(
          db,
          testShops,
        )
      )

      it('responds with 200 and all of the shops', () => {
        return supertest(app)
          .get('/api/shops')
          .expect(200, testShops)
      })
    })
  })
})