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
    {
      id: 5,
      user_name: 'test-user-5',
      first_name: 'Test 5',
      last_name: 'User 5',
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
      shop_id: shops[4].id,
    },
    {
      id: 6,
      drink_name: 'Sixth test drink!',
      shop_id: shops[5].id,
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
      user_id: users[1].id,
      rating: 2,
    },
    {
      id: 3,
      drink_id: drinks[2].id,
      user_id: users[2].id,
      rating: 3,
    },
    {
      id: 4,
      drink_id: drinks[3].id,
      user_id: users[3].id,
      rating: 4,
    },
    {
      id: 5,
      drink_id: drinks[4].id,
      user_id: users[4].id,
      rating: 5,
    },
  ]
}

function makeCommentsArray(shops, users) {
  return [
    {
      id: 1,
      text: 'Test Comment 1',
      shop_id: shops[0].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      drink_id: drinks[1].id,
      user_id: users[1].id,
      rating: 2,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      drink_id: drinks[2].id,
      user_id: users[2].id,
      rating: 3,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      drink_id: drinks[3].id,
      user_id: users[3].id,
      rating: 4,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 5,
      drink_id: drinks[4].id,
      user_id: users[4].id,
      rating: 5,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

module.exports = {
  makeUsersArray,
  makeShopsArray,
  makeDrinksArray,
  makeRatingsArray,
  makeCommentsArray,
}