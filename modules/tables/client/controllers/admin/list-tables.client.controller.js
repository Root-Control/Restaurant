(function () {
  'use strict';

  angular
    .module('tables.admin')
    .controller('TablesAdminListController', TablesAdminListController);

  TablesAdminListController.$inject = ['TablesService'];

  function TablesAdminListController(TablesService) {
    var vm = this;

    vm.tables = TablesService.query();
  }
}());
