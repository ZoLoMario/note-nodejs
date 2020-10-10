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
	  console.log(sendTag);
      res.send(sendTag);
    } else {
		const newTag = new Tag();
		newTag.tag = tagadd;
		const newTags = await newTag.save();
		const sendTag = {
		  status:'create',
		  content: newTags
		};
		console.log(newTags);
		req.flash("success_msg", "Tag Added Successfully");
		res.send(newTags);
    }
  }
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
