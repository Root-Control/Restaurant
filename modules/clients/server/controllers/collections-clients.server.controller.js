'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Client = mongoose.model('Client'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an client
 */
exports.create = function (req, res) {
  var client = new Client(req.body);
  client.user = req.user;
  client.fullName = client.firstName + ' ' + client.lastName;

  client.save(function (err) {
    if (!err) {
      return res.json(client);
    }
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });

  });
};

/**
 * List of Clients
 */
exports.list = function (req, res) {
  Client.find().sort('-created').populate('user', 'displayName').exec(function (err, clients) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(clients);
    }
  });
};

//  List Clients by Regex
exports.getClientsByText = function(req, res) {
  var text = req.body.text;
  Client.find({ fullName: new RegExp(text, 'i') }).sort('-created').populate('user', 'displayName').exec(function (err, clients) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(clients);
    }
  });
};
