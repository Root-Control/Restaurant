(function () {
  'use strict';

  angular
    .module('tables')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    //  Titulo del dropdown a desplegarse
    menuService.addMenuItem('topbar', {
      title: 'Tables',
      state: 'tables',
      type: 'dropdown',
      roles: ['user']
    });

    // Items del dropdown
    menuService.addSubMenuItem('topbar', 'tables', {
      title: 'List Tables',
      state: 'admin.tables.list',
      roles: ['user']
    });

    menuService.addSubMenuItem('topbar', 'tables', {
      title: 'Create new Table',
      state: 'admin.tables.create',
      roles: ['user']
    });
  }
}());
