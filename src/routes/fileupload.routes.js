const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getFile
} = require("../controllers/fileupload.controller");

const { isAuthenticated } = require("../helpers/auth");

router.post("/file/upload", isAuthenticated, uploadFile);
router.get("/public/up/:id", isAuthenticated, getFile);
module.exports = router;