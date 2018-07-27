var express = require("express");

// Body-parser lets us send JSON to the server, which the server can do somethign with
// Body-parser converts the String body into a JSON object
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/Todo");
var {User} =require("./models/User");

var app = express();

// app.user creates our middleware from the bodyParser.json function
app.use(bodyParser.json());

// This is the "Create" in standard CRUD operations
app.post("/todos", (req, res) => {
    var todo = new Todo({
        text : req.body.text,
    });

    todo.save().then(
        (doc) => {
            res.status(200).send(doc);
        },  
        (e) => {
            res.status(400).send(e);
        }
    )
});




app.listen(3000, () => {
    console.log("Started on port 3000");
});













































// var newTodo = new Todo({
//     text: "Make Dinner",
//     completed: false
// });

// newTodo.save().then(
//     (doc) =>{ 
//         console.log("Saved Todo : ", doc);
        
//     },
//     (e) => {
//         console.log("Unable to save Todo");
//     }
// );

// var secondTodo = new Todo({
//     text: "have shower",
//     completed : true,
//     completedAt: 111
// });

// secondTodo.save().then(
//     (doc) => {
//         console.log("Successfully added Todo : ", doc);
//     },
//     (e) => {
//         console.log("Couldnt save the new Todo");
//     }
// )
// var newUser = new User({
//     email: "RhysBrady96@live.co.uk"
// });

// newUser.save().then(
//     (doc) => {
//         console.log("New user added : ", doc);
//     },
//     (e) => {
//         console.log("There was an error : ", e);
//     }  
// )
