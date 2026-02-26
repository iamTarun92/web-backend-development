const noteModel = require('../models/note')

// Create a new note
const createNote = async (req, res) => {
  const { title, description } = req.body
  const newNote = new noteModel({
    title,
    description,
    userId: req.userId,
  })
  try {
    await newNote.save()
    res.status(201).json(newNote)
    console.log('Note created successfully')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating note', error })
  }
}

// Update note by id
const updateNote = async (req, res) => {
  const id = req.params.id
  const { title, description } = req.body

  const newNote = {
    title: title,
    description: description,
    userId: req.userId,
  }

  try {
    await noteModel.findByIdAndUpdate(id, newNote, { new: true })
    res.status(200).json(newNote)
    console.log('Note updated successfully')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// Delete note by id
const deleteNote = async (req, res) => {
  const id = req.params.id
  try {
    await noteModel.findByIdAndDelete(id)
    res.status(200).json({ message: 'Note deleted successfully' })
    console.log('Note deleted successfully')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// Get all notes for a user
const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.userId })
    res.status(200).json(notes)
    console.log('Get notes')
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error })
    console.log('Something went wrong!')
  }
}

module.exports = {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
}
