const express = require('express')
const {
  handelGenerateShortUrl,
  handelGetAnalytics,
  handelGetAllUrl,
} = require('../controllers/url')
const router = express.Router()

router
  .get('/', handelGetAllUrl)
  .get('/analytics/:shortId', handelGetAnalytics)
  .post('/shorten', handelGenerateShortUrl)

module.exports = router
