'use strict';

/**
 * Module dependencies
 */
var clientsPolicy = require('../policies/clients.server.policy'),
  clients_collections = require('../controllers/collections-clients.server.controller'),
  clients_single = require('../controllers/single-clients.server.controller');

module.exports = function (app) {
  // Clients collection routes
  app.route('/api/clients').all(clientsPolicy.isAllowed)
    .get(clients_collections.list)
    .post(clients_collections.create);

  // Single client routes
  app.route('/api/clients/:clientId').all(clientsPolicy.isAllowed)
    .get(clients_single.read)
    .put(clients_single.update)
    .delete(clients_single.delete);

  // Finish by binding the client middleware
  app.param('clientId', clients_single.clientByID);
};
