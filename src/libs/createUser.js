const User = require("../models/User");

const createAdminUser = async () => {
  const userFound = await User.findOne({ email: "wotech@wotech.vn" });

  if (userFound) return;

  const newUser = new User({
    username: "admin",
    email: "wotech@wotech.vn",
  });

  newUser.password = await newUser.encryptPassword("wotech");

  const admin = await newUser.save();

  console.log("Admin user created", admin);
};

module.exports = { createAdminUser };
