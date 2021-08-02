const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/users/signin');
};

helpers.isAuthToken = (req, res, next) => {
  //console.log(req.body);
  if (req.body.token == 'FMfcgxwLsJwTzjhZplztwDjbBWtKqBKr') {
    //console.log(req.body);
    if(req.user == undefined ) { req.user = {}}
    req.user.id = '5f78901904dd4c28306e46e3';
    return next();
  }
  res.json({'error':'Không xác định được người dùng'});
};

module.exports = helpers;
