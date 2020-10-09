const tagsCtrl = {};

// Models
const Tag = require("../models/Tag");

tagsCtrl.createTag = async (req, res) => {
  const tagadd = req.body.tagadd;
  console.log("create tag : " + tagadd);
  const errors = [];
  if (!tagadd) {
    errors.push({ text: "Please Write a Tag." });
  };
  if (errors.length > 0) {
    res.send( {
      errors,
      tagadd
    });
  } else {
    const newTag = new Tag({tagadd});
    await newTag.save();
    req.flash("success_msg", "Tag Added Successfully");
    res.send("Thêm Tag thành công");
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
