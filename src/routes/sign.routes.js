const router = require("express").Router();

const {
 createKey
} = require("../controllers/sign.controller");
// Helpers
const { isAuthenticated } = require("../helpers/auth");

// render view calendar
router.post("/sign/create", isAuthenticated, createKey);


module.exports = router;
