(function () {
  'use strict';

  angular
    .module('tables.services')
    .factory('TablesService', TablesService);

  TablesService.$inject = ['$resource', '$log'];

  function TablesService($resource, $log) {
    var vm = this;
    vm.table = $resource('/api/tables/:tableId', { tableId: '@_id' }, { update: { method: 'PUT' } });

    angular.extend(vm.table.prototype, {
      createOrUpdate: function () {
        var table = this;
        //  Si se hace el create, trae como resource interno la informacipon del formulario
        return createOrUpdate(table);
      }
    });
    return vm.table;

    function createOrUpdate(table) {
      if (table._id) {
        return table.$update(onSuccess, onError);
      } else {
        return table.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(table) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }

  }
}());
