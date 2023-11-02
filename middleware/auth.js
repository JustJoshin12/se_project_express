const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unauthorize } = require("../utils/errors");

const authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log(req.headers);
    res.status(unauthorize).send({ messsage: "Authorization required" });
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(UNAUTHORIZED).send({ message: "Invalid Token" });
  }

  req.user = payload;

  return next();
};

module.exports = { authorize };
