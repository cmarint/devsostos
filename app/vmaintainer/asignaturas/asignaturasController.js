app.factory('apiAsignaturaFactory', function($http, $q, CONFIG){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/asignatura/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getIns: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/institucion/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        setAsi: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/asignatura/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addAsi: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/asignatura/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delAsi: function(id)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/asignatura/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('asignaturasController', function ($scope, i18nService, CONFIG, apiAsignaturaFactory, uiGridConstants) {

  i18nService.setCurrentLang('es');
  $scope.gridOptions = {
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    enablePaginationControls: false,
    multiSelect: false,
    enableSorting: true,
    paginationPageSizes: [10, 30, 60],
    paginationPageSize: 10,
    columnDefs: [
          { field: 'id', minWidth: 80, width: 80, enableColumnResizing: false },
          { field: 'id_Institucion', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre_Institucion', minWidth: 200, width: 300, enableColumnResizing: false },
          { field: 'id_Nivel', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre_Nivel', minWidth: 200, width: 250, enableColumnResizing: false },
          { field: 'nombre', minWidth: 200, width: 250, enableColumnResizing: false },
          { field: 'estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };
  $scope.gridOptions.columnDefs[1].visible = false;
  $scope.gridOptions.columnDefs[3].visible = false;
  $scope.getAll = function () {
      apiAsignaturaFactory.getTodos().then(function (data) {

          $scope.gridOptions.data = data.data;

      }).then(function (data) {
           $scope.getCombo();
      });
  };

  $scope.getCombo = function () {
      apiAsignaturaFactory.getIns().then(function (data) {
          $scope.combo = data.data;
      });
  };


  $scope.editASI = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      //$scope.getCombo();
      if (registro != '') {
          $scope.registroEdit = registro[0];
      }
  }


  $scope.delASI = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiAsignaturaFactory.delAsi(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updASI = function(registro){
      apiAsignaturaFactory.setAsi(registro).then(function (data) {
          console.log(data.data);
      })
  }

  $scope.addASI = function(registro){
      apiAsignaturaFactory.addAsi(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
      })
  }


});
