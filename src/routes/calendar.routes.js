const router = require("express").Router();

const {
 dayEvent,
 monthEvent,
 renderNotesCa
} = require("../controllers/calendar.controller");
// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Get event on month
router.get("/cal/today", isAuthenticated, renderNotesCa);


module.exports = router;
