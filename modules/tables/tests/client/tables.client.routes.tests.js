(function () {
  'use strict';

  describe('Tables Route Tests', function () {
    // Initialize global variables
    var $scope,
      TablesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TablesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TablesService = _TablesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tables');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tables');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('tables.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/tables/client/views/list-tables.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TablesController,
          mockTable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tables.view');
          $templateCache.put('/modules/tables/client/views/view-table.client.view.html', '');

          // create mock table
          mockTable = new TablesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Table about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TablesController = $controller('TablesController as vm', {
            $scope: $scope,
            tableResolve: mockTable
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tableId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tableId: 1
          })).toEqual('/tables/1');
        }));

        it('should attach an table to the controller scope', function () {
          expect($scope.vm.table._id).toBe(mockTable._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/tables/client/views/view-table.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/tables/client/views/list-tables.client.view.html', '');

          $state.go('tables.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('tables/');
          $rootScope.$digest();

          expect($location.path()).toBe('/tables');
          expect($state.current.templateUrl).toBe('/modules/tables/client/views/list-tables.client.view.html');
        }));
      });
    });
  });
}());
