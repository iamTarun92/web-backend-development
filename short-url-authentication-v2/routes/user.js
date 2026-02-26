const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user");
const { multerUpload } = require("../multer.config");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/profile", multerUpload.single("avatar"), (req, res) => {
  try {
    res.send("File uploaded successfully");
  } catch (err) {
    res.status(400).send("Error uploading file");
  }
});
module.exports = router;
