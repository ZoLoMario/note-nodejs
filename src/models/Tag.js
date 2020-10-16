const { Schema, model } = require("mongoose");
const Note = require("./Note");

const TagSchema = new Schema(
  {
    tag: {
      type: String,
      required: true
    },
	note: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Tag", TagSchema);
