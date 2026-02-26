const express = require('express')
const { configureMiddlewares, logReqRes } = require('./middlewares')
const { handelGetDesktopUsers } = require('./controllers/user')
const userRoute = require('./routes/user')

// App Initialization
const app = express()
const port = process.env.PORT || 8000

// Call middleware function
configureMiddlewares(app)
app.use(logReqRes('access.log'))

// Desktop users
app.get('/', handelGetDesktopUsers)

// Restful API routes
app.use('/api/users', userRoute)

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
})
