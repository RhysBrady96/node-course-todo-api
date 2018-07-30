const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/Todo");
const {User} = require("./../../models/User");

// Dummy todos, act as seed data so we can test things like read, delete, and modify
const todos = [
    {
        _id : new ObjectID(),
        text : "First test todo"
    },
    {
        _id : new ObjectID(),
        text : "Second test todo"
    },
    {
        _id : new ObjectID(),
        text : "Third test todo", 
        completed : true,
        completedAt : 333
    }
];

const user1ID = new ObjectID();
const user2ID = new ObjectID();
const users = [
    {
        _id : user1ID,
        email : "rhys@example.com",
        password : "user1Pass",
        tokens : [{
            access : "auth",
            token : jwt.sign({_id : user1ID, access: "auth"}, "abc123").toString()
        }]
    },
    {
        _id : user2ID,
        email : "eddy@example.com",
        password : "user2Pass",
    }
];


const populateTodos = (done) => {
    // Removes all documents from the Todo collection
    Todo.remove({}).then(
        () => {
            // adds the dummy documents into the Collection
            return Todo.insertMany(todos);
        }
    ).then(() => done())
};

// Cant use "InsetMany" like we did in the example abpve: This is because it wont execute our middleware
// Therefore if we used insertMany we would be saving the plaintext rather than the hashed password
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        // A feature that allows us to wait for multiple promises to be completed before continueing
        // As opposed to waiting for them indicidually.
        // Here, nothing happens until both the userOne and userTwo promise are completed
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}