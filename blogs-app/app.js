require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const { checkForAuthenticationCookie } = require('./middlewares/authentication')
const { getAllBlogs } = require('./controllers/blog')

const app = express()
const PORT = process.env.PORT || 8000
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin@cluster0.ixhnxgz.mongodb.net/blogs_db?appName=Cluster0'

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))

app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.get('/', getAllBlogs)

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))
