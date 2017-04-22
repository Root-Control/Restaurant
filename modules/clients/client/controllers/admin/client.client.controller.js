(function () {
  'use strict';

  angular
    .module('clients.admin')
    .controller('ClientsAdminController', ClientsAdminController);

  ClientsAdminController.$inject = ['$scope', '$state', '$window', 'clientResolve', 'Authentication', 'Notification'];

  function ClientsAdminController($scope, $state, $window, clientResolve, Authentication, Notification) {
    var vm = this;

    //  vm.client verifica si hay algun id de algun cliente.
    vm.client = clientResolve;
    vm.authentication = Authentication;
    vm.rol = vm.authentication.user.roles[0];

    // Eliminar cliente existente
    vm.remove = function() {
      if ($window.confirm('Estás seguro de querer eliminar este item?')) {
        vm.client.$remove(function() {
          $state.go('admin.clients.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> El artículo ha sido eliminado!' });
        });
      }
    };

    // Guardar Cliente
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clientForm');
        return false;
      }
      // Creamos un nuevo cliente o actualizamos si existe
      vm.client.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.clients.list'); // should we send the User to the list or the updated Client's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Client saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Client save error!' });
      }
    };
  }
}());
