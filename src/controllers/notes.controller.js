const notesCtrl = {};
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
// Models
const Note = require("../models/Note");
const {
  createTag,
  updateNoteTag,
  renderTags,
  deleteTag
} = require("./tags.controller");

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

notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id, status: true })
    .sort({  createdAt: "desc" })
    .lean()
	 .populate('tag')
   .populate('file')
   .limit(10);
  // res.render("notes/all-notes", { notes });
  res.render("notes/all-notes", {notes});
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean().populate('tag').populate('file');
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
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
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  fs.readFile(path.join(__dirname,"..","views", "notes", "htmlpdf.hbs"), 'utf8', function(err, data) {
        if (err) throw err;
  var temple = handlebars.compile(data);
  var html = temple(notes);
  res.send(html);
   });
};

module.exports = notesCtrl;
