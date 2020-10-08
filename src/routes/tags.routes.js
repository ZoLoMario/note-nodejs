const express = require("express");
const router = express.Router();

// Controller
const {
  createTag,
  findTag,
  deleteTag,
  renderTags
} = require("../controllers/tags.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// New Note
router.post("/tags/create-tag", isAuthenticated, createTag);

// Get All Notes
router.post("/tags", isAuthenticated, renderTags);

// Delete Notes
router.delete("/tags/delete/:id", isAuthenticated, deleteTag);

module.exports = router;
