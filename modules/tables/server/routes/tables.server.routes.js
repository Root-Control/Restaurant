'use strict';

/**
 * Module dependencies
 */
var tablesPolicy = require('../policies/tables.server.policy'),
  tables_collections = require('../controllers/collections-tables.server.controller'),
  tables_single = require('../controllers/single-tables.server.controller');

module.exports = function (app) {
  // Tables collection routes
  app.route('/api/tables').all(tablesPolicy.isAllowed)
    .get(tables_collections.list)
    .post(tables_collections.create);

  // Single table routes
  app.route('/api/tables/:tableId').all(tablesPolicy.isAllowed)
    .get(tables_single.read)
    .put(tables_single.update)
    .delete(tables_single.delete);

  // Finish by binding the table middleware
  app.param('tableId', tables_single.tableByID);
};
