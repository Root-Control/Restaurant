(function () {
  'use strict';

  angular
    .module('tables.admin')
    .controller('TablesAdminController', TablesAdminController);

  TablesAdminController.$inject = ['$scope', '$state', '$window', 'tableResolve', 'Authentication', 'Notification'];

  function TablesAdminController($scope, $state, $window, tableResolve, Authentication, Notification) {
    var vm = this;

    //  vm.table verifica si hay algun id de algun articulo.
    vm.table = tableResolve;
    vm.authentication = Authentication;
    vm.rol = vm.authentication.user.roles[0];

    // Eliminar articulo existente
    vm.remove = function() {
      if ($window.confirm('Estás seguro de querer eliminar este item?')) {
        vm.table.$remove(function() {
          $state.go('admin.tables.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> El artículo ha sido eliminado!' });
        });
      }
    };

    // Guardar Articulo
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tableForm');
        return false;
      }

      // Creamos un nuevo artículo o actualizamos si existe
      vm.table.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tables.list'); // should we send the User to the list or the updated Table's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Table saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Table save error!' });
      }
    };
  }
}());
