const mongoose = require("mongoose");
const validator = require("validator");
const jwt  = require("jsonwebtoken");
const _ = require("lodash");

const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate : {
            validator : (value) => {
                return validator.isEmail(value);
            },
            message: "{VALUE} is not a valid email"
        }
    },
    password : {
        type: String,
        require: true,
        minlength : 6,
    },
    tokens : [{
        access: {
            type: String,
            required: true
        }, 
        token : {
            type: String,
            required: true
        }
    }]
});

// Here, we are overriding the toJSON method so that we dont send the entirety of the
// User details back when it is sent back to the user
// Because we dont wanna just be sending plain passwords and authentication tokens back... 
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ["_id", "email"]);
}

// Below is an example of an "Instance method" (Non-static)
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id : user._id.toHexString(), access}, "abc123").toString();

    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        // This ensures that "token" will be the success argument in the next "then()" call
        return token;
    });
}

// Below is an example of a "Model method" (Static method)
UserSchema.statics.findByToken = function (token) {
    // In the case of statics, "this" references the model itself, rather than a model instance
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, "abc123");
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        "_id" : decoded._id,
        "tokens.token" : token,
        "tokens.access" : "auth"
    })
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then( (user) => {
        if(!user) {
            // This would get caught further up the call stack (in server.js)
            return Promise.reject();
        }
        // PROBLEM: bcrypt only supports callbacks, NOT promises
        return new Promise( (resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    });
}

// REMEMBER: If you dont provide AND call "next()" then the middleware is never gonna complete
UserSchema.pre("save", function(next) {
    var user = this;
    // Remember: We only wanna encrypt the password if it was only just modified 
    if(user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})


var User = mongoose.model("User", UserSchema);

// The tokens property is actually a feature in MongoDB

module.exports = {User};