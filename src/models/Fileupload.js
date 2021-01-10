const { Schema, model } = require("mongoose");

const FileuploadSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    // link: {
    //   type: String,
    //   required: true
    // },
    size: {
      type: Number,
      required: true
    },
    oldname: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    encoding: {
      type: String,
      required: true
    },
    note: [{ type: Schema.Types.ObjectId, ref: 'Note' , required: true }], 
    user: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}
);

module.exports = model("Fileupload", FileuploadSchema);