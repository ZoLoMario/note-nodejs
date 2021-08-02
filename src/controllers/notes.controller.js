const notesCtrl = {};
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const puppeteer = require('puppeteer');
// Models
const Note = require("../models/Note");
const {
  updateNoteTag,
  createTagAPI,
  TagtoID
} = require("./tags.controller");
const moment = require('moment');

notesCtrl.renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};


//tao note moi
notesCtrl.createNewNote = async (req, res) => {
  const { title, description, tag, tagAction, status } = req.body;
  //console.log(req.body);
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title." });
  }
  console.log(!description);
  if (JSON.parse(description).blocks.length == 0) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0) {
    res.status(200);
    res.send({"loi":"101","errors":errors});
  } else {
    const newNote = new Note({ title, description, tag, tagAction, status });
    newNote.user = req.user.id;
    newNoteSa = await newNote.save();
    updateNoteTag(newNoteSa);
    req.flash("success_msg", "Note Added Successfully");
    res.status(200);
    res.send({"status":"200","content":"123"});
  }
};


notesCtrl.addNote = async (note) => {
  const newNote = new Note(note);
  newNoteSa = await newNote.save();
  return newNoteSa;
};


//Xuất các note đã có để sử dụng
notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({ user: { "$in" : [req.user.id]}})
    .sort({  createdAt: "desc" })
    .lean()
	 .populate('tag')
   .populate('file')
   .limit(20);
  res.render("notes/all-notes", {notes});
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean().populate('tag').populate('file');
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  // console.log(note);
  res.render("notes/edit-note", { note });
};

//ham update thong tin note
notesCtrl.updateNote = async (req, res) => {
  const { title, description, tag, tagAction } = req.body;
  const noteid = await Note.findById(req.params.id)
  if (tagAction) {
  tagActionFin = tagAction.concat(noteid.tagAction); } else {
  tagActionFin = noteid.tagAction;
  }
  console.log("tagActionfin " + tagActionFin);
  var objUpdate = { "title":title, "description":description, "tag":tag , "tagAction":tagActionFin };
  console.log(objUpdate);
  await Note.findByIdAndUpdate(req.params.id, objUpdate,{new:true}, function (err, doc) {
	  if (err) { console.log(err) };
		updateNoteTag(doc);
	});
  req.flash("success_msg", "Note Updated Successfully");
  res.status(200);
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};

notesCtrl.searchNote = async(req, res) => {
  const  search = req.body.search;
  console.log("thuc hien tim kiem " + search );
  const notes = await Note.find({$text: {$search: search}})
       .sort({  createdAt: "desc" })
      .lean()
       .populate('tag')
       .populate('file');
  // res.render("notes/all-notes",  { notes:notes, dynamic:'dynamicPartial', search: {search : search}});
  fs.readFile(path.join(__dirname,"..","views", "notes", "search.hbs"), 'utf8', function(err, data) {
        if (err) throw err;
        //console.log(data);
   
  //console.log(path.join(__dirname,"..","views", "notes", "search.hbs"));
  var temple = handlebars.compile(data);
  //console.log(notes);
  var html = temple({ notes:notes, dynamic:'dynamicPartial', search: {search : search}});
  // var html = hbs.render(path.join(__dirname,"..","views", "notes", "all-notes.hbs"),  { notes:notes});
  res.send(html);
   });
};

notesCtrl.exportPDF = async (req,res) => {
  const note = await Note.findById(req.params.id).lean().populate('tag').populate('file');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless:true,
    args: ["--no-sandbox"]

  });
  const page = await browser.newPage()


  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note },async (err,temple)=>{
    if(err) {console.log("lỗi");};
  fs.readFile(path.join(__dirname,"..","views", "notes", "htmlpdf.hbs"), 'utf8', function(err, data) {
        if (err) throw err;
      });
  res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": "attachment; filename=htmlpdf.pdf"
            });
  await page.setContent(temple);
  var pdf = await page.pdf({format: 'A4'});
  await browser.close();
  res.end(Buffer.from(pdf, 'base64'));
  console.log("PDF Generated");
  // res.sendFile(path.join(__dirname,"..","..", "uploads", "htmlpdf.pdf"));
  });
};


notesCtrl.getTimeClient = () => {
  var d = new Date();
  var n = d.getTime();
  return n;
    }

//su dung cho API
notesCtrl.renderApinotes = async (useid) => {
  const notes = await Note.find({ user: useid })
    .sort({  createdAt: "desc" })
    .lean()
   .populate('tag')
   .populate('file')
   .limit(20);
  return notes;
};

