(function () {
  'use strict';

  angular
    .module('clients')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    //  Titulo del dropdown a desplegarse
    menuService.addMenuItem('topbar', {
      title: 'Clients',
      state: 'clients',
      type: 'dropdown',
      roles: ['user']
    });

    // Items del dropdown
    menuService.addSubMenuItem('topbar', 'clients', {
      title: 'List Clients',
      state: 'admin.clients.list',
      roles: ['user']
    });

    menuService.addSubMenuItem('topbar', 'clients', {
      title: 'Create new Client',
      state: 'admin.clients.create',
      roles: ['user']
    });
  }
}());
