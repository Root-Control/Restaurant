(function () {
  'use strict';

  // Configuring the Tables Admin module
  angular
    .module('tables.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'See all Tables',
      state: 'admin.tables.list'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create new Table',
      state: 'admin.tables.create'
    });
  }
}());
