const express = require('express')
const router = express.Router()
const {
  handelGetAllUsers,
  handelGetUserById,
  handelDeleteUserById,
  handelAddUser,
} = require('../controllers/user')

router.route('/').get(handelGetAllUsers).post(handelAddUser)
router.route('/:id').get(handelGetUserById).delete(handelDeleteUserById)

module.exports = router
