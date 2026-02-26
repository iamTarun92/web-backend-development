const { getToken } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  const token = req.cookies?.token;
  req.user = null;
  if (!token) return next();
  const user = getToken(token);
  req.user = user;
  next();
}

function restrictTo(roles=[]) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.end("UnAuthorized");
    return next();
  };
}

async function restrictToLoggedinUserOnly(req, res, next) {
  const token = req.headers["authorization"].split("Bearer ")[1];
  if (!token) return res.redirect("/login");
  const user = getToken(token);
  if (!user) return res.redirect("/login");
  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  // const token = req.cookies?.token;
  const token = req.headers["authorization"].split("Bearer ")[1];
  const user = getToken(token);
  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
  checkForAuthentication,
  restrictTo,
};
