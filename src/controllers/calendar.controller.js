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
calendarCtrl.getMonthEvent = async (req, res) => {
	const { month } = req.body;
	console.log(month.split(".")[0]);
	async function eventMonth(end,month,year){
		var totalEvent = [];
		for(var i = 1; i < 10; i++) {
		    var startDay = month +"/0" + i + "/" + year;
		    if(i==9){ var endDay = month +"-10-" + year; } else {
		    	var endDay = month +"-0" + (i+1) + "-" + year;
		    };
			console.log(startDay + " ngay dau thang 2 " + Date.parse(startDay));
			var Datecc = new  Date(startDay);
			console.log(startDay + " ngay " + Datecc.getDate());
			console.log(endDay + " ngay cuối thang 2 " + Date.parse(endDay));
			console.log(Date.parse(startDay)-Date.parse(endDay));
			const notes = await Note.find({ user: req.user.id, createdAt: {
															    $gte: Date.parse(startDay),
															    $lte: Date.parse(endDay)
															  } 
															});
			console.log(notes.length)
			totalEvent.push({"Day":startDay,"toEvent":notes.length,"Event":notes})
		};
		for(var i = 10; i < end; i++) {
		    var startDay = month +"-" + i + "-" + year;
			var endDay = month +"-" + (i+1) + "-" + year;
			console.log(startDay + " ngay dau thang 2 " + Date.parse(startDay));
			console.log(endDay + " ngay cuối thang 2 " + Date.parse(endDay));
			const notes = await Note.find({ user: req.user.id, createdAt: {
															    $gte: Date.parse(startDay),
															    $lte: Date.parse(endDay)
															  } 
															});
			console.log(notes.length)
			console.log(Date.parse(startDay)-Date.parse(endDay));
			totalEvent.push({"Day":startDay,"toEvent":notes.length,"Event":notes});
		}
			if (month!=12 ){
			var startDay = month +"-" + end + "-" + year;
			var nextMonth = parseInt(month) + 1;
			var endDay = nextMonth +"-01-" + year;
			console.log(startDay + " ngay dau thang 2 " + Date.parse(startDay));
			console.log(endDay + " ngay cuối thang 2 " + Date.parse(endDay));
			const notes = await Note.find({ user: req.user.id, createdAt: {
															    $gte: Date.parse(startDay),
															    $lte: Date.parse(endDay)
															  } 
															});
			console.log(notes.length)
			totalEvent.push({"Day":startDay,"toEvent":notes.length,"Event":notes});
		}else{
			var startDay = month +"-" + end + "-" + year;
			var endDay = "01-01-" + (parseInt(year)+1);
			console.log(startDay + " ngay dau thang 2 " + Date.parse(startDay));
			console.log(endDay + " ngay cuối thang 2 " + Date.parse(endDay));
			const notes = await Note.find({ user: req.user.id, createdAt: {
															    $gte: Date.parse(startDay),
															    $lte: Date.parse(endDay)
															  } 
															});
			console.log(notes.length)
			totalEvent.push({"Day":startDay,"toEvent":notes.length,"Event":notes});
		}
		return totalEvent;
	}
	//Xác định có phải tháng 2 không
	if(month.split(".")[0] == "02") {
		// console.log((month.split(".")[1]%400==0));
		// console.log((month.split(".")[1]%4==0));
		// console.log((month.split(".")[1]%100!=0));
		// console.log((month.split(".")[1]%4==0&&(month.split(".")[1]%100!=0)));
		// console.log((month.split(".")[1]%400==0)||(month.split(".")[1]%4==0&&(month.split(".")[1]%100!=0)));
			//xác định có phải năm nhuận không
		if((month.split(".")[1]%400==0)||(month.split(".")[1]%4==0&&(month.split(".")[1]%100!=0))){
			console.log('năm nay là năm nhuận có 29 ngày trong tháng 2');
			console.log(eventMonth("29","02",month.split(".")[1]));
		} else {
			console.log('năm nay là năm thường có 28 ngày trong tháng 2');
			eventMonth("28","02",month.split(".")[1]);
		}
	} else {
		if (["04","06","09","11"].includes(month.split(".")[0])) {
			console.log("tháng này có 30 ngày");
			eventMonth("30",month.split(".")[0],month.split(".")[1]);
		} else {
			console.log("tháng này có 31 ngày");
			eventMonth("31",month.split(".")[0],month.split(".")[1]);
		}
	}
	// var dateObj = new Date();
	// var month = dateObj.getUTCMonth() + 1;
	// var day = dateObj.getUTCDate();
	// var year = dateObj.getUTCFullYear();
	// today = year + "-" + month + "-" + day;
	// console.log(today);
	// const notes = await Note.find({ user: req.user.id, createdAt: {
	// 														    $gte: startOfDay(dateObj),
	// 														    $lte: endOfDay(dateObj)
	// 														  } 
	// 														})
 //    	.sort({  createdAt: "desc" })
 //    	.lean()
 //  	return notes;
};
calendarCtrl.renderNotesCa = (req, res) => {
	console.log("reder");
  res.render('calendar/calendar');
};

module.exports = calendarCtrl;