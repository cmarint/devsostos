app.factory('apiPruebaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/prueba/find';
            return $http.post(url,{});
        },
        getAsignaturas: function()
        {
            var datos = {};
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        },
        getTemas: function(id_tema)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/find';
            return $http.post(url,{});
        },
        addPruebaAutomatica: function(obj) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/prueba/crear';
            return $http.post(url, obj);

        }

    }
});

app.controller('pruebasController', function ($scope, CONFIG, $http, $location, apiPruebaFactory, i18nService, uiGridConstants) {

    i18nService.setCurrentLang('es');

      $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if( col.filters[0].term ){
          return 'header-filtered';
        } else {
          return '';
        }
      };

    $scope.gridOptions = {
    //enableFiltering: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    enablePaginationControls: false,
    multiSelect: false,
    enableSorting: true,
    paginationPageSizes: [10, 30, 60],
    paginationPageSize: 10,
    columnDefs: [

          { field: 'id', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'descripcion', minWidth: 200, width: 200, enableColumnResizing: false },
          { field: 'exigencia', minWidth: 90, width: 90, enableColumnResizing: false },
          { field: 'puntajeMax', minWidth: 90, width: 90, enableColumnResizing: false },
          { field: 'notaMin', minWidth: 90, width: 90, enableColumnResizing: false },
         { field: 'notaMax', minWidth: 90, width: 90, enableColumnResizing: false },
         { field: 'notaAprob', minWidth: 90, width: 90, enableColumnResizing: false },
          { field: 'fecha', minWidth: 100, width: 120, enableColumnResizing: false },
          { field: 'estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };


   $scope.comboAsignatura = function () {
       apiPruebaFactory.getAsignaturas().then(function (data){
           $scope.ComboAsignatura = data.data.trxObject;
       })
   }

   $scope.comboTema = function () {
       apiPruebaFactory.getTemas().then(function (data){
           $scope.ComboTema = data.data.trxObject;
       })
   }



    $scope.getAll = function() {
        apiPruebaFactory.getTodos().then(function(data) {
             $scope.gridOptions.data = data.data.trxObject;

        })
    }

    $scope.models = {
        selected: null,
        lists: {"Preguntas": [], "Prueba": []}
    };


    $scope.models.lists.Preguntas = [
          {
                "id": 1,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 1"
            },
          {
                "id": 2,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 2"
            },
          {
                "id": 3,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 3"
            },
          {
                "id": 4,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 4"
            },
          {
                "id": 5,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 5"
            }
            ];


    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);


    $scope.nuevaPrueba = function() {
        $location.path('/mispruebas/pruebanueva',true);
    }

    $scope.grabaPruebaAuto = function (obj) {
        var arreglo = obj.temas;
        obj.id_Forma = 1;
        obj.temas = [];
        angular.forEach(arreglo, function (value, key) {
            obj.temas.push({ "id": value });
        })
        apiPruebaFactory.addPruebaAutomatica(obj).then(function (data) {
            console.log(data);
        })

    }



});




