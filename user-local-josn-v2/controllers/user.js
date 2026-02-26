const User = require('../models/user')

async function handelAddUser(req, res) {
  const { name, email } = req.body
  const existingUser = await User.findOne({ email })

  if (!name || !email) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  if (existingUser) {
    return res.status(404).json({ message: 'User is already exists.' })
  }

  const newUser = new User({
    ...req.body,
  })

  await newUser
    .save()
    .then((user) =>
      res
        .status(201)
        .json({ message: 'User added successfully.', _id: user._id }),
    )
    .catch((err) => res.status(400).json({ error: 'Unable to add this user.' }))
}

async function handelGetAllUsers(req, res) {
  const allUsers = await User.find({})
  return res.json(allUsers)
}

async function handelGetUserById(req, res) {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }
  return res.status(200).json(user)
}

async function handelDeleteUserById(req, res) {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }

  return res.status(200).json({ message: 'User deleted successfully.' })
}

module.exports = {
  handelAddUser,
  handelGetAllUsers,
  handelGetUserById,
  handelDeleteUserById,
}
