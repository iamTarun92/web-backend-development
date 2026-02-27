const express = require('express')
const path = require('path')
const { connectMongoDb } = require('./connection')
const { PORT, HOSTNAME, DB_NAME } = require('./config')
const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const { configureMiddlewares, logReqRes } = require('./middleware')

// Initialize Express app
const app = express()
const port = PORT || 8000

// Set EJS as the view engine and specify the views directory
app.set('view engine', 'ejs')

// Use path.resolve to get the absolute path to the views directory
app.set('views', path.resolve('./views'))

// Call middleware function
configureMiddlewares(app)
app.use(logReqRes('access.log'))

// Restful API routes
app.use('/', staticRoute)
app.use('/url', urlRoute)

// Connect to MongoDB and start the server
connectMongoDb(`mongodb://${HOSTNAME}:27017/${DB_NAME}`)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Express server is running on http://localhost:${port}`)
    })
  })
  .catch((error) => console.log(error))
