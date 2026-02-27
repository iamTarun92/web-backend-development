const express = require('express')
const router = express.Router()
const URL = require('../models/url')
const { handelGetAllUrl } = require('../controllers/url')

// All fronted pages routes are handled here
router.get('/', handelGetAllUrl)

module.exports = router
