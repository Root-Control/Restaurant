﻿(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('articles.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'See all Articles',
      state: 'admin.articles.list'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create new Article',
      state: 'admin.articles.create'
    });
  }
}());
