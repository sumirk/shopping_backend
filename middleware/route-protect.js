const jwt = require("jsonwebtoken");
const httpError = require("../models/httpError");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: Bearer token
    if (!token) {
      throw new httpError("Authentication Failed");
    }
    const decodedToken = jwt.verify(token, "super_secret_password");
    const userId = decodedToken.userId;
    console.log(userId)
    const user = await User.findByPk(userId);
    
    console.log(user)
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
