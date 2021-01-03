const express = require("express");
const router = express.Router();
const {
  uploadFile
} = require("../controllers/fileupload.controller");

const { isAuthenticated } = require("../helpers/auth");

router.post("/file/upload", isAuthenticated, uploadFile);

module.exports = router;