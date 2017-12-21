app.factory('apiPruebaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/prueba/find';
            return $http.post(url,{});
        },
        getPruebas: function(id_tema)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/find';
            return $http.post(url,{});
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
          { field: 'descripcion', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'fecha', minWidth: 100, width: 120, enableColumnResizing: false },
          { field: 'estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };






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



});




