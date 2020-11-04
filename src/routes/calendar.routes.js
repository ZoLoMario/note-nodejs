const router = require("express").Router();

const {
 dayEvent,
 getMonthEvent,
 renderNotesCa
} = require("../controllers/calendar.controller");
// Helpers
const { isAuthenticated } = require("../helpers/auth");

// render view calendar
router.get("/cal", isAuthenticated, renderNotesCa);
//Get data event month
router.post("/cal/month", isAuthenticated, getMonthEvent);


module.exports = router;
