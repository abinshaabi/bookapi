const mongoose = require("mongoose");

// Creating an author schema
const AuthorSchema = mongoose.Schema({
    id : Number,
    name : String,
    books : [String],
  });

// Author Model
const AuthorModel = mongoose.model("author",AuthorSchema);

module.exports = AuthorModel;
