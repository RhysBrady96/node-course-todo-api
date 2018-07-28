const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/Todo");
const {User} = require("./../server/models/User");

// // Todo.remove <--- Lets you remove multiple documents
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// // Todo.findOneAndRemove <--- Works like FindOne, it just removes the first one that meets a criteria
// Todo.findOneAndRemove({details : "Delete with these details"}).then((result) => {

// })

// // Todo.findByIdAndRemove <----- finds document with that ID and removes it from the collection
// // NOTE: Both this and findOneAndRemove return the document that is deleted,
// // whereas remove() doesnt do OES_texture_half_float, it just returns HOW MANY were deleted   
// Todo.findByIdAndRemove("<ID>").then((doc) => {
//     console.log(doc);
// });