(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    //  Titulo del dropdown a desplegarse
    menuService.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['user']
    });

    // Items del dropdown
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'admin.articles.list',
      roles: ['user']
    });

    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Create new Article',
      state: 'admin.articles.create',
      roles: ['user']
    });
  }
}());
