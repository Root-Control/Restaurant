(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource', '$log'];

  function ArticlesService($resource, $log) {
    var vm = this;
    vm.article = $resource('/api/articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });

    angular.extend(vm.article.prototype, {
      createOrUpdate: function () {
        var article = this;
        //  Si se hace el create, trae como resource interno la informacipon del formulario
        return createOrUpdate(article);
      }
    });
    return vm.article;

    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
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
