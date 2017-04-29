(function () {
  'use strict';

  angular
    .module('tables.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tables', {
        abstract: true,
        url: '/tables',
        template: '<ui-view/>'
      })
      .state('tables.list', {
        url: '',
        templateUrl: '/modules/tables/client/views/list-tables.client.view.html',
        controller: 'TablesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tables List'
        }
      })
      .state('tables.view', {
        url: '/:tableId',
        templateUrl: '/modules/tables/client/views/view-table.client.view.html',
        controller: 'TablesController',
        controllerAs: 'vm',
        resolve: {
          tableResolve: getTable
        },
        data: {
          pageTitle: 'Table {{ tableResolve.title }}'
        }
      });
  }

  getTable.$inject = ['$stateParams', 'TablesService'];

  function getTable($stateParams, TablesService) {
    return TablesService.get({ tableId: $stateParams.tableId }).$promise;
  }
}());
