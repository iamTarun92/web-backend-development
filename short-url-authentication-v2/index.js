const express = require('express')
const path = require('path')

// Importing database connection and configuration
const { connectMongoDb } = require('./connection')
const { MONGO_URL, PORT } = require('./config')

// Importing routes
const staticRoute = require('./routes/staticRouter')
const urlRoute = require('./routes/url')
const userRoute = require('./routes/user')

// Importing middlewares
const { checkForAuthentication, restrictTo } = require('./middlewares/auth')
const { configureMiddlewares, logReqRes } = require('./middlewares/index')

// Importing models
const URL = require('./models/url')

// Initialize Express app
const app = express()
const port = PORT || 8000

connectMongoDb(MONGO_URL)
  .then(() => console.log('MongoDB server is running on ' + MONGO_URL))
  .catch((error) => console.log(error))

// Set up view engine and static files
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.static(path.join(__dirname, 'public')))

// Call middleware function
configureMiddlewares(app)
app.use(logReqRes('access.log'))
app.use(checkForAuthentication)

// Restful API routes
app.use('/', staticRoute)
app.use('/url', restrictTo(['normal', 'admin']), urlRoute)
app.use('/user', userRoute)
app.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamps: Date.now() },
        },
      },
      { new: true }, // This option ensures the updated document is returned
    )

    if (!entry) {
      return res.status(404).json({ message: 'URL not found1.' })
    }

    return res.redirect(entry.redirectUrl)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
