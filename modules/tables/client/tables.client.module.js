(function (app) {
  'use strict';
  app.registerModule('tables', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tables.admin', ['core.admin']);
  app.registerModule('tables.admin.routes', ['core.admin.routes']);
  app.registerModule('tables.services');
  app.registerModule('tables.routes', ['ui.router', 'core.routes', 'tables.services']);
}(ApplicationConfiguration));
