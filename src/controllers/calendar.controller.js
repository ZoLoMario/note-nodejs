const calendarCtrl = {};
//const moment = require('moment');
// Models
const Tag = require("../models/Tag");
const Note = require("../models/Note");

calendarCtrl.dayEvent = async (dateObj) => {
	var month = dateObj.getUTCMonth() + 1;
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	today = day + "-" + month + "-" + year;
	console.log(today);
	const notes = await Note.find({ user: req.user.id, createdAt: {
															    $gte: today.toDate(),
															    $lte: moment(today).endOf('day').toDate()
															  } 
															})
    	.sort({  createdAt: "desc" })
    	.lean();
  	return notes;
};
calendarCtrl.monthEvent = async (month) => {
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1;
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	today = year + "-" + month + "-" + day;
	console.log(today);
	const notes = await Note.find({ user: req.user.id, createdAt: {
															    $gte: startOfDay(dateObj),
															    $lte: endOfDay(dateObj)
															  } 
															})
    	.sort({  createdAt: "desc" })
    	.lean()
  	return notes;
};
calendarCtrl.renderNotesCa = (req, res) => {
	console.log("reder");
  res.render('calendar/calendar');
};

module.exports = calendarCtrl;