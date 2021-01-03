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
    oldname: {
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

module.exports = model("Fileupload", FileuploadSchema);