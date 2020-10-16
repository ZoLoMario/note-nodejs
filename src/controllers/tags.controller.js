const tagsCtrl = {};

// Models
const Tag = require("../models/Tag");

tagsCtrl.createTag = async (req, res) => {
  const tagadd = req.body.tagadd;
  const errors = [];
  if (!tagadd) {
    errors.push({ text: "Please Write a Tag." });
  };
  if (errors.length > 0) {
    res.send( errors );
  } else {
	  const nameTag = await Tag.findOne({ tag: tagadd });
    if (nameTag) {
      req.flash("error_msg", "The Tag is already in use." + nameTag.tag);
	  const sendTag = {
		  status:'already',
		  content: nameTag
	  };
      res.send(sendTag);
    } else {
		const newTag = new Tag();
		console.log("await");
		newTag.tag = tagadd;
		const newTags = await newTag.save();
		const sendTag = {
		  status:'create',
		  content: newTags
		};
		req.flash("success_msg", "Tag Added Successfully");
		res.send(sendTag);
    }
  }
};

tagsCtrl.updateNoteTag = (note) => {
	note.tag.forEach(async (idtag) => {
		await Tag.findById(idtag, function (err, doc) {
			  if (err) { console.log(err) };
			  doc.note.push(note._id);
			  doc.save();
			});
			console.log("gan Note voi Tag update thành công");
		});
};

tagsCtrl.renderTags = async (req, res) => {
  const tags = await Note.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.send(tags);
};

tagsCtrl.deleteTag = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Tag Deleted Successfully");
  res.send("Tag Deleted Successfully");
};

module.exports = tagsCtrl;
