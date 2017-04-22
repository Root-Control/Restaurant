(function () {
  'use strict';

  // Configuring the Clients Admin module
  angular
    .module('clients.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'See all Clients',
      state: 'admin.clients.list'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create new Client',
      state: 'admin.clients.create'
    });
  }
}());
