require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const formRoutes = require('./routes/form')
const responseRoutes = require('./routes/response')

// express app
const app = express()

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/forms', formRoutes)
app.use('/api/responses', responseRoutes)

//handling not found routes and errors
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Something went wrong.',
    },
  })
})

// connect to db
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('connected to database and listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 