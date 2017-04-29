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
describe('Table Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an table if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
            }

            // Get a list of tables
            agent.get('/api/tables')
              .end(function (tablesGetErr, tablesGetRes) {
                // Handle table save error
                if (tablesGetErr) {
                  return done(tablesGetErr);
                }

                // Get tables list
                var tables = tablesGetRes.body;

                // Set assertions
                (tables[0].user._id).should.equal(userId);
                (tables[0].title).should.match('Table Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an table if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
            }

            // Update table title
            table.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing table
            agent.put('/api/tables/' + tableSaveRes.body._id)
              .send(table)
              .expect(200)
              .end(function (tableUpdateErr, tableUpdateRes) {
                // Handle table update error
                if (tableUpdateErr) {
                  return done(tableUpdateErr);
                }

                // Set assertions
                (tableUpdateRes.body._id).should.equal(tableSaveRes.body._id);
                (tableUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an table if no title is provided', function (done) {
    // Invalidate title field
    table.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new table
        agent.post('/api/tables')
          .send(table)
          .expect(422)
          .end(function (tableSaveErr, tableSaveRes) {
            // Set message assertion
            (tableSaveRes.body.message).should.match('Title cannot be blank');

            // Handle table save error
            done(tableSaveErr);
          });
      });
  });

  it('should be able to delete an table if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
            }

            // Delete an existing table
            agent.delete('/api/tables/' + tableSaveRes.body._id)
              .send(table)
              .expect(200)
              .end(function (tableDeleteErr, tableDeleteRes) {
                // Handle table error error
                if (tableDeleteErr) {
                  return done(tableDeleteErr);
                }

                // Set assertions
                (tableDeleteRes.body._id).should.equal(tableSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single table if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new table model instance
    table.user = user;
    var tableObj = new Table(table);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (tableInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
