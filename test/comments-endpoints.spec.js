const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { makeUsersArray, makeShopsArray } = require('./boba.fixtures')

function makeShopsFixtures() {
  const testUsers = makeUsersArray()
  const testShops = makeShopsArray()
  return { testUsers, testShops }
}

describe('Comments Endpoints', function () {
  let db

  const {
    testUsers,
    testShops,
  } = makeShopsFixtures()

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

  describe(`POST /api/comments`, () => {
    beforeEach('insert articles', () =>
      helpers.seedDrinksTables(
        db,
        testUsers,
        testShops,
      )
    )

    it(`creates an comment, responding with 201 and the new comment`, function() {
      this.retries(3)
      const testShop = testShops[0]
      const testUser = testUsers[0]
      const newComment = {
        text: 'Test new comment',
        shop_id: testShop.id,
        user_id: testUser.id,
      }
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.text).to.eql(newComment.text)
          expect(res.body.shop_id).to.eql(newComment.shop_id)
          expect(res.body.user.id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`)
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('bobatier_comments')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.text).to.eql(newComment.text)
              expect(row.article_id).to.eql(newComment.article_id)
              expect(row.user_id).to.eql(newComment.user_id)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })
  })
})