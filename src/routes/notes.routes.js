const express = require("express");
const router = express.Router();

// Controller
const {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
  searchNote,
  exportPDF,
  renderNotesAPI,
  notesactionAPI,
  deleteNoteAPI
} = require("../controllers/notes.controller");

// Helpers
const { isAuthenticated, isAuthToken } = require("../helpers/auth");

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);

// Edit Notes
router.get("/notes/edit/:id", isAuthenticated, renderEditForm);
router.get("/notes/export/:id", isAuthenticated, exportPDF);

router.put("/notes/edit-note/:id", isAuthenticated, updateNote);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);

// Search Notes
router.post("/search.php", isAuthenticated, searchNote);

//tạo nền tảng riêng xử lí cho mobile
router.post("/api/notes", isAuthToken, renderNotesAPI);
router.post("/api/notesaction", isAuthToken, notesactionAPI);
router.post("/api/deletenote", isAuthToken, deleteNoteAPI);

module.exports = router;
