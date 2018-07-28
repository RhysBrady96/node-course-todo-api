var mongoose = require("mongoose");

// Tells mongoose to work via promises rather than via callbacks
mongoose.Promise = global.Promise;

// One of the best advantage of mongoose is that mongoose waits for a successfull connection,
// Before it EVER tries to perform a query

// Means we dont have to micromanage the order of things, mongoose takes care of that for us
// Note, the OR process.env.MONGODB_URI will work only if the app is running on Heroku
// AND the mLab Addon is included in the heroku instance
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp", 
    {useNewUrlParser  : true});

module.exports.mongoose = mongoose;