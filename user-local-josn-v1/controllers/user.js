const fs = require('fs')
const users = require('../users.json')

function handelGetDesktopUsers(req, res) {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
  `
  return res.send(html).status(200)
}

function handelAddUser(req, res) {
  let newUser = req.body
  const userIndex = users.findIndex(
    (user) =>
      user.first_name === newUser.first_name ||
      user.last_name === newUser.last_name,
  )

  // Assign a new unique ID for the new user
  newUser = {
    id: users.length ? users.length + 1 : 1,
    ...newUser,
  }

  // Validation for required fields
  if (!newUser || !newUser.first_name || !newUser.last_name) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check if user already exists
  if (userIndex >= 0) {
    return res.status(400).json({ message: 'User already exists.' })
  }

  // Add the new user to the list
  users.push(newUser)

  // Write the updated users list to a file
  fs.writeFile('./users.json', JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing to file.' })
    }
    return res
      .status(201)
      .json({ message: 'User added successfully.', id: newUser.id })
  })
}

function handelGetAllUsers(req, res) {
  return res.json(users)
}

function handelGetUserById(req, res) {
  const userId = Number(req.params.id)
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found.' })
  }
  return res.status(200).json(users[userIndex])
}

function handelDeleteUserById(req, res) {
  const userId = Number(req.params.id)
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found.' })
  }

  users.splice(userIndex, 1)

  fs.writeFile('./users.json', JSON.stringify(users), (err, data) => {
    res.status(200).json({
      id: userId,
      status: 200,
      message: 'User deleted successfully.',
    })
  })
}

module.exports = {
  handelGetDesktopUsers,
  handelAddUser,
  handelGetAllUsers,
  handelGetUserById,
  handelDeleteUserById,
}
