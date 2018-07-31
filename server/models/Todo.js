var mongoose = require("mongoose");

// Model of a Todo task, that mongoose adds to a collection
// Mongoose automatically pluralises this model and makes a collection in the TodoApp database!
var Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        minlength : 1,
        trim: true
    },
    completed : {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator : {
        require: true,
        type : mongoose.Schema.Types.ObjectId
    }
});

module.exports = {Todo}
