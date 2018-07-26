// const MongoClient = require("mongodb").MongoClient;

const {MongoClient, ObjectID} = require("mongodb");

// Makes an ID in the same way as mongo does, 
// dont know why you'd ever want to, since mongo does it for you.......
var obj = new ObjectID();
console.log(obj);



// // An ES6 feature known as "Object destructuring"
// var user = {name : "andrew", age: 25}
// // Makes the "name" within a user, into a variable
// var {name} = user;
// console.log(name);

MongoClient.connect("mongodb://localhost:27017/TodoApp", 
    (err, db) => 
    {
        if(err) {
            return console.log("Unable to connect to MongoDB server");
        }
        console.log("Connected to MongoDB server");

        // db.collection("Todos").insertOne(
        // {
        //     text: "Something to do",
        //     completed : false
        // }, 
        // (err, result) => {
        //     if(err)
        //     {
        //         return console.log("Unable to insert Todo", err);
        //     }
        //     // result.ops contains all of the data that the user tried to insert into the DB collection
        //     console.log(JSON.stringify(result.ops, undefined, 2));
        // });


        // db.collection("Users").insertOne(
        //     {
        //         name: "Rhys Brady",
        //         age: 21,
        //         Location: "52 Cedar Road, Barrow"
        //     },
        //     (err, result)  => {
        //         if(err)
        //         {
        //             return console.log("Unable to add users", err);
        //         }
        //         console.log(JSON.stringify(result.ops, undefined, 2));
        //         console.log(`Time of creation: ${result.ops[0]._id.getTimestamp()}`);                
        //     }
        // );

        db.close();
    }
);