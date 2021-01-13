const express = require('express')
const RatingsService = require('./ratings-service')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const ratingsRouter = express.Router()

const serializeRating = rating => ({
  id: rating.id,
  user_id: rating.user_id,
  drink_id: rating.drink_id,
  rating: rating.rating
})

const serializeRatingByDrinks = drink => ({
  id: drink.drink_id,
  drink_name: drink.drink_name,
  shop_name: drink.shop_name,
  average_rating: drink.average,
  rating_count: drink.count,
})

ratingsRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')

    RatingsService.getRatingsByDrinks(db)
      .then(drinks => {
        res.json(drinks.map(serializeRatingByDrinks))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { drink_id, rating } = req.body
    const newRating = { drink_id, rating }

    for (const [key, value] of Object.entries(newRating))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newRating.user_id = req.user.id

    RatingsService.insertRating(
      req.app.get('db'),
      newRating
    )
      .then(rating => {
        res
          .status(201)
          .json(serializeRating(rating))
      })
      .catch(next)
  })

  ratingsRouter
    .route('/:rating_id')
    .patch(requireAuth, jsonParser, (req, res, next) => {
      const newRating = req.body.rating

      RatingsService.updateRating(
        req.app.get('db'),
        req.params.rating_id,
        newRating
      )
        .then(rating => {
          res
            .status(201)
            .json(serializeRating(rating))
        })
        .catch(next)
    })

  ratingsRouter
  .route('/shops/:shop_id')
  .get((req, res, next) => {
    const db = req.app.get('db')

    RatingsService.getDrinkRatingsByShop(db, req.params.shop_id)
      .then(ratings => {
        res.json(ratings.map(serializeRatingByDrinks))
      })
      .catch(next)
  })

// async/await syntax for promises 
async function checkRatingExists(req, res, next) {
  try {
    const rating = await RatingsService.getById(
      req.app.get('db'),
      req.params.rating_id
    )

    if (!rating)
      return res.status(404).json({
        error: `Rating doesn't exist`
      })

    res.rating = rating
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = ratingsRouter