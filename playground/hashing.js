const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");



var data = {
    id : 10
};

// Takes the OBJECT, and a "Secret" (which is the SALT i guess?)
var token = jwt.sign(data, "123abc");

console.log(token);

var decoded = jwt.verify(token, "123abc");
console.log("decoded : ", decoded);







// Below is basically what happens behind the scenes of jsonwebtoken

var message = "Hello to the new world";


var hash = SHA256(message).toString();

console.log(`message : ${message}`);
console.log(`hash : ${hash}`);

// Creating the Token  (jwt.sign){
var data = {
    id : 4,
};

var token = {
    data,
    hash : SHA256(JSON.stringify(data) + "SecretSalt").toString()
};
// }

// Verifying the token (jwt.verify){
var resultHash = SHA256(JSON.stringify(token.data) + "SecretSalt").toString();
if(resultHash === token.hash){
    console.log("Data was not changed");
}
else {
    console.log("Data was changed, dont trust"); 
}
// }