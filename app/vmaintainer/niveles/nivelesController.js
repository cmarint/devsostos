app.factory('apiCursoFactory', function($http, $q, CONFIG){
    return {
        getTodos: function() 
        { 
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOSBE + '/nivel/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        setEst: function(registro)
        {   
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOSBE + '/nivel/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addEst: function(registro)
        {   
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOSBE + '/nivel/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delEst: function(id)
        {   
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOSBE + '/nivel/del/' + id
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
          { field: 'nombre', minWidth: 200, width: 400, enableColumnResizing: false },
          { field: 'estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };
    
  $scope.getAll = function () {
      apiCursoFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
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
          apiCursoFactory.delEst(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }
  
  $scope.updNIV = function(registro){
      apiCursoFactory.setEst(registro).then(function (data) {
          console.log(data.data);
      })
  }
  
  $scope.addNIV = function(registro){
      apiCursoFactory.addEst(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
      })
  }


});