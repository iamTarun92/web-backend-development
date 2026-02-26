const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/admin/urls", restrictTo(["admin"]), async (req, res) => {
  const allURL = await URL.find();
  res.render("urls", { allURL });
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("login");
});

router.get("/profile", (req, res) => {
  return res.render("profile");
});

module.exports = router;
