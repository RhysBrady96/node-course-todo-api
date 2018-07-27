const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/Todo");


// BeforeEach runs before EVERY TEST-CASE, only moves along once we call "done"
beforeEach((done) => {
    // Removes all documents from the Todo collection
    Todo.remove({}).then(
        () => {
            done()
        }
    )
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
                Todo.find().then( (todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));


            })
    })
})