app.factory('apiTemaFactory', function($http, $q, CONFIG, store){
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
        setTem: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/tema/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addTem: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/tema/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delTem: function(id)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/tema/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('contenidosController', function ($scope, i18nService, CONFIG, apiTemaFactory, uiGridConstants) {

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
          { field: 'id_Institucion', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre_Institucion', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 300, enableColumnResizing: false },
          { field: 'id_Nivel', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre_Nivel', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 250, enableColumnResizing: false },
          { field: 'nombre', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 250, enableColumnResizing: false },
          { field: 'periodo', headerCellClass: $scope.highlightFilteredHeader, minWidth: 100, width: 120, enableColumnResizing: false },
          { field: 'estado', headerCellClass: $scope.highlightFilteredHeader, minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };
  $scope.gridOptions.columnDefs[1].visible = false;
  $scope.gridOptions.columnDefs[3].visible = false;
  $scope.getAll = function () {
      apiTemaFactory.getTodos().then(function (data) {
          $scope.res = getNestedChildren(data, "0");
          console.log($scope.res);
          $scope.nested_array_stingified = JSON.stringify($scope.res);

          //$scope.gridOptions.data = data.data;

      }).then(function (data) {
           //$scope.getCombo();
      });
  };

//Institución
  $scope.getCombo = function () {
      apiTemaFactory.getIns().then(function (data) {
          $scope.combo = data.data;
      });
  }

//Nivel
  $scope.getComboNivel = function () {
      apiTemaFactory.getNiv().then(function (data) {
          $scope.comboNiv = data.data;
      });
  }


  $scope.editTEM = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      //$scope.getCombo();
      if (registro != '') {
          $scope.registroEdit = registro[0];
          $scope.getComboNivel();
      }
  }


  $scope.delTEM = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiTemaFactory.delTem(registro[0].id).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updTEM = function(registro){
      apiTemaFactory.setTem(registro).then(function (data) {
        //borro
        $scope.gridOptions.data = [];
      }).then(function (data) {
        apiTemaFactory.getTodos().then(function (data) {
            $scope.gridOptions.data = data.data;
        })
      })
  }

  $scope.addTEM = function(registro){
      apiTemaFactory.addTem(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
      })
  }


});





function getNestedChildren(arr, parent) {
    var out = []
    for (var i in arr) {
      if (arr[i].parent_id == parent) {
        var children = getNestedChildren(arr, arr[i].id)

        if (children.length) {
          arr[i].children = children
        }
        out.push(arr[i])
      }
    }
    return out
};

