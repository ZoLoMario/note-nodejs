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
      required: true
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
    user: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Note", NoteSchema);
