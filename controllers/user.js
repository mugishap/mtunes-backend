const { userSchema } = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const _ = require("lodash");

require("dotenv").config();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.registerUser = async (req, res) => {
  try {
    res.cookie("userInfo", "", { maxAge: 1 });
    res.cookie("token", "", { maxAge: 1 });
    let imageUrl;
    const anotherUser = await userSchema.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    console.log(anotherUser);
    if (anotherUser !== null) {
      return res.status(400).json({ message: "User already exists" });
    }
    const info = _.pick(req.body, [
      "name",
      "username",
      "email",
      "country",
      "imageStr",
      "password",
    ]);
    console.log(info);
    const imageStr = info.imageStr;
    if (imageStr === "") {
      imageUrl =
        "https://res.cloudinary.com/precieux/image/upload/v1650892108/mtunes-profiles/logo1_can05q.png";
    } else {
      const uploadedResponse = await cloudinary.uploader.upload(imageStr, {
        upload_preset: "mtunes_profiles",
      });
      imageUrl = uploadedResponse.secure_url;
    }
    const user = new userSchema({
      name: info.name,
      username: info.username,
      email: info.email,
      country: info.country,
      secureUrl: imageUrl,
      password: info.password,
    });
    if (!user)
      return res.status(400).json({ message: "Error in creating account" });

    await user.save();
    // console.log(user);
    return res
      .status(201)
      .json({
        uploadedResponse: "Image uploaded succesfully",
        message: "Account created",
        user,
      });
  } catch (err) {
    console.log(err);
  }
};
exports.login = async (req, res) => {
  console.log(req.body);
  res.cookie("userInfo", "", { maxAge: 1 });
  res.cookie("token", "", { maxAge: 1 });
  const withMail = await userSchema.findOne({ email: req.body.email });

  if (withMail === null)
    return res.status(500).json({ message: "Wrong email" });

  const available = await userSchema.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (available === null)
    return res.status(500).json({ message: "Password is incorrect" });
  console.log(available);
  const user = _.pick(available, [
    "name",
    "username",
    "email",
    "secureUrl",
    "country",
  ]);

  if (available != null) {
    const token = await jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    res.status(200).json({ mesage: "Allowed to continue", token });
  } else {
    return res
      .status(403)
      .json({ message: "Either email or password is incorrect" });
  }
};

exports.getUser = async () => {
  const user = await userSchema.findById(req.body.id);
  if (!user) return res.status(500).json({ message: "Error in getting user" });
  return res.status(200).send(user);
};

exports.logout = async (req, res) => {
  return res.status(200).json({ message: "Logging you out" });
};

exports.update = async (req, res) => {
  console.log(req.body);
  const info = _.pick(req.body, [
    "name",
    "username",
    "email",
    "country",
    "password",
    "newpassword",
  ]);
  const data = this.checkForAccess();
};

