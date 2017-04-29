'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Table = mongoose.model('Table'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an table
 */
exports.create = function (req, res) {
  var table = new Table(req.body);
  table.user = req.user;

  table.save(function (err) {
    if (!err) {
      return res.json(table);
    }
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });

  });
};

/**
 * List of Tables
 */
exports.list = function (req, res) {
  Table.find().sort('-created').populate('user', 'displayName').exec(function (err, tables) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tables);
    }
  });
};
