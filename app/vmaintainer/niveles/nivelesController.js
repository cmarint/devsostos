app.factory('apiCursoFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/nivel/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getIns: function()
        {
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
        setNiv: function(registro)
        {
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/nivel/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addNiv: function(registro)
        {
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/nivel/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delNiv: function(id)
        {
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/nivel/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('nivelesController', function ($scope, i18nService, CONFIG, apiCursoFactory, uiGridConstants) {

  i18nService.setCurrentLang('es');

  $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };

  $scope.gridOptions = {
    enableFiltering: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    enablePaginationControls: false,
    multiSelect: false,
    enableSorting: true,
    paginationPageSizes: [10, 30, 60],
    paginationPageSize: 10,
    columnDefs: [
          { field: 'id', enableFiltering: false, minWidth: 80, width: 80, enableColumnResizing: false },
          { field: 'id_Institucion', enableFiltering: false, minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre_Institucion', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 400, enableColumnResizing: false },
          { field: 'nombre', headerCellClass: $scope.highlightFilteredHeader, minWidth: 120, width: 200, enableColumnResizing: false },
          { field: 'estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };
 $scope.gridOptions.columnDefs[1].visible = false;
  $scope.getAll = function () {
      apiCursoFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
      }).then(function (data) {
           $scope.getCombo();
      });
  };

  $scope.getCombo = function () {
      apiCursoFactory.getIns().then(function (data) {
          $scope.combo = data.data;
      }).then(function (resp) {
          console.log($scope.combo);
      });
  };

  $scope.editNIV = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          $scope.registroEdit = registro[0];
      }
  }


  $scope.delNIV = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiCursoFactory.delNiv(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updNIV = function(registro){
      apiCursoFactory.setNiv(registro).then(function (data) {
        alert('Registro Actualizado Correctamente');
        $scope.gridOptions.data = [];
      }).then(function (data) {
        apiCursoFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
        })

      }).catch(function (error) {
          alert('Error al Editar registro');
      })
  }

  $scope.addNIV = function(registro){
      apiCursoFactory.addNiv(registro).then(function (data) {
          alert('Registro Agregado Correctamente');
          $scope.gridOptions.data.push(data.data);
      }).catch(function (error) {
          alert('Error al agregar registro');
      })
  }


});
