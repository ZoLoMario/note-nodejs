const router = require("express").Router();

const {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout,
  renderUserinfo,
  changeUserinfo,
  importUata,
  imUpload
} = require("../controllers/users.controller");

// Routes
router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);


//xử lí thông tin người dùng
const { isAuthenticated } = require("../helpers/auth");
router.get("/user/info", isAuthenticated, renderUserinfo);
router.post("/user/info", isAuthenticated, changeUserinfo);

//xử lí data
router.get("/data/import",isAuthenticated, importUata);
router.post("/data/imupload.php",isAuthenticated, imUpload);
module.exports = router;
