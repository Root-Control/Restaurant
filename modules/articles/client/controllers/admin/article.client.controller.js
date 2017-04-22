(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminController', ArticlesAdminController);

  ArticlesAdminController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification'];

  function ArticlesAdminController($scope, $state, $window, articleResolve, Authentication, Notification) {
    var vm = this;

    //  vm.article verifica si hay algun id de algun articulo.
    vm.article = articleResolve;
    vm.authentication = Authentication;
    vm.rol = vm.authentication.user.roles[0];

    // Eliminar articulo existente
    vm.remove = function() {
      if ($window.confirm('Estás seguro de querer eliminar este item?')) {
        vm.article.$remove(function() {
          $state.go('admin.articles.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> El artículo ha sido eliminado!' });
        });
      }
    };

    // Guardar Articulo
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // Creamos un nuevo artículo o actualizamos si existe
      vm.article.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.articles.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    };
  }
}());
