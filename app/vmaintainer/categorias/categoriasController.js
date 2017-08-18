app.factory('apiCateFactory', function($http, $q, CONFIG, store){
    return {
        getTodos: function()
        {
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/categoria/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        setCat: function(registro)
        {
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/categoria/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addCat: function(registro)
        {
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/categoria/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delCat: function(id)
        {
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/categoria/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('categoriasController', function ($scope, i18nService, CONFIG, apiCateFactory, uiGridConstants) {

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
          { field: 'nombre', minWidth: 200, width: 400, enableColumnResizing: false },
          { field: 'estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };

  $scope.getAll = function () {
      apiCateFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
      });
  };

  $scope.editCAT = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          $scope.registroEdit = registro[0];
      }
  }


  $scope.delCAT = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiCateFactory.delCat(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updCAT = function(registro){
      apiCateFactory.setCat(registro).then(function (data) {
          console.log(data.data);
      })
  }

  $scope.addCAT = function(registro){
      //registro.estado = registro.flag ? 'A' : 'I';
      //delete registro.flag;
      apiCateFactory.addCat(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
          //console.log(data.data);
      })
  }


});
