const mongoose = require("mongoose");
const config = require("./config");
const MONGODB_URI = `${config.MONGODB_HOST}/${config.MONGODB_DB}`;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((db) => console.log("Mongodb is connected to", db.connection.host))
  .catch((err) => console.error(err));
