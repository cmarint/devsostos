app.factory('apiEstabFactory', function($http, $q, CONFIG){
    return {
        getTodos: function() 
        { 
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOSBE + '/institucion/get'
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
                url: CONFIG.APISOSTOSBE + '/institucion/upd',
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
                url: CONFIG.APISOSTOSBE + '/institucion/add',
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
                url: CONFIG.APISOSTOSBE + '/institucion/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }
        
    }
});

app.controller('institucionesController', function ($scope, i18nService, CONFIG, apiEstabFactory, uiGridConstants) {
  
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
      apiEstabFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
      });
  };

  
  $scope.editEST = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') { 
          $scope.registroEdit = registro[0]; 
      }
  }
  
  
  $scope.delEST = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {  
          apiEstabFactory.delEst(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }
  
  $scope.updEST = function(registro){
      apiEstabFactory.setEst(registro).then(function (data) {
          console.log(data.data);
      })
  }
  
  $scope.addEST = function(registro){
      //registro.estado = registro.flag ? 'A' : 'I';
      //delete registro.flag;
      apiEstabFactory.addEst(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
          //console.log(data.data);
      })
  }


});
