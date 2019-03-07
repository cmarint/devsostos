/*** MANTENIMIENTO USUARIOS ****/
app.controller('usuariosController', function($scope, $rootScope, CONFIG, store, $http, $cookies, $window, usuariosFactory, i18nService, uiGridConstants, $timeout) {

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
          { field: 'usuario.id', enableFiltering: false, minWidth: 80, width: 80, enableColumnResizing: false },
          { field: 'usuario.email', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 300, enableColumnResizing: false },
          { field: 'usuario.nombre', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'usuario.username', headerCellClass: $scope.highlightFilteredHeader, minWidth: 200, width: 250, enableColumnResizing: false },
          { field: 'usuario.estado', headerCellClass: $scope.highlightFilteredHeader, minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };

    $scope.getUsuarios = function() {
        usuariosFactory.getTodos().then(function (data){
             $scope.gridOptions.data = data.data.trxObject;
        })
    }

    $scope.addUSER = function(user){
        var usuario = { "username": user.username, "nombre": user.nombre, "email": user.email, "estado": "A", "password": user.password};
        var rol = user.id_rol;
        usuariosFactory.usuarioAdd(usuario).then(function (data) {
            var id_usr = data.data.id;
            if (id_usr != null) {
                if (rol == 2) { //Profesor
                    var profe = { "rut": user.rut, "id_Usuario": id_usr };
                    $timeout(function() {
                        usuariosFactory.profesorAdd(profe).then(function (data) {
                            //Profesor creado
                        })
                    }, 2000);

                }
                if (rol == 3) { //Alumno

                }

                $timeout(function() {
                    $scope.getUsuarios();
                }, 1000);

            }

        })
    }

    $scope.updUSER = function(registro) {
        //console.log(registro);
        usuariosFactory.usuarioUpd(registro).then(function (data) {
            console.log(data);
        })
    }

    $scope.editUSER = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          $scope.registroEdit = registro[0].usuario;
          console.log($scope.registroEdit);
         // $scope.getComboNivel();
      }
    }

    $scope.delUSER = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      var detailsResponse = null;
      if (registro != '') {
          /*apiAsignaturaFactory.delAsi(registro[0].id).then(function (data){
            detailsResponse = data.data.detailsResponse;
            if (detailsResponse.code == 0) {
                angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                    $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
                });
            } else {
                alert('No es posible eliminar');
            }

          });*/
          angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                    $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
                });
      } else {
          alert('Debe seleccionar un registro');
      }
  }

    $scope.comboRol = function(){
        //usuariosFactory.getRol().then(function (data){
            //$scope.cmbRol = data.data.trxObject;
        //})
        $scope.cmbRol = [{ "id": 2, "nombre": "PROFESOR"}];
    }

    $scope.limpiar = function(){
        $scope.user = { "username": "", "nombre": "", "email": "", "estado": "A", "password": ""};
        /*$scope.profesor = {
            "id": 53,
            "rut": "2-7",
            "telefono": null,
            "comuna": null,
            "estado": "A",
            "id_Usuario": 1
        }*/
    }

 });

app.factory('usuariosFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/usuario/rol/find',
                data: {}
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getRol: function()
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/rol/find',
                data: {}
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        usuarioUpd: function(reg)
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/usuario/upd',
                data: reg
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        usuarioDel: function(id)
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/usuario/del',
                data: { "id": id }
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        usuarioAdd: function(user)
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/usuario/add',
                data: user
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        profesorAdd: function(user)
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/add',
                data: user
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }
    }
  });

/*** MANTENIMIENTO USUARIOS ****/
