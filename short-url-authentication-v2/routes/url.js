const express = require('express')
const {
  handelGenerateShortUrl,
  handelGetAnalytics,
} = require('../controllers/url')
const URL = require('../models/url')
const router = express.Router()

router
  .get('/', async (req, res) => {
    const allURL = await URL.find({ createdBy: req.user._id })
    res.render('urls', { allURL })
  })
  .get('/analytics/:shortId', handelGetAnalytics)
  .post('/shorten', handelGenerateShortUrl)

module.exports = router
