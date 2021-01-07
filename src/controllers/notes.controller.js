const notesCtrl = {};

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
   .limit(10);
  res.render("notes/all-notes", { notes });
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean().populate('tag');
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
  const search = req.body.search;
  console.log("thuc hien tim kiem " + search );
  res.status(200);
  res.send({"status":"200","content":"123"});
};

module.exports = notesCtrl;
