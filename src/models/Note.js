const { Schema, model } = require("mongoose");
const Tag = require("./Tag");

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      text : true
    },
    tag: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    tagAction: {
      type:Array,
      require:false
    },
    file: [{ type: Schema.Types.ObjectId, ref: 'Fileupload' }],
    status: {
      type: Boolean,
      require: false
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);
const config = require("../config");
const NOTEDOCNAME = `${config.DB_PREFIX}note`;
module.exports = model("Note", NoteSchema, NOTEDOCNAME);
