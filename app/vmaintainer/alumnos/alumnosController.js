app.controller('alumnosController', function ($scope, i18nService, CONFIG, apiAlumnoFactory, apiComboFactory, uiGridConstants,$timeout) {

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
          { field: 'id_Alumno', minWidth: 80, width: 80, enableColumnResizing: false },
          { field: 'nombre', minWidth: 200, width: 300, enableColumnResizing: false },
          { field: 'username', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'rut', minWidth: 100, width: 150, enableColumnResizing: false },
          { field: 'email', minWidth: 170, width: 180, enableColumnResizing: false },
          { field: 'estado', minWidth: 100, width: 120, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };

  $scope.comboCursoInstitucion = function () {
    apiComboFactory.getInst().then(function (data) {
        $scope.comboIns = data.data.trxObject;
        //console.log(data);
        $timeout(function() {
              $scope.getComboNiv();
          }, 2000);
    });
  }

  $scope.getComboNiv = function () {
      apiComboFactory.getNiv().then(function (data) {
          $scope.cmbNiv = data.data;
      });
  }


  $scope.comboAsignatura = function (id_Institucion, id_Nivel) {
      apiComboFactory.getAsignaturas(id_Institucion, id_Nivel).then(function (data) {
          $scope.combo = data.data.trxObject;
      });
  }

  $scope.getAll = function (id) {
      $scope.asignaturaId = id;
      apiAlumnoFactory.getMisAlumnos(id).then(function (data) {
          $scope.gridOptions.data = data.data.trxObject;
      }).then(function (data) {
           //$scope.getCombo();
      });
  };


  $scope.editALU = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      //$scope.getCombo();
      if (registro != '') {
          $scope.registroEdit = registro[0];
      }
  }


  $scope.delALU = function(id){
      var registro = $scope.gridApi.selection.getSelectedRows();
      if (registro != '') {
          apiAlumnoFactory.delAlumno(id,registro[0].id_Alumno).then(function (data){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
            });
          })
      } else {
          alert('Debe seleccionar un registro');
      }
  }

  $scope.updALU = function(id,registro){
      apiAlumnoFactory.setAlumno(id, registro).then(function (data) {
          if (data.data.detailsResponse.code == "00") {
              alert('Registro Editado Correctamente');
              $scope.getAll(id);
          } else {
              alert('Error al editar registro');
          }
      }).catch(function (error) {
          alert('Error al editar registro');
      })
  }

  $scope.addALU = function(id, registro){
      apiAlumnoFactory.addAlumno(id, registro).then(function (data) {
          if (data.data.detailsResponse.code == "00") {
              alert('Registro Agregado Correctamente');
              $scope.getAll(id);
          } else {
              alert('Error al agregar registro');
          }
      }).catch(function (error) {
          alert('Error al agregar registro');
      })
  }

  $scope.addALUCSV = function(id, registro){
      apiAlumnoFactory.addAlumno(id, registro).then(function (data) {
          if (data.data.detailsResponse.code == "00") {
              console.log('Registro Agregado Correctamente:' + registro);
          } else {
              console.log('Error al agregar registro' + registro);
          }
      }).catch(function (error) {
          console.log('Error al agregar registro' + registro);
      })
  }


  $scope.procesarCSV = function (id, allText) {
      var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for ( var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var registro = { "nombre": data[0], "rut": data[1], "email": data[2], "estado": data[3] };
        console.log(registro);
        $scope.addALUCSV(id, registro);
         /*$timeout( function(){
            $scope.addALUCSV(id, registro);
        }, 8000 );*/


    }
    $scope.getAll($scope.asignaturaId);
    alert('Archivo procesado');


  }



});
app.factory('apiAlumnoFactory', function($http, $q, CONFIG, $cookies){
    return {

        getTodos: function()
        {
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/alumno/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getMisAlumnos: function(id)
        {
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/find';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.post(url,{});
        },
        delAlumno: function(id, id_alumno)
        {
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/del';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.post(url, { id_Alumno: id_alumno });
        },
        setAlumno: function(id, obj)
        {
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/upd';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.post(url, obj);
        },
        addAlumno: function(id, obj)
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/add',
                data: obj
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;


        }

    }
});

app.factory('apiComboFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getInst: function()
        {
          var datos = {};
          var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
          return $http.post(url,datos);

            //var url = CONFIG.APISOSTOS + '/institucion/get';
            //$http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            //return $http.get(url);
        },
        getNiv: function()
        {
            var url = CONFIG.APISOSTOS + '/nivel/get';
            return $http.get(url);
        },
        getAsignaturas: function( id, id_niv )
        {
            var datos = { "id_Institucion": id, "id_Nivel": id_niv };
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        }
    }
});
