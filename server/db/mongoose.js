var mongoose = require("mongoose");

// Tells mongoose to work via promises rather than via callbacks
mongoose.Promise = global.Promise;

// One of the best advantage of mongoose is that mongoose waits for a successfull connection,
// Before it EVER tries to perform a query

// Means we dont have to micromanage the order of things, mongoose takes care of that for us
mongoose.connect("mongodb://localhost:27017/TodoApp", {useNewUrlParser  : true});

module.exports.mongoose = mongoose;