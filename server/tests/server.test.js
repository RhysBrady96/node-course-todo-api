const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/Todo");


// Dummy todos, act as seed data so we can test things like read, delete, and modify
const todos = [
    {text : "First test todo"},
    {text : "Second test todo"},
    {text : "Third test todo"}
]



// BeforeEach runs before EVERY TEST-CASE, only moves along once we call "done"
beforeEach((done) => {
    // Removes all documents from the Todo collection
    Todo.remove({}).then(
        () => {
            // adds the dummy documents into the Collection
            return Todo.insertMany(todos);
        }
    ).then(() => done())
});

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