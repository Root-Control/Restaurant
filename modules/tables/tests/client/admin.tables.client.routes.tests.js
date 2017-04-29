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
          mainstate = $state.get('admin.tables');
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
          liststate = $state.get('admin.tables.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/tables/client/views/admin/list-tables.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TablesAdminController,
          mockTable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.tables.create');
          $templateCache.put('/modules/tables/client/views/admin/form-table.client.view.html', '');

          // Create mock table
          mockTable = new TablesService();

          // Initialize Controller
          TablesAdminController = $controller('TablesAdminController as vm', {
            $scope: $scope,
            tableResolve: mockTable
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/tables/create');
        }));

        it('should attach an table to the controller scope', function () {
          expect($scope.vm.table._id).toBe(mockTable._id);
          expect($scope.vm.table._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/tables/client/views/admin/form-table.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TablesAdminController,
          mockTable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.tables.edit');
          $templateCache.put('/modules/tables/client/views/admin/form-table.client.view.html', '');

          // Create mock table
          mockTable = new TablesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Table about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TablesAdminController = $controller('TablesAdminController as vm', {
            $scope: $scope,
            tableResolve: mockTable
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tableId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tableId: 1
          })).toEqual('/admin/tables/1/edit');
        }));

        it('should attach an table to the controller scope', function () {
          expect($scope.vm.table._id).toBe(mockTable._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/tables/client/views/admin/form-table.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
