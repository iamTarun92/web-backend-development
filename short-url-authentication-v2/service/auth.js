const jwt = require("jsonwebtoken");
const privateKey = "12345!@#$%";

async function setToken(user) {
  const { _id, email, role } = user;
  const token = jwt.sign({ _id, email, role }, privateKey);
  return token;
}

function getToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, privateKey);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setToken,
  getToken,
};
