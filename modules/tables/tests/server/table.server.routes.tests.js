'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Table = mongoose.model('Table'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  table;

/**
 * Table routes tests
 */
describe('Table CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new table
    user.save(function () {
      table = {
        title: 'Table Title',
        content: 'Table Content'
      };

      done();
    });
  });

  it('should not be able to save an table if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tables')
          .send(table)
          .expect(403)
          .end(function (tableSaveErr, tableSaveRes) {
            // Call the assertion callback
            done(tableSaveErr);
          });

      });
  });

  it('should not be able to save an table if not logged in', function (done) {
    agent.post('/api/tables')
      .send(table)
      .expect(403)
      .end(function (tableSaveErr, tableSaveRes) {
        // Call the assertion callback
        done(tableSaveErr);
      });
  });

  it('should not be able to update an table if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tables')
          .send(table)
          .expect(403)
          .end(function (tableSaveErr, tableSaveRes) {
            // Call the assertion callback
            done(tableSaveErr);
          });
      });
  });

  it('should be able to get a list of tables if not signed in', function (done) {
    // Create new table model instance
    var tableObj = new Table(table);

    // Save the table
    tableObj.save(function () {
      // Request tables
      request(app).get('/api/tables')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single table if not signed in', function (done) {
    // Create new table model instance
    var tableObj = new Table(table);

    // Save the table
    tableObj.save(function () {
      request(app).get('/api/tables/' + tableObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', table.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single table with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tables/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Table is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single table which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent table
    request(app).get('/api/tables/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No table with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an table if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tables')
          .send(table)
          .expect(403)
          .end(function (tableSaveErr, tableSaveRes) {
            // Call the assertion callback
            done(tableSaveErr);
          });
      });
  });

  it('should not be able to delete an table if not signed in', function (done) {
    // Set table user
    table.user = user;

    // Create new table model instance
    var tableObj = new Table(table);

    // Save the table
    tableObj.save(function () {
      // Try deleting table
      request(app).delete('/api/tables/' + tableObj._id)
        .expect(403)
        .end(function (tableDeleteErr, tableDeleteRes) {
          // Set message assertion
          (tableDeleteRes.body.message).should.match('User is not authorized');

          // Handle table error error
          done(tableDeleteErr);
        });

    });
  });

  it('should be able to get a single table that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new table
          agent.post('/api/tables')
            .send(table)
            .expect(200)
            .end(function (tableSaveErr, tableSaveRes) {
              // Handle table save error
              if (tableSaveErr) {
                return done(tableSaveErr);
              }

              // Set assertions on new table
              (tableSaveRes.body.title).should.equal(table.title);
              should.exist(tableSaveRes.body.user);
              should.equal(tableSaveRes.body.user._id, orphanId);

              // force the table to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the table
                    agent.get('/api/tables/' + tableSaveRes.body._id)
                      .expect(200)
                      .end(function (tableInfoErr, tableInfoRes) {
                        // Handle table error
                        if (tableInfoErr) {
                          return done(tableInfoErr);
                        }

                        // Set assertions
                        (tableInfoRes.body._id).should.equal(tableSaveRes.body._id);
                        (tableInfoRes.body.title).should.equal(table.title);
                        should.equal(tableInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single table if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new table model instance
    var tableObj = new Table(table);

    // Save the table
    tableObj.save(function () {
      request(app).get('/api/tables/' + tableObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', table.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single table, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'tableowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Table
    var _tableOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _tableOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Table
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new table
          agent.post('/api/tables')
            .send(table)
            .expect(200)
            .end(function (tableSaveErr, tableSaveRes) {
              // Handle table save error
              if (tableSaveErr) {
                return done(tableSaveErr);
              }

              // Set assertions on new table
              (tableSaveRes.body.title).should.equal(table.title);
              should.exist(tableSaveRes.body.user);
              should.equal(tableSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the table
                  agent.get('/api/tables/' + tableSaveRes.body._id)
                    .expect(200)
                    .end(function (tableInfoErr, tableInfoRes) {
                      // Handle table error
                      if (tableInfoErr) {
                        return done(tableInfoErr);
                      }

                      // Set assertions
                      (tableInfoRes.body._id).should.equal(tableSaveRes.body._id);
                      (tableInfoRes.body.title).should.equal(table.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (tableInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Table.remove().exec(done);
    });
  });
});
