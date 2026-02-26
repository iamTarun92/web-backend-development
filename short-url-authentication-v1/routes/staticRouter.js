const express = require('express')
const router = express.Router()
const URL = require('../models/url')

// All fronted pages routes are handled here
router.get('/', async (req, res) => {
  const allURL = await URL.find()
  res.render('index', { urls: allURL })
})

module.exports = router
