app.factory('apiAlumnoFactory', function($http, $q, CONFIG, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/alumno/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('alumnosController', function ($scope, i18nService, CONFIG, apiAlumnoFactory, uiGridConstants) {

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
          { field: 'nombre_Asignatura', minWidth: 200, width: 300, enableColumnResizing: false },
          { field: 'username', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre', minWidth: 200, width: 250, enableColumnResizing: false },
          { field: 'rut', minWidth: 200, width: 250, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };
  //$scope.gridOptions.columnDefs[1].visible = false;
  //$scope.gridOptions.columnDefs[3].visible = false;
  $scope.getAll = function () {
      apiAlumnoFactory.getTodos().then(function (data) {

          $scope.gridOptions.data = data.data;

      }).then(function (data) {
           //$scope.getCombo();
      });
  };


  $scope.editALU = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      //$scope.getCombo();
      if (registro != '') {
          $scope.registroEdit = registro[0];
      }
  }


  $scope.delALU = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiAlumnoFactory.delAlu(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updALU = function(registro){
      apiAlumnoFactory.setAlu(registro).then(function (data) {
          console.log(data.data);
      })
  }

  $scope.addALU = function(registro){
      apiAlumnoFactory.addAlu(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
      })
  }


});
