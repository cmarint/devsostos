app.factory('apiAsignaturaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
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
        getTodosPrima: function()
        {
            var datos = {};
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        },
        getIns: function()
        {
            var url = CONFIG.APISOSTOS + '/institucion/get';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.get(url);
        },
        getNiv: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/nivel/get';
            return $http.get(url);
        },
        setAsi: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(registro);
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/upd';
            return $http.post(url,regjson);
        },
        addAsi: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/asignatura/add',
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
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(id);
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/del/' + id;
            return $http.get(url);


        }

    }
});

app.controller('misasignaturasController', function ($scope, i18nService, CONFIG, apiAsignaturaFactory, uiGridConstants, $timeout) {

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
          { field: 'id_Asignatura', enableFiltering: false, minWidth: 80, width: 80, enableColumnResizing: false },
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
      apiAsignaturaFactory.getTodos().then(function (data) {

          $scope.gridOptions.data = data.data;

      }).then(function (data) {
           $scope.getCombo();
      });
  };

 $scope.getAllPrima = function () {
      apiAsignaturaFactory.getTodosPrima().then(function (data) {
         $scope.gridOptions.data = data.data.trxObject;
      }).then(function (data) {
          $timeout(function() {
                $scope.getComboIns();
            }, 2000);
          $timeout(function() {
                $scope.getComboNiv();
            }, 2000);
      });
  };

  //Institución
  $scope.getComboIns = function () {
      apiAsignaturaFactory.getIns().then(function (data) {
          $scope.cmbIns = data.data;
      });
  }


//Nivel
  $scope.getComboNiv = function () {
      apiAsignaturaFactory.getNiv().then(function (data) {
          $scope.cmbNiv = data.data;
      });
  }


  $scope.editASI = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          $scope.registroEdit = registro[0];
         // $scope.getComboNivel();
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
        //borro
        $scope.gridOptions.data = [];
      }).then(function (data) {
        apiAsignaturaFactory.getTodosPrima().then(function (data) {
            $scope.gridOptions.data = data.data.trxObject;
        })
      })
  }

  $scope.addASI = function(registro){
      apiAsignaturaFactory.addAsi(registro).then(function (data) {
          $scope.gridOptions.data.push(data.data);
      })
  }



});

