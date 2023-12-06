import express from "express";
import dotenv from "dotenv";
import Axios from "axios";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

/* Configurations and variable declaration */
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const LINK = process.env.API_LINK;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(DATABASE_URL).then(() => console.log("connected to DB"));

/* Middleware */
app.use(cors());
app.use(express.json());

const auth = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    res.send("Access Denied");
  }

  token = token.slice(7, token.length).trimLeft();

  const verified = jwt.verify(token, JWT_SECRET);
  res.user = verified;
  next();
};

/* Routes */
app.get("/", auth, async (req, res) => {
  let apiData;
  const searchText = req.query.searchText;

  await Axios.get(LINK).then((res) => {
    if (searchText) {
      apiData = res.data.filter(
        (item) => item.name && item.name.toLowerCase().includes(searchText)
      );
    } else {
      apiData = res.data;
    }
  });
  res.json(apiData);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.json({ message: "User Not found" });
    }
    const isMatch = password == user.password;
    if (!isMatch) {
      return res.json({ message: "Wrong Password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    delete user.password;
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
