
const {MongoClient, ObjectID} = require("mongodb");
var obj = new ObjectID();
console.log(obj);


MongoClient.connect("mongodb://localhost:27017/TodoApp", 
    (err, db) => 
    {
        if(err) {
            return console.log("Unable to connect to MongoDB server");
        }

        // // DeleteMany
        // db.collection("Todos").deleteMany({text : "eat lunch"}).then((result) => {
        //     console.log(result);
        // });

        // DeleteOne <-- Deletes first item that matches the criteria
        // db.collection("Todos").deleteOne({text : "eat lunch"}).then((result) => {
        //     console.log(result);
        // });

        // FindOneandDelete <--- Both deletes the object and returns it to the user
        // db.collection("Todos").findOneAndDelete({completed: false}).then((result) => {
        //     console.log(result);
            
        // });


        // db.collection("Users").deleteMany({name: "Rhys Brady"}).then((result) => {
        //     console.log("Deleting users with name: Rhys Brady");
        // });

        // db.collection("Users")
        //     .findOneAndDelete({_id : new ObjectID("5b59a39ecc52cc5dddf5d887")})
        //     .then((result) => {
        //         console.log(`deleted user account: ${JSON.stringify(result, undefined, 2)}`);
        //     })



        // db.close();
    }
);