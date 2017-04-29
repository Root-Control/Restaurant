'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Table = mongoose.model('Table'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

//  Lee el item traido por el middleware
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var table = req.table ? req.table.toJSON() : {};

  // Add a custom field to the Table, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Table model.
  table.isCurrentUserOwner = !!(req.user && table.user && table.user._id.toString() === req.user._id.toString());

  res.json(table);
};

/**
 * Update an table
 */
exports.update = function (req, res) {
  var table = req.table;

  table.tableNumber = req.body.tableNumber;
  table.status = req.body.status;
  table.visibilityStatus = req.body.visibilityStatus;
  table.chairQuantity = req.body.chairQuantity;

  table.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(table);
    }
  });
};

/**
 * Delete an table
 */
exports.delete = function (req, res) {
  var table = req.table;

  table.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(table);
    }
  });
};


/**
 * Table middleware
 */
exports.tableByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Table is invalid'
    });
  }

  Table.findById(id).populate('user', 'displayName').exec(function (err, table) {
    if (err) {
      return next(err);
    } else if (!table) {
      return res.status(404).send({
        message: 'No table with that identifier has been found'
      });
    }
    req.table = table;
    next();
  });
};
