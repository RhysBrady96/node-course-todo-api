const config = require("./config/config");

const _ = require("lodash");
const express = require("express");

// Body-parser lets us send JSON to the server, which the server can do somethign with
// Body-parser converts the String body into a JSON object
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/Todo");
var {User} =require("./models/User");
var {authenticate} = require("./middleware/authenticate");

var app = express();

// Will only be set if the app IS running on Heroku,
// It WONT be set if the app is running locally
const port = process.env.PORT;

// app.user creates our middleware from the bodyParser.json function
app.use(bodyParser.json());

// This is the "Create" in standard CRUD operations
// Remember, authenticate is a middlware function that can change the req and res objects 
// In this case middleware/authenticate.js changes the "req" object so that it also contains the logged in user
app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
        text : req.body.text,
        _creator : req.user._id
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


app.get("/todos", authenticate, (req, res) => {
    // The query in Todo.find means that only the todos with the creator being the 
    // logged in user, will be returned
    Todo.find({
        _creator : req.user._id
    }).then( 
        (todos) => {
            res.send({
                todos
            });
        },
        (e) => {
            res.status(400).send(e);
        }
    )
});

// The text after the colon creates a "todoId" variable, which allows user to specify a certain ID
// They want to search for
// It is a search parameter
app.get("/todos/:todoId", authenticate, (req, res) => {
    var requestedId = req.params.todoId;
    if(!ObjectID.isValid(requestedId)){
        res.status(404).send();
    }
    Todo.findOne({
        _id : requestedId,
        _creator: req.user._id
    }).then(
        (todo) => {
            if(!todo){
                res.status(404).send();
            } else {
                // Try and always send stuff back in an object because it leaves more room for modification :P
                res.send({todo});
            }
        }
    ).catch((e) => {
        res.status(400).send();
    })  
});



app.delete("/todos/:todoId", authenticate, (req,res) => {
    var requestedId = req.params.todoId;
    if(!ObjectID.isValid(requestedId)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id : requestedId,
        _creator: req.user._id 
    }).then(
        // Where doc is the todo to delete
        (doc) => {
            if(!doc) {
                res.status(404).send();
            }
            else {
                res.send({doc});
            }
        }
    ).catch((e) => {
        res.status(400).send();
    })
});

app.patch("/todos/:todoId", authenticate, (req, res) => {
    var id = req.params.todoId;
    // _.pick is  a lodash function that takes an object, and an array of properties that you want to pull off
    // (If they exist) 
    // Stops users from just updating anything they choose, e.g. dont want them changing bank account balance
    var body = _.pick(req.body, ["text", "completed"]);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // Using the $set keyword again, like in cthe mongodb-update file
    Todo.findOneAndUpdate({_id : id, _creator : req.user._id}, { $set : body}, {new : true}).then( (todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
})


app.post("/users", (req, res) => {
    var body = _.pick(req.body, ["email", "password"])
    var user = new User(body);

    user.save().then(
        () => {
            return user.generateAuthToken();
        }
    ).then((token) => {
        res.header("x-auth", token).send(user);
    })
    .catch((e) => {
        res.status(400).send(e);
    })
});

app.post("/users/login", (req, res) => {
    var details = _.pick(req.body, ["email", "password"]);    
    User.findByCredentials(details.email, details.password).then( (user) => {        
        return user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        });
    }).catch( (e) => {
        res.status(400).send();
    })
})



// This route is gonna require authentication, so the user needs a valid x-auth token
// The "authenticate" paramaeter is actually a middleware function
app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
        () => {
            res.status(200).send();
        },
        () => {
            res.status(400).send();
        }
    );
});



app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};











































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
