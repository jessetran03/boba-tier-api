const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { makeUsersArray, makeShopsArray, makeDrinksArray, makeRatingsArray } = require('./boba.fixtures')

function makeBobaFixtures() {
  const testUsers = makeUsersArray()
  const testShops = makeShopsArray()
  const testDrinks = makeDrinksArray(testShops)
  const testRatings = makeRatingsArray(testDrinks, testUsers)
  return { testUsers, testShops, testDrinks, testRatings }
}

describe('Ratings Endpoints', function () {
  let db

  const {
    testUsers,
    testShops,
    testDrinks,
    testRatings,
  } = makeBobaFixtures()

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

  describe(`GET /api/ratings`, () => {
    context(`Given no ratings`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/ratings')
          .expect(200, [])
      })
    })

    context('Given there are ratings in the database', () => {
      beforeEach('insert ratings', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
          testDrinks,
          testRatings,
        )
      )

      it('responds with 200 and all of the ratings', () => {
          const expectedRatings = [
            {
              id: 5,
              drink_name: 'Fifth test drink!',
              shop_name: 'Fifth test shop!',
              average_rating: '5.0000000000000000',
              rating_count: '1'
            },
            {
              id: 4,
              drink_name: 'Fourth test drink!',
              shop_name: 'Fourth test shop!',
              average_rating: '4.0000000000000000',
              rating_count: '1'
            },
            {
              id: 3,
              drink_name: 'Third test drink!',
              shop_name: 'Third test shop!',
              average_rating: '3.0000000000000000',
              rating_count: '1'
            },
            {
              id: 2,
              drink_name: 'Second test drink!',
              shop_name: 'Second test shop!',
              average_rating: '2.0000000000000000',
              rating_count: '1'
            },
            {
              id: 1,
              drink_name: 'First test drink!',
              shop_name: 'First test shop!',
              average_rating: '1.00000000000000000000',
              rating_count: '1'
            }
          ]
        return supertest(app)
          .get('/api/ratings')
          .expect(200, expectedRatings)
      })
    })
  })
})