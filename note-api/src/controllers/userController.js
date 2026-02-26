const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY || 'NOTESAPI' // In production, use an environment variable for the secret key

// User registration (signup) function
const signup = async (req, res) => {
  const { email, password, username } = req.body
  try {
    const existingUser = await userModel.findOne({ email: email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    })

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY)
    res.status(201).json({ user: result, token: token })
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error })
  }
}

// User login (signin) function
const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await userModel.findOne({ email: email })
    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    )
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY,
    )
    res.status(200).json({ user: existingUser, token })
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error })
  }
}

module.exports = { signup, signin }
