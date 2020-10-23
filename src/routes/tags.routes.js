const express = require("express");
const router = express.Router();

// Controller
const {
  createTag,
 // findTag,
  deleteTag,
  renderTags,
  renderTagsID,
  removeNoteTag
} = require("../controllers/tags.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// New Note
router.post("/tag/create-tag", isAuthenticated, createTag);

// Get All Notes
router.get("/tags", isAuthenticated, renderTags);
router.get("/tag/:id", isAuthenticated, renderTagsID);
// Delete Tags
router.delete("/tag/delete/:id", isAuthenticated, deleteTag);
// Delete Note in Tag 
router.post("/tag/removeNote", isAuthenticated, removeNoteTag);

module.exports = router;
