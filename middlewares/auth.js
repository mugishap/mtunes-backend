require("dotenv").config();
const jwt = require("jsonwebtoken");
exports.checkForAccess = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const result = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(result)
  err ? console.log(err) : console.log(token);

  next();
  return res.status(200).json({ message: "Allowed to continue", token });
};
