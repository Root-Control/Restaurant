(function () {
  'use strict';

  angular
    .module('tables')
    .controller('TablesController', TablesController);

  TablesController.$inject = ['$scope', 'tableResolve', 'Authentication'];

  function TablesController($scope, table, Authentication) {
    var vm = this;

    vm.table = table;
    vm.authentication = Authentication;

  }
}());
