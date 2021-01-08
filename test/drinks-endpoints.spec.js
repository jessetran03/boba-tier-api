const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Drinks Endpoints', function () {
  let db

  const {
    testUsers,
    testShops,
    testDrinks,
    testRatings,
  } = helpers.makeDrinksFixtures()

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

  describe(`GET /api/drinks`, () => {
    context(`Given no drinks`, () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
        )
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/drinks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are drinks in the database', () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
          testDrinks,
          testRatings,
        )
      )

      it('responds with 200 and all of the drinks', () => {
        const expectedDrinks = testDrinks
          .map(drink =>
            helpers.makeExpectedDrink(drink)
          )
        return supertest(app)
          .get('/api/drinks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedDrinks)
      })
    })

    context(`Given an XSS attack drink`, () => {
      const testShop = helpers.makeShopsArray()[1]
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousDrink,
        expectedDrink,
      } = helpers.makeMaliciousDrink(testShop)

      beforeEach('insert malicious drink', () => {
        return helpers.seedMaliciousDrink(
          db,
          testShop,
          maliciousDrink,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/drinks`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedDrink.title)
            expect(res.body[0].content).to.eql(expectedDrink.content)
          })
      })
    })
  })

  describe(`GET /api/drinks/:drink_id`, () => {
    context(`Given no drinks`, () => {
      beforeEach(() =>
        helpers.seedShops(db, testShops)
      )

      it(`responds with 404`, () => {
        const drinkId = 123456
        return supertest(app)
          .get(`/api/drinks/${drinkId}`)
          .expect(404, { error: `Drink doesn't exist` })
      })
    })

    context('Given there are drinks in the database', () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
          testDrinks,
          testRatings,
        )
      )

      it('responds with 200 and the specified drink', () => {
        const drinkId = 2
        const expectedDrink = helpers.makeExpectedDrink(
          testDrinks[drinkId - 1],
        )

        return supertest(app)
          .get(`/api/drinks/${drinkId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedDrink)
      })
    })

    context(`Given an XSS attack drink`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const testShop = helpers.makeShopsArray()[1]
      const {
        maliciousDrink,
        expectedDrink,
      } = helpers.makeMaliciousDrink(testUser)

      beforeEach('insert malicious drink', () => {
        return helpers.seedMaliciousDrink(
          db,
          testShop,
          maliciousDrink,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/drinks/${maliciousDrink.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedDrink.title)
            expect(res.body.content).to.eql(expectedDrink.content)
          })
      })
    })
  })

  describe(`GET /api/drinks/shops/:shop_id`, () => {
    context(`Given no drinks`, () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
        )
      )
      it(`responds with 200 and an empty list`, () => {
        const shopId = 123456
        return supertest(app)
          .get(`/api/drinks/shops/${shopId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are drinks in the database', () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
          testDrinks,
          testRatings,
        )
      )

      it('responds with 200 and all of the drinks', () => {
        const shopId = 2
        const expectedDrinks = [
          {
            id: 2,
            drink_name: 'Second test drink!',
            shop_id: 2,
            user_id: 1,
            rating_id: 2,
            rating: 2
          },
          {
            id: 6,
            drink_name: 'Sixth test drink!',
            shop_id: 2,
            user_id: null,
            rating_id: null,
            rating: null
          }
        ]
        return supertest(app)
          .get(`/api/drinks/shops/${shopId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedDrinks)
      })
    })
  })

  describe(`GET /api/drinks/ratings/:shop_id`, () => {
    context(`Given no drinks`, () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
        )
      )
      it(`responds with 200 and an empty list`, () => {
        const shopId = 123456
        return supertest(app)
          .get(`/api/drinks/ratings/${shopId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are drinks in the database', () => {
      beforeEach('insert drinks', () =>
        helpers.seedDrinksTables(
          db,
          testUsers,
          testShops,
          testDrinks,
          testRatings,
        )
      )

      it('responds with 200 and all of the drinks', () => {
        const shopId = 2
        const expectedDrinks = [
            {
              id: 2,
              drink_name: 'Second test drink!',
              shop_id: 2,
              shop_name: 'Second test shop!',
              user_id: 1,
              rating_id: 2,
              rating: 2
            }
          ]
        return supertest(app)
          .get(`/api/drinks/ratings/${shopId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedDrinks)
      })
    })
  })
})