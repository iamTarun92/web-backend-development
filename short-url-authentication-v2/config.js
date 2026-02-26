const HOSTNAME = '127.0.0.1'
const PORT = 8000
const DB_NAME = 'short_url_db'
const MONGO_URL = `mongodb://${HOSTNAME}:27017/${DB_NAME}`
const JWT_SECRET = 'secretkey'

module.exports = { HOSTNAME, PORT, DB_NAME, MONGO_URL, JWT_SECRET }
