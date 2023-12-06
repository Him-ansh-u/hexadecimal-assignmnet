import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const auth = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    res.send("Access Denied");
  }

  token = token.slice(7, token.length).trimLeft();
  console.log(JWT_SECRET);

  const verified = jwt.verify(token, JWT_SECRET);
  res.user = verified;
  next();
};
export default auth;
