(function () {
  'use strict';

  angular
    .module('tables.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tables', {
        abstract: true,
        url: '/tables',
        template: '<ui-view/>'
      })
      .state('admin.tables.list', {
        url: '',
        templateUrl: '/modules/tables/client/views/admin/list-tables.client.view.html',
        controller: 'TablesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'user']
        }
      })
      .state('admin.tables.create', {
        url: '/create',
        templateUrl: '/modules/tables/client/views/admin/form-table.client.view.html',
        controller: 'TablesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'user']
        },
        resolve: {
          tableResolve: newTable
        }
      })
      .state('admin.tables.edit', {
        url: '/:tableId/edit',
        templateUrl: '/modules/tables/client/views/admin/form-table.client.view.html',
        controller: 'TablesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'user']
        },
        resolve: {
          tableResolve: getTable
        }
      });
  }

  getTable.$inject = ['$stateParams', 'TablesService'];

  function getTable($stateParams, TablesService) {
    return TablesService.get({
      tableId: $stateParams.tableId
    }).$promise;
  }

  newTable.$inject = ['TablesService'];

  function newTable(TablesService) {
    return new TablesService();
  }
}());
