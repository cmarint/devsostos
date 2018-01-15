app.factory('apiAlumnoFactory', function($http, $q, CONFIG, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
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
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/add';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.post(url, obj);
        },
         getAsignaturas: function()
        {
            var datos = {};
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        }

    }
});

app.controller('alumnosController', function ($scope, i18nService, CONFIG, apiAlumnoFactory, uiGridConstants) {

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


  $scope.comboAsignatura = function () {
      apiAlumnoFactory.getAsignaturas().then(function (data) {
          $scope.combo = data.data.trxObject;
      });
  }

  $scope.getAll = function (id) {
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
          $scope.getAll(id);
      })
  }

  $scope.addALU = function(id, registro){
      apiAlumnoFactory.addAlumno(id, registro).then(function (data) {
           $scope.getAll(id);
          //$scope.gridOptions.data.push(data.data);
      })
  }


});
