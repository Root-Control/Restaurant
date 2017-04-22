(function () {
  'use strict';

  angular
    .module('clients.services')
    .factory('ClientsService', ClientsService);

  ClientsService.$inject = ['$resource', '$log'];

  function ClientsService($resource, $log) {
    var vm = this;
    vm.client = $resource('/api/clients/:clientId', { clientId: '@_id' }, { update: { method: 'PUT' } });

    angular.extend(vm.client.prototype, {
      createOrUpdate: function () {
        var client = this;
        //  Si se hace el create, trae como resource interno la informacipon del formulario
        return createOrUpdate(client);
      }
    });
    return vm.client;

    function createOrUpdate(client) {
      if (client._id) {
        return client.$update(onSuccess, onError);
      } else {
        return client.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(client) {
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
