// ********************** Initialize server **********************************
const server = require('../src/index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;
const bcrypt = require('bcrypt');
const {app, db} = require('../src/index'); // Import the express app and the database connection from index.js
let agent; // Chai HTTP agent to persist cookies across the test session


// *********************** TODO: WRITE 2 UNIT TESTCASES **************************
describe('Testing Add User API', () => {
    it('add user route should redirect to /login with 200 HTTP status code', done => {
      chai
          .request(server)
          .post('/add_user')
          .send({username: 'John Doe', email: 'JD@example.com', password: 'ONB25WI3r24UDIS34t7399SUY39fwe937AAb93bf'})
          .end((err, res) => {
            res.should.have.status(200); // Expecting a successful post status code
            res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/); // Expecting a redirect to /login with the mentioned Regex
            done();
          });
      });
      
    it('Negative : /add_user. Checking invalid name', done => {
      chai
        .request(server)
        .post('/add_user')
        .send({username: 'user1', email: 'aaaaa', password: 'wadef'})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equals('An account with this information already exists!');
          done();
        });
    });
  });
// ********************************************************************************
describe('Testing Render', () => {
    // Sample test case given to test /test endpoint.
    it('test "/login" route should render with an html response', done => {
      chai
        .request(server)
        .get('/login') // for reference, see lab 8's login route (/login) which renders home.hbs
        .end((err, res) => {
          res.should.have.status(200); // Expecting a success status code
          res.should.be.html; // Expecting a HTML response
          done();
        });
    });
  });

describe('Testing Add Favorites API', () => {
    it('add to favorites route should correctly add a favorite', done => {
        chai
          .request(server)
          .post('/add-to-favorites')
          .send({content_type: 'test-game', title: 'test-title', director: 'test-director', release_year: '1000', genre: 'test-genre', format: 'test-format', price: '0.1'})
          .end((err, res) => {
            res.should.have.status(200); // Expecting a successful post status code
            res.should.redirectTo(/^.*127\.0\.0\.1.*\//); // Expecting a redirect to /login with the mentioned Regex
            done();
          });
      });
  
    it('Testing remove favourites api', done => {
      chai
        .request(server)
        .post('/remove-from-favorites')
        .send({title: 'test-title'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
});

