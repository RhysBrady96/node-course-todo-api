const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/Todo");
const {User} = require("./../models/User");

const{todos, populateTodos, users, populateUsers} = require("./seed/seed");




// BeforeEach runs before EVERY TEST-CASE, only moves along once we call "done"
beforeEach(populateUsers);
beforeEach(populateTodos);


describe("POST /todos", () => {
    // REMEMBER: "done" parameter specifies that the test is using a Promise
    it("Should create a new Todo in the DB", (done) => {
        var text = "Test todo text";

        //text : text
        request(app)
            .post("/todos")
            .send( {text} )
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if (err)
                {
                    return done(err);
                }
                // Todo.find() <--- returns EVERY TODO in the collection
                Todo.find({text}).then( (todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it("Shouldnt create a new todo when passing invalid data", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end( (err, res) => {
                if(err)
                {
                    return done(err);
                }
                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));


            })
    })
})

describe("GET /todos", () => {
    it("Should get ALL todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    })
});

describe("GET /todos/:id", () => {
    it("Should return todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        var wrongId = new ObjectID();
        request(app)
            .get(`/todos/${wrongId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 for non-object ids", (done) => {
        request(app)
            .get("/todos/LOL")
            .expect(404)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("Should remove a todo", (done) => {
        var toDelete = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todos/${toDelete}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toBe(toDelete);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(toDelete).then( (todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it("Should return a 404 if todo not found", (done) => {
        var wrongId = new ObjectID();
        request(app)
            .delete(`/todos/${wrongId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("Should return a 404 if ObjectID is invalid", (done) => {
        request(app)
            .delete("/todos/LOL")
            .expect(404)
            .end(done);        
    })
});

describe("PATCH /todos/:id", () => {

    it("Should update the Todo" , (done) => {
        var toUpdate = todos[0]._id.toHexString();
        var text = "New text after patch";
        request(app)
            .patch(`/todos/${toUpdate}`)
            .send({
                completed : true,
                text
            })
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe("number");
            })
            .end(done)
    });

    it("Should clear completedAt when todo is NOT completed" , (done) => {
        var toUpdate = todos[2]._id.toHexString();
        var text = "changing completed to false";
        request(app)
            .patch(`/todos/${toUpdate}`)
            .send({
                text,
                completed : false
            })
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done)
    });
})

describe("GET /users/me", () => {
    it("Should return a user if authenticated (good token)", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("Should return a 401 if not authenticated (Empty Token provided)", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
});

describe("POST /users", () => {
    it("Should create a user if valid", (done) => {
        var email = "example@example.com";
        var password = "123abc123";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then( (user) => {
                    expect(user).toBeTruthy();
                    // Here, we can check if we are saving the hashed values rather than plaintext
                    expect(user.password).not.toBe(password);
                    done();
                })
            });
    });

    it("Should return validation errors if request is invalid", (done) => {
        var email = "invalidemail";
        var password = "inv";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .end(done)
    });

    it("Should not create user if email in use already", (done) => {
        var email = users[0].email;
        var password = "123abc123";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .end(done);
    });
})