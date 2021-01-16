const usersCtrl = {};

// Models
const User = require('../models/User');
const Note = require("../models/Note");
const Fileupload = require("../models/Fileupload");
// Modules
const passport = require("passport");

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};

usersCtrl.singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
};

usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

usersCtrl.signin = passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
  });

usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

usersCtrl.renderUserinfo = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  console.log(req.headers);
  console.log(req.client._peername);
  const notes = await Note.find({ user: req.user.id }).lean();
  const Fileuploads = await Fileupload.find({ user: req.user.id }).lean();
  user.note = notes.length;
  user.fileupload = Fileuploads.length;
  console.log(user);
  res.render('users/userinfo', { user } );
}

usersCtrl.changeUserinfo = async (req, res) => {
  console.log(req.headers);
  console.log(req.client._peername);
  console.log(req.body);

  const { username, email, oldpass, newpass, renewpass } = req.body;
  const user = await User.findById(req.user.id, async (err, userdoc) => {
  userdoc.name = username;
  userdoc.email = email;
  console.log(userdoc);
  userdoc.save();
  if( oldpass == null || newpass == null || renewpass == null ){
     res.send('Mật khẩu trống');
  } else {
        const match = await userdoc.matchPassword(oldpass);
        if(match) {
          userdoc.password = await userdoc.encryptPassword(newpass);
          userdoc.save();
          req.logout();
          req.flash("success_msg", "Update thành công. You are logged out now.");
          res.redirect("/users/signin");
        } else {
          res.send('Sai mật khẩu.');
        }
    }
  console.log(userdoc);
})};

module.exports = usersCtrl;