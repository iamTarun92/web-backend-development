const express = require('express')
const { connectMongoDb } = require('./connection')
const { HOSTNAME, DB_NAME, PORT } = require('./config')
const userRoute = require('./routes/user')
const { configureMiddlewares, logReqRes } = require('./middlewares')

// App Initialization
const app = express()
const port = PORT || 8000

// Call middleware function
configureMiddlewares(app)
app.use(logReqRes('access.log'))

// Restful API routes
app.use('/api/users', userRoute)

// Connect to MongoDB and start the server
connectMongoDb(`mongodb://${HOSTNAME}:27017/${DB_NAME}`)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  })
  .catch((error) => console.log('error', error))
