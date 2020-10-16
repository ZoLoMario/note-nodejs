const express = require("express");
const router = express.Router();

// Controller
const {
  createTag,
 // findTag,
  deleteTag,
  renderTags,
  removeNoteTag
} = require("../controllers/tags.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// New Note
router.post("/tags/create-tag", isAuthenticated, createTag);

// Get All Notes
router.post("/tags", isAuthenticated, renderTags);

// Delete Tags
router.delete("/tags/delete/:id", isAuthenticated, deleteTag);

// Delete Note in Tag 
router.post("/tags/removeNote", isAuthenticated, removeNoteTag);

module.exports = router;
