const tagsCtrl = {};

// Models
const Tag = require("../models/Tag");
const Note = require("../models/Note");

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
	if (note.tag === null ){
	console.log("note này rỗng");
	} else {
	note.tag.forEach(async (idtag) => {
		await Tag.findById(idtag, function (err, doc) {
			  if (err) { console.log(err) };
			  if (doc.note.includes(note._id) === true){
			  	console.log(note._id + " đã nằm trong danh sách các note của tag có id " + idtag)
			  } else {
			  doc.note.push(note._id);
			  doc.save();
			}});
			console.log("gan Note voi Tag update thành công");
		});
	}
};
tagsCtrl.removeNoteTag = async (req, res) => {
	const { tagid, noteid } = req.body;
	await Tag.findById(tagid, function (err, doc) {
			  if (err) { console.log(err) };
			  function removeA(arr) {
					var what, a = arguments, L = a.length, ax;
					while (L > 1 && arr.length) {
						what = a[--L];
						while ((ax= arr.indexOf(what)) !== -1) {
							arr.splice(ax, 1);
						}
					}
					return arr;
				};
			  removeA(doc.note, noteid);
			  doc.save();
			  console.log("Xoa Note voi Tag thành công");
			});
			
	req.flash("success_msg", "Thanh cong xoa note");
	res.send("Thanh cong xoa note");
};

tagsCtrl.renderTagsID = async (req, res) => {
  const notes = await Note.find({tag: { "$in" : [req.params.id] }})
    .sort({ date: "desc" })
    .lean()
    .populate('tag');
    var name = this.tagstoID(req.params.id);
  //res.send(notes);
  res.render("tag/idtag", {"name":name ,"notes":notes });
};

tagsCtrl.renderTags = async (req, res) => {
  const tags = await Tag.find({})
    .sort({ date: "desc" })
    .lean()
    .populate('note');
    console.log(tags);
  res.render("tag/all-tags", { tags });
};

tagsCtrl.tagstoID = async (id) => {
  const tags = await Tag.findById({"_id":id})
  return tags ;
};

tagsCtrl.deleteTag = async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Tag Deleted Successfully");
  //res.send("Tag Deleted Successfully");
  res.redirect("/tags");
};

module.exports = tagsCtrl;
