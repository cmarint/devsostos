//FAQ
app.factory('apiFaqFactory', function($http, $q, CONFIG, store){
    return {
        getTodos: function() 
        { 
            //$http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/preguntafrecuente/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        setFaq: function(registro)
        {   
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/preguntafrecuente/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addFaq: function(registro)
        {   
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/preguntafrecuente/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delFaq: function(id)
        {   
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/preguntafrecuente/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }
        
    }
});

app.controller('preguntasfrecuenteController', function ($scope, i18nService, CONFIG, apiFaqFactory, uiGridConstants) {
  
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
      apiFaqFactory.getTodos().then(function (data) {
          $scope.gridOptions.data = data.data;
      });
  };
    
  $scope.getList = function () {
      apiFaqFactory.getTodos().then(function (data) {
          $scope.datos = data.data;
      });
  };

  
  $scope.editFAQ = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') { 
          $scope.registroEdit = registro[0]; 
      }
  }
  
  
  $scope.delFAQ = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {  
          apiFaqFactory.delFaq(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }
  
  $scope.updFAQ = function(registro){
      apiFaqFactory.setFaq(registro).then(function (data) {
          console.log(data.data);
      })
  }
  
  $scope.addFAQ = function(registro){
      //registro.estado = registro.flag ? 'A' : 'I';
      //delete registro.flag;
      apiFaqFactory.addFaq(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
          //console.log(data.data);
      })
  }


});
