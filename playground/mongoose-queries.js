const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/Todo");
const {User} = require("./../server/models/User");

// 5b5b309468cced20886a2996

var id = "5b5b309468cced20886a2996";
var userId = "5b5ae34ee9ec8f1cdc031794";

// NOTE: using mongoose, we dont have to create a "ObjectID" instance like we had to with 
// MongoDB, mongoose converts the string into an object id for us!!
// Todo.find({
//     _id : id
// }).then( (todos) => {
//     console.log("Todos using find: ", todos);
    
// });

// Todo.findOne({
//     _id : id
// }).then( (todo) => {
//     console.log("Todo using findOne : ", todo);
// })

// if (!ObjectID.isValid(id)) {
//     console.log("ID is not valid");
// }

// Todo.findById(id).then((todo) => {
//     console.log("Todo using findById : ", todo ? todo : "No ID found");
// }).catch((e) => console.log(e));


User.findById(userId).then(
    (user) => {
        if(!user) {
            return console.log("No user with such ID");
        }
        console.log(JSON.stringify(user, undefined, 2));   
    },
    (e) => {
        console.log("Error When trying to find user");
    }
)