const helpers = {};
const User = require('../models/User');
helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/users/signin');
};

helpers.isAuthToken = async (req, res, next) => {
  //console.log(req.body);
  const user = await User.findOne({ token: req.body.token }).lean();
  if (user) {
    console.log("useruseruser");
    console.log(user);
    if(req.user == undefined ) { req.user = {}}
    req.user.id = user.id;
    return next();
  }
  res.json({'error':'Không xác định được người dùng'});
};

module.exports = helpers;
