const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
// Bcrypt is great because its slow, it prevents brute force attacks
const bcrypt = require("bcryptjs");


var password = "123abc!";

// generates a salt, the first param is the number of rounds you wanna use to generate the salt.
bcrypt.genSalt(10, (err, salt) => {
    // parameters of bcrypt: the thing to hash, the salt to use, the callback function 
    // Note, "hash" is the thing we wanna store in our DB, rather than just plain text
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);        
    })
});

// NOTE: The salt is also appended on the end of the hashedPass, its only purpose is to 
// make sure every password has a unique salt so you cannot use the same dictionary for every user
// account
var hashedPass = "$2a$10$nqeeKfX6yDFcy8vgL2rpMOZar09ZKJZpHlMON2JRx6pxF1sI0in76";

bcrypt.compare(password, hashedPass, (err, result) => {
    console.log(result);    
});



















// var data = {
//     id : 10
// };

// // Takes the OBJECT, and a "Secret" (which is the SALT i guess?)
// var token = jwt.sign(data, "123abc");

// console.log(token);

// var decoded = jwt.verify(token, "123abc");
// console.log("decoded : ", decoded);







// // Below is basically what happens behind the scenes of jsonwebtoken

// var message = "Hello to the new world";


// var hash = SHA256(message).toString();

// console.log(`message : ${message}`);
// console.log(`hash : ${hash}`);

// // Creating the Token  (jwt.sign){
// var data = {
//     id : 4,
// };

// var token = {
//     data,
//     hash : SHA256(JSON.stringify(data) + "SecretSalt").toString()
// };
// // }

// // Verifying the token (jwt.verify){
// var resultHash = SHA256(JSON.stringify(token.data) + "SecretSalt").toString();
// if(resultHash === token.hash){
//     console.log("Data was not changed");
// }
// else {
//     console.log("Data was changed, dont trust"); 
// }
// // }