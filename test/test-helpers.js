const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      first_name: 'Test 1',
      last_name: 'User 1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      first_name: 'Test 2',
      last_name: 'User 2',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      first_name: 'Test 3',
      last_name: 'User 3',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      first_name: 'Test 4',
      last_name: 'User 4',
      password: 'password',
    },
  ]
}

function makeShopsArray() {
  return [
    {
      id: 1,
      shop_name: 'First test shop!',
      city: 'Test',
      state: 'TX',
    },
    {
      id: 2,
      shop_name: 'Second test shop!',
      city: 'Test',
      state: 'TX',
    },
    {
      id: 3,
      shop_name: 'Third test shop!',
      city: 'Test',
      state: 'TX',
    },
    {
      id: 4,
      shop_name: 'Fourth test shop!',
      city: 'Test',
      state: 'TX',
    },
    {
      id: 5,
      shop_name: 'Fifth test shop!',
      city: 'Test',
      state: 'TX',
    },
    {
      id: 6,
      shop_name: 'Sixth test shop!',
      city: 'Test',
      state: 'TX',
    },
    {
      id: 7,
      city: 'Test',
      state: 'TX',
      shop_name: 'Seventh test shop!',
    },
  ];
}

function makeDrinksArray(shops) {
  return [
    {
      id: 1,
      drink_name: 'First test drink!',
      shop_id: shops[0].id,
    },
    {
      id: 2,
      drink_name: 'Second test drink!',
      shop_id: shops[1].id,
    },
    {
      id: 3,
      drink_name: 'Third test drink!',
      shop_id: shops[2].id,
    },
    {
      id: 4,
      drink_name: 'Fourth test drink!',
      shop_id: shops[3].id,
    },
    {
      id: 5,
      drink_name: 'Fifth test drink!',
      shop_id: shops[0].id,
    },
    {
      id: 6,
      drink_name: 'Sixth test drink!',
      shop_id: shops[1].id,
    },
  ]
}

function makeRatingsArray(drinks, users) {
  return [
    {
      id: 1,
      drink_id: drinks[0].id,
      user_id: users[0].id,
      rating: 1,
    },
    {
      id: 2,
      drink_id: drinks[1].id,
      user_id: users[0].id,
      rating: 2,
    },
    {
      id: 3,
      drink_id: drinks[2].id,
      user_id: users[0].id,
      rating: 3,
    },
    {
      id: 4,
      drink_id: drinks[1].id,
      user_id: users[1].id,
      rating: 4,
    },
    {
      id: 5,
      drink_id: drinks[2].id,
      user_id: users[1].id,
      rating: 5,
    },
    {
      id: 6,
      drink_id: drinks[3].id,
      user_id: users[1].id,
      rating: 1,
    },
    {
      id: 7,
      drink_id: drinks[2].id,
      user_id: users[2].id,
      rating: 2,
    },
    {
      id: 8,
      drink_id: drinks[3].id,
      user_id: users[2].id,
      rating: 3,
    },
    {
      id: 9,
      drink_id: drinks[4].id,
      user_id: users[2].id,
      rating: 4,
    },
  ];
}

function makeExpectedDrink(drink) {
  return {
    id: drink.id,
    drink_name: drink.drink_name,
    shop_id: drink.shop_id,
  }
}

function makeExpectedRatings(ratings, drink) {
  const expectedRatings = ratings

  return expectedRatings.map(rating => {
    return {
      id: rating.id,
      drink_id: rating.drink_id,
      shop_id: rating.shop_id,
    }
  })
}

function makeMaliciousDrink(shop) {
  const maliciousDrink = {
    id: 911,
    drink_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    shop_id: shop.id,
  }
  const expectedDrink = {
    ...makeExpectedDrink([shop], maliciousDrink),
    drink_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
  }
  return {
    maliciousDrink,
    expectedDrink,
  }
}

function makeDrinksFixtures() {
  const testUsers = makeUsersArray()
  const testShops = makeShopsArray()
  const testDrinks = makeDrinksArray(testShops)
  const testRatings = makeRatingsArray(testDrinks, testUsers)
  return { testUsers, testShops, testDrinks, testRatings }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        bobatier_comments,
        bobatier_ratings,
        bobatier_drinks,
        bobatier_shops,
        bobatier_users;
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE bobatier_drinks_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE bobatier_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE bobatier_shops_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('bobatier_drinks_id_seq', 0)`),
        trx.raw(`SELECT setval('bobatier_users_id_seq', 0)`),
        trx.raw(`SELECT setval('bobatier_shops_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('bobatier_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('bobatier_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedShops(db, shops) {
  return db.into('bobatier_shops').insert(shops)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('bobatier_shops_id_seq', ?)`,
        [shops[shops.length - 1].id],
      )
    )
}

function seedDrinksTables(db, users, shops = [], drinks = [], ratings=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await seedShops(trx, shops)
    await trx.into('bobatier_drinks').insert(drinks)
    // update the auto sequence to match the forced id values
    if(drinks.length == 0) {
      return
    }
    await trx.raw(
      `SELECT setval('bobatier_drinks_id_seq', ?)`,
      [drinks[drinks.length - 1].id],
    )
    // only insert ratings if there are some, also update the sequence counter
    if (ratings.length) {
      await trx.into('bobatier_ratings').insert(ratings)
      await trx.raw(
        `SELECT setval('bobatier_ratings_id_seq', ?)`,
        [ratings[ratings.length - 1].id],
      )
    }
  })
}

function seedMaliciousDrink(db, shop, drink) {
  return seedShops(db, [shop])
    .then(() =>
      db
        .into('bobatier_drinks')
        .insert([drink])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeShopsArray,
  makeDrinksArray,
  makeRatingsArray,
  makeExpectedDrink,
  makeExpectedRatings,
  makeMaliciousDrink,

  makeDrinksFixtures,
  cleanTables,
  seedShops,
  seedDrinksTables,
  seedMaliciousDrink,
  makeAuthHeader,
  seedUsers,
}