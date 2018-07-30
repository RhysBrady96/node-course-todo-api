var {User} = require("./../models/User");

// Middleware that will authenticate user requests before processing them
// makes routes private
// Middleware 3 arguments (actual route is NOT gonna run unless next() gets called)
var authenticate = (req, res, next) => {
    var token = req.header("x-auth");
    User.findByToken(token).then((user) => {
        if(!user){
            // Gets caught in the catch block below
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = { authenticate };