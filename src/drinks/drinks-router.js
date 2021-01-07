const express = require('express')
const DrinksService = require('./drinks-service')
const xss = require('xss')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const drinksRouter = express.Router()

const serializeDrink = drink => ({
  id: drink.id,
  drink_name: xss(drink.drink_name),
  shop_id: drink.shop_id,
})

const serializeDrinkWithRating = drink => ({
  id: drink.id,
  drink_name: drink.drink_name,
  shop_id: drink.shop_id,
  user_id: drink.user_id,
  rating_id: drink.rating_id,
  rating: drink.rating
})

drinksRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')

    DrinksService.getAllDrinks(db)
      .then(drinks => {
        res.json(drinks.map(serializeDrink))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { drink_name, shop_id } = req.body
    const newDrink = { drink_name, shop_id }

    for (const [key, value] of Object.entries(newDrink))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    DrinksService.insertDrink(
      req.app.get('db'),
      newDrink
    )
      .then(drink => {
        res
          .status(201)
          .json(serializeDrink(drink))
      })
      .catch(next)
  })

drinksRouter
  .route('/:drink_id')
  .all(checkDrinkExists)
  .get((req, res) => {
    res.json(serializeDrink(res.drink))
  })
  .delete((req, res, next) => {
    DrinksService.deleteDrink(
      req.app.get('db'),
      req.params.drink_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  
drinksRouter
  .get('/rating/:shop_id', requireAuth, (req, res, next) => {
    const db = req.app.get('db')
    const shop_id = req.params.shop_id
    const user_id = req.user.id
    
    DrinksService.getDrinksWithRatings(db, shop_id, user_id)
      .then(drinks => {
        res.json(drinks.map(serializeDrinkWithRating))
      })
      .catch(next)
  })

drinksRouter
  .route('/shop/:shop_id')
  .get((req, res, next) => {
    const db = req.app.get('db')

    DrinksService.getByShop(db, req.params.shop_id)
      .then(drinks => {
        res.json(drinks.map(serializeDrink))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkDrinkExists(req, res, next) {
  try {
    const drink = await DrinksService.getById(
      req.app.get('db'),
      req.params.drink_id
    )

    if (!drink)
      return res.status(404).json({
        error: `Drink doesn't exist`
      })

    res.drink = drink
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = drinksRouter