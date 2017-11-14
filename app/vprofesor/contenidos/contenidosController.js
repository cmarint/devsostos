app.factory('apiTemaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/find';
            return $http.post(url,{});
        },
        setTem: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
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
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
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
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
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
          { field: 'id_Tema_Padre', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'nombre', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 300, enableColumnResizing: false },
          { field: 'estado', headerCellClass: $scope.highlightFilteredHeader, minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };
  /*
  $scope.gridOptions.columnDefs[1].visible = false;
  $scope.gridOptions.columnDefs[3].visible = false;*/

  $scope.getAll = function () {
      apiTemaFactory.getTodos().then(function (data) {
          var parentId = "";

          //$scope.gridOptions.data = data.data.trxObject;
          var datos = data.data.trxObject;
          var datos2 = data.data.trxObject;
          var arbol = [];
          angular.forEach(datos, function (value, key) {
                if (value.id_Tema_Padre == null) {
                    //console.log('Padre Id' + value.id);
                    parentId = value.id;
                    parentName = value.nombre;

                    var hijos = [];
                    angular.forEach(datos2, function (value, key) {
                         if (angular.equals(value.id_Tema_Padre, parentId)) {
                            hijos.push({id: value.id, nombre: value.nombre});
                            //console.log('Id' + value.id + ' Hijo de' + value.id_Tema_Padre);
                         }
                    })
                    arbol.push({id: parentId, nombre: parentName, hijos: hijos});
                }

                //console.log(key + ": " + value.id + ": " + value.id_Tema_Padre);
          });
          //console.log(arbol);
          $scope.arbolito = arbol;

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



