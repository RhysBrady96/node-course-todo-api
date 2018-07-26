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

        // Collection(<collectionName>).find(<query>) <=== Returns a pointer to the documents, called a cursor
        // Note that we are using "Then", because we collection.find returns a promise!
        // The parameter within "find" is known as the query
        // db.collection("Todos")
        //     .find({
        //         _id: new ObjectID("5b597e9fce50191bc463a2e5")
        //     })
        //     .toArray()
        //     .then(
        //         (docs) => {
        //             console.log("Todos");
        //             console.log(JSON.stringify(docs, undefined, 2));
        //         }, 
        //         (err) => {
        //             console.log("Unable to fetch todos", err);
        //         }
        //     );

        // db.collection("Users").find().count()
        //     .then(
        //         (count) => {
        //             console.log(`there are ${count} documents in the collection`);
        //         }, 
        //         (err) => {
        //             console.log("Unable to fetch todos", err);
        //         }
        //     );

        db.collection("Users").find({age: 22}).toArray().then(
            (docs) => {
                console.log(JSON.stringify(docs, undefined, 2));
            },
            (err) => {
                console.log("Unable to Fetch users");
            }
        )

        // db.close();
    }
);