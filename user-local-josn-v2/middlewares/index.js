const express = require('express')
const fs = require('fs')
const path = require('path')

const configureMiddlewares = (app) => {
  // Static files
  app.use(express.static(path.join(__dirname, '../public')))

  // Body parsers
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
}

const logReqRes = (logFileName) => {
  return (req, res, next) => {
    const logFilePath = path.join(path.dirname(__dirname), logFileName)
    const logMessage = `URL: ${req.method} ${req.url} - Time: ${new Date().toISOString()}\n`

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write log:', err)
        return res.status(500).json({ message: 'Logging failed' })
      }

      console.log('Log saved:', logMessage.trim())
      next()
    })
  }
}

module.exports = { configureMiddlewares, logReqRes }
