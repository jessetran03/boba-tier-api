const express = require('express')
const ShopsService = require('./shops-service')
const xss = require('xss')

const shopsRouter = express.Router()

const serializeshop = shop => ({
  id: shop.id,
  shop_name: xss(shop.shop_name),
  muscle: shop.muscle,
})

shopsRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')
    ShopsService.getAllShops(db)
      .then(shops => {
        res.json(shops.map(serializeshop))
      })
      .catch(next)
  })

shopsRouter
  .route('/:shop_id')
  .all(checkShopExists)
  .get((req, res, next) => {
    res.json({
      id: res.shop.id,
      shop_name: res.shop.shop_name,
      city: res.shop.city,
    })
  })

async function checkShopExists(req, res, next) {
  try {
    const shop = await ShopsService.getById(
      req.app.get('db'),
      req.params.shop_id
    )

    if (!shop)
      return res.status(404).json({
        error: `shop doesn't exist`
      })

    res.shop = shop
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = shopsRouter