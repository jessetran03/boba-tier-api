require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const shopsRouter = require('./shops/shops-router')
const drinksRouter = require('./drinks/drinks-router')
const ratingsRouter = require('./ratings/ratings-router')
const commentsRouter = require('./comments/comments-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/shops', shopsRouter)
app.use('/api/drinks', drinksRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/comments', commentsRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app