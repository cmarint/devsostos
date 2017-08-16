//PSE
app.factory('apiPseFactory', function($http, $q, CONFIG, store){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: false,
                url: CONFIG.APISOSTOS + '/preguntaseguridad/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        setPse: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: false,
                url: CONFIG.APISOSTOS + '/preguntaseguridad/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addPse: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: false,
                url: CONFIG.APISOSTOS + '/preguntaseguridad/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delPse: function(id)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: false,
                url: CONFIG.APISOSTOS + '/preguntaseguridad/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('preguntasfrecuenteController', function ($scope, i18nService, CONFIG, apiPseFactory, uiGridConstants) {
  
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
          { field: 'enunciado', minWidth: 100, width: 200, enableColumnResizing: false },
          { field: 'respuesta', enableSorting: false },
          { field: 'estado', minWidth: 100, width: 100, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };

  $scope.getAll = function () {
      apiPseFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
      });
  };

  $scope.getList = function () {
      apiPseFactory.getTodos().then(function (data) {
          $scope.datos = data.data;
      });
  };


  $scope.editPSE = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          $scope.registroEdit = registro[0];
      }
  }


  $scope.delPSE = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiPseFactory.delPse(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updPSE = function(registro){
      apiPseFactory.setPse(registro).then(function (data) {
          console.log(data.data);
      })
  }

  $scope.addPSE = function(registro){
      //registro.estado = registro.flag ? 'A' : 'I';
      //delete registro.flag;
      apiPseFactory.addPse(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
          //console.log(data.data);
      })
  }


});
