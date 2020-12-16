let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");


chai.should();
const {assert} = require('chai');

chai.use(chaiHttp)

before(function () {


});


describe('1. Verify that the API starts with an empty store.', () => {

    it('Check API Up', function (done) {
        chai.request(server).get("/api/books").end((err, res) => {
            res.should.have.status(200);
            done();
        })
    });

    it('At the beginning of a test case, there should be no books stored on the server.', function (done, getData) {
        getData = [];
        chai.request(server).get("/api/books").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            assert.deepEqual(res.body, getData);
            done();
        })
    });

});

describe('2. Verify that title and author are required fields.', () => {

    it('PUT /api/books/ Field author is required ', function (done, data) {
        data = {
            "id": 1,
            "author": null,
            "title": null
        };
        chai.request(server).put("/api/books/").send(data).end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error", "Field 'author' is required");
            done();
        })
    });

    it('PUT /api/books/ Field title is required ', function (done, data) {
        data = {
            "id": 1,
            "author": "testbook",
            "title": null
        };
        chai.request(server).put("/api/books/").send(data).end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error", "Field 'title' is required");
            done();
        })
    });
});
describe('3. Verify that title and author cannot be empty.', () => {

    it("PUT /api/books/ 'author' cannot be empty", function (done, data) {
        data = {
            "id": 1,
            "author": "",
            "title": "testtitle"
        };
        chai.request(server).put("/api/books/").send(data).end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error", "Field 'author' cannot be empty");
            done();
        })
    });

    it("PUT /api/books/ 'title' cannot be empty", function (done, data) {
        data = {
            "id": 1,
            "author": "testbook",
            "title": ""
        };
        chai.request(server).put("/api/books/").send(data).end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error", "Field 'title' cannot be empty");
            done();
        })
    });
});

describe('4. Verify that the id field is read−only.', () => {

    it("PUT /api/books/ push data record 1 with id value 6", function (done, data1) {
        data1 = {
            "id": 6,
            "author": "John Smith",
            "title": "SRE 101"
        };
        chai.request(server).put("/api/books/").send(data1).end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("id", 1);
            done();
        })
    });

});
describe('5. Verify that you can create a new book via PUT.', () => {

    it("PUT /api/books/ push data record 2", function (done, data2) {
        data2 = {
            "id": 2,
            "author": "Jane Archer",
            "title": "DevOps is a lie"
        };
        chai.request(server).put("/api/books/").send(data2).end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            assert.deepEqual(res.body, data2)
            done();
        })
    });
});

describe('6. Verify that you cannot create a duplicate book.', () => {

    it("PUT /api/books/ Another book with similar title and author already exists.", function (done, data) {
        data = {
            "id": 1,
            "author": "John Smith",
            "title": "SRE 101"
        };
        chai.request(server).put("/api/books/").send(data).end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error", "Another book with similar title and author already exists.");
            done();
        })
    });
});

describe('PUT /api/books/ Create Data with PUT', () => {


});

describe('GET /api/books with List Records', () => {

    it('GET /api/books', function (done, getData) {

        getData = [{
            "id": 1,
            "author": "John Smith",
            "title": "SRE 101"
        },
            {
                "id": 2,
                "author": "Jane Archer",
                "title": "DevOps is a lie"
            }];

        chai.request(server).get("/api/books").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("array");
            assert.deepEqual(res.body, getData);
            done();
        })
    });

    it('GET /api/books/:id with Single Record', function (done, id = 1) {

        chai.request(server).get("/api/books/" + id).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id", 1);
            res.body.should.have.property("author", "John Smith");
            res.body.should.have.property("title", "SRE 101");
            done();
        })
    });

    it('GET /api/books/:id does not exist.', function (done, id = 5) {

        chai.request(server).get("/api/books/" + id).end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("error", "id does not exist");
            done();
        })
    });
});






