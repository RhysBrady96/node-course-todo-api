var env = process.env.NODE_ENV || "development";


if(env === "development" || env === "test") {
    // When you require(*.json), it automatically parses it into a javascript object
    // Dont even have to use JSON.parse
    var config = require("./config.json");

    // Gets whether it is either development or test
    var envConfig = config[env];

    // keys returns an array of keys within the parameter object
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}




// if(env === "development") {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
// } else if(env === "test") {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
// }

