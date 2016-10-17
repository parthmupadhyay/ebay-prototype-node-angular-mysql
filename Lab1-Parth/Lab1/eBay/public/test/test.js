/**
 * Created by Parth on 16-10-2016.
 */
var supertest = require("supertest");
var should = require("should");
var mocha = require('mocha');

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("eBay unit tests",function(){

    // #1 should return home page

      it("if email exists api check",function(done)
    {

        // calling home page api
        server
            .post('/checkEmail')
            .send({ email : "parth81091@gmail.com"})
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res)
            {
                res.statusCode.should.equal(200);
                done();
            });
    });

    it("if username exists api check",function(done)
    {

        // calling home page api
        server
            .post('/checkUserName')
            .send({ username : "xyz"})
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res)
            {
                res.statusCode.should.equal(200);
                done();
            });
    });

    it("loadProducts api check",function(done)
    {

        // calling home page api
        server
            .get('/loadProducts')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res)
            {
                res.statusCode.should.equal(200);
               // res.body.error.should.equal(false);
                done();
            });
    });

    it("signin api check",function(done)
    {

        // calling home page api
        server
            .get('/signIn')
            .send({ username : "parthu",password : "123"})
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res)
            {
                res.statusCode.should.equal(200);
               // res.body.error.should.equal(false);
                done();
            });
    });

    it("user advertisement check",function(done)
    {

        // calling home page api
        server
            .get('/userAdvertisements')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res)
            {
                res.statusCode.should.equal(200);
             //   res.body.error.should.equal(false);
                done();
            });
    });
});