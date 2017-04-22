'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Client = mongoose.model('Client'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

//  Lee el item traido por el middleware
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var client = req.client ? req.client.toJSON() : {};

  // Add a custom field to the Client, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Client model.
  client.isCurrentUserOwner = !!(req.user && client.user && client.user._id.toString() === req.user._id.toString());

  res.json(client);
};

/**
 * Update an client
 */
exports.update = function (req, res) {
  var client = req.client;

  client.firstName = req.body.firstName;
  client.lastName = req.body.lastName;
  client.email = req.body.email;
  client.updated = Date.now();
  client.birthDate = req.body.birthDate;
  client.clientType = req.body.clientType;
  client.legalName = req.body.legalName;
  client.rucOrDni = req.body.rucOrDni;
  client.phoneNumber = req.body.phoneNumber;
  client.points = req.body.points;

  client.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};

/**
 * Delete an client
 */
exports.delete = function (req, res) {
  var client = req.client;

  client.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};


/**
 * Client middleware
 */
exports.clientByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Client is invalid'
    });
  }

  Client.findById(id).populate('user', 'displayName').exec(function (err, client) {
    if (err) {
      return next(err);
    } else if (!client) {
      return res.status(404).send({
        message: 'No client with that identifier has been found'
      });
    }
    req.client = client;
    next();
  });
};
