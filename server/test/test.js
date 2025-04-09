import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path:'../server/.env'});

before(async function() {
  // disable timeout for connection to database
  this.timeout(0);

  await mongoose.connect(
    process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

});


describe('GET /alumni/read', function() {
  before(function() {
    console.log('Starting tests...');
  });

  after(function() {
    console.log('Tests completed.');
  });

  it('should respond with json', function(done) {
    this.timeout(0);
    
    request(app)
      .get('/alumni/read')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        console.log("Test response: ", res.body);
        done();
      })
  })
})

describe('POST auth/register', function(){
  before(function() {
    console.log('Starting tests...');
  });

  after(function() {
    console.log('Tests completed.');
  });

  it("should register a new user", function (done) {
    request(app)
      .post("/auth/register")
      .send({
        name: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        console.log("Test response: ", res.body);
        done();
      });
  });
})

describe('POST auth/login', function(){
  before(function() {
    console.log('Starting tests...');
  });

  after(function() {
    console.log('Tests completed.');
  });

  it("should login with valid credentials", function (done) {
    request(app)
      .post("/auth/login")
      .send({
        name: "testuser",
        password: "testpassword",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        console.log("Test response: ", res.body);
        done();

      });
  });

  it("should fail to login with incorrect password", function (done) {
    request(app)
      .post("/auth/login")
      .send({
        name: "testuser",
        password: "wrongpassword",
      })
      .set("Accept", "application/json")
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        console.log("Test response: ", res.body);
        done();
      });
  });
})