notesCtrl.convertDataToText = (blocks) => {
  var convertedHtml = "";
  blocks.map(block => {
    switch (block.type) {
      case "header":
        convertedHtml += `${block.data.text} \n `;
        break;
      case "embded":
        convertedHtml += `${block.data.embed} \n `;
        break;
      case "paragraph":
        convertedHtml += `${block.data.text} \n `;
        break;
      case "raw":
        convertedHtml += `${block.data.html} \n `;
        break;
      case "delimiter":
        convertedHtml += "===== \n ";
        break;
      case "image":
        convertedHtml += `${block.data.caption} \n `;
        break;
      case "list":
        convertedHtml += "**** \n ";
        block.data.items.forEach(function(li) {
          convertedHtml += `"-"${li} \n `;
        });
        convertedHtml += "**** \n ";
        break;
      default:
        console.log("--------------Unknown block type--------- \n ", block.type);
        break;
    }
  });
  return convertedHtml;
};

notesCtrl.renderNotesAPI = async (req, res) => {
  const notes = await Note.find({ user: { "$in" : [req.user.id]}})
    .sort({  createdAt: "desc" })
    .lean()
	 .populate('tag')
   .populate('file')
   .limit(10);
   console.log("có thực hiện");
   var ar =  [];
   notes.forEach((entry) => {
     // neen kieerm tra laji undenided
   //console.log(notesCtrl.convertDataToText(JSON.parse(entry.description)));
   entry.description = notesCtrl.convertDataToText(JSON.parse(entry.description).blocks);
   
});
 //res.json(ar);
 res.json(notes);
};

notesCtrl.notesactionAPI = async (req, res) => {
  //console.log(req.body);
  if(req.body.action == 'edit' ){
      const noteid = await Note.findById(req.body.note._id);
      if(req.body.tag == 'Di động'){
        if(noteid.tag.includes("60fc3cc0998e62001517d531")) {console.log("Đã tồn tại tag di động")} else {noteid.tag.push("60fc3cc0998e62001517d531");}
      } else  {
        if(req.body.tag.id == "60fc3cd3998e62001517d532" || req.body.tag.id == "60fc3ce1998e62001517d533" ){
          if(noteid.tag.includes("60fc3cd3998e62001517d532")) {console.log("Đã tồn tại tag làm việc")} else {noteid.tag.push("60fc3cd3998e62001517d532");}
          if(noteid.tag.includes("60fc3ce1998e62001517d533")) {console.log("Đã tồn tại tag học tập")} else {noteid.tag.push("60fc3ce1998e62001517d533");}
        } else {
          const taga = await createTagAPI(req.body.tag.tagname);
          if(noteid.tag.includes(taga.content.id)) { console.log("Đã tồn tại tag " + taga.content.tag)} else { noteid.tag.push(taga.content.id); }
        }

      }
    //console.log(noteid.tag);
    const descriptiona = {};
    descriptiona.time = notesCtrl.getTimeClient(); 
    descriptiona.version = "2.18.0";
    descriptiona.blocks = [{type: "paragraph",data: {text: req.body.note.description}}]
    var objUpdate = { "title" : req.body.note.title, "description" : JSON.stringify(descriptiona), "tag":noteid.tag , "tagAction" : req.body.note.tagAction };
    await Note.findByIdAndUpdate(req.body.note._id, objUpdate,{new:true}, function (err, doc) {
      if (err) { console.log(err) };
      updateNoteTag(doc);
    });
    res.json({status:'success', text:'xong phan edit'});

  } else {
      const descriptiona = {};
      descriptiona.time = notesCtrl.getTimeClient(); 
      descriptiona.version = "2.18.0";
      descriptiona.blocks = [{type: "paragraph",data: {text: req.body.note.description}}]

      const newNoa = {};
      newNoa.title = req.body.note.title;
      newNoa.description = JSON.stringify(descriptiona);
      newNoa.tagAction = req.body.note.tagAction;

      console.log('JSON.stringify(descriptiona)')
      console.log(req.body)



      if(req.body.tag == 'Di động'){
      newNoa.tag = ["60fc3cc0998e62001517d531"];
    } else {
      if(req.body.tag == "60fc3cd3998e62001517d532" || req.body.tag == "60fc3ce1998e62001517d533" ){
        newNoa.tag = [req.body.tag];
      } else {
        var tagb = await TagtoID(moment().utcOffset('+05:30').format('MM.YYYY'));
        if( tagb[0] === undefined ){
          console.log('123213')
          tagc = await createTagAPI(moment().utcOffset('+05:30').format('MM.YYYY'))
          tagb = [tagc.content]
        }
        newNoa.tag = [tagb[0]._id]
        console.log(newNoa)
      }
    }
    const newNote = new Note(newNoa);
    newNote.user = req.user.id;
    newNoteSa = await newNote.save();
    //console.log(newNoteSa);
    updateNoteTag(newNoteSa);
    res.json({status:'success', text:'xong phan add'});
  }
};

notesCtrl.deleteNoteAPI = async (req, res) => {
  await Note.findByIdAndDelete(req.body.id);
  console.log("đã xóa");
  res.json({status:'success', text:'xong phan add'});
};


module.exports = notesCtrl;
