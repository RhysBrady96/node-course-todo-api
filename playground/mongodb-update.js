
const {MongoClient, ObjectID} = require("mongodb");
var obj = new ObjectID();
console.log(obj);


MongoClient.connect("mongodb://localhost:27017/TodoApp", 
    (err, db) => 
    {
        if(err) {
            return console.log("Unable to connect to MongoDB server");
        }

        // Large Function, parameters of "findOneAndUpdate" are: 
        // #1. The filter, in this case we are searching for an object witth a specific ID
        // #2. SetObject, which includes the stuff within the filtered object we wanna change
        // #3. return original: Do you wanna change the older object values or the new ones 
        db.collection("Todos").findOneAndUpdate({
            _id: new ObjectID("5b59a05acc52cc5dddf5d700")
        }, {
            $set : {
                completed: true
            }
        }, {
            returnOriginal : false
        }).then((result) => {
            console.log(result);            
        });


        db.collection("Users").findOneAndUpdate({
            name: "Ed"
        }, {
            $set : {
                name: "Anthony"
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal : false
        }).then((result) => {
            console.log(result);            
        });


    }
);