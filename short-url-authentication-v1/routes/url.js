const express = require('express')
const {
  handelGenerateShortUrl,
  handelGetAnalytics,
  handelRedirectShortUrl,
} = require('../controllers/url')
const router = express.Router()

router
  .post('/', handelGenerateShortUrl)
  .get('/:shortId', handelRedirectShortUrl)
  .get('/analytics/:shortId', handelGetAnalytics)

module.exports = router
