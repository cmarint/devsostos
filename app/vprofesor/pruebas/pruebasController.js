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

        },
        setVariante: function(id_prueba, num_var)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/crear';
            return $http.post(url,{ "id_Prueba": id_prueba,"cant_Variante": num_var});
        },
        getPreguntas: function(id_tema)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/find';
            return $http.post(url,{});
        },
        printPrueba: function(id_variante)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/pdf/create';
            return $http.post(url,{"id_PruebaVariante": id_variante} ,{ responseType: 'arraybuffer'});
        },
        getPruebaVariante: function(idPrueba)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/' + idPrueba + '/pruebavariante/find';
            return $http.post(url,{});
        },
        getVariantes: function(idPrueba)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/find';
            return $http.post(url,{ "id_Prueba": idPrueba });
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



    $scope.selectPrueba = function(){
        $scope.datos = { id_prueba: "", num_var: ""};
        var registro = $scope.gridApi.selection.getSelectedRows();
        if (registro != '') {
            $scope.datos = { id_prueba: registro[0].id, num_var: ""};
            //alert(registro[0].id);
        } else {
            alert('Debe Seleccionar un Registro');
        }
    }



    $scope.nuevaPrueba = function() {
        $location.path('/mispruebas/pruebanueva',true);
    }

    $scope.nuevaPruebaManual = function() {
        $location.path('/mispruebas/pruebanuevamanual',true);
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

    $scope.generaVariante = function(id_prueba, num_var) {
        apiPruebaFactory.setVariante(id_prueba, num_var).then(function (data) {
            alert('Variantes Creadas Correctamente');
            $scope.getAll();
        })
    }

    $scope.getPreguntas = function(id_tema) {
              apiPruebaFactory.getPreguntas(id_tema).then(function (data) {
                $scope.preguntaList = data.data.trxObject;
              })
    }

    $scope.listaPreguntasPrueba = [];

    $scope.addPreguntaPrueba = function(modelPregunta) {
        $scope.listaPreguntasPrueba.push(modelPregunta);
    }

    $scope.printPrueba = function(id_variante) {
            var fileName = "prueba.pdf";
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
        apiPruebaFactory.printPrueba(id_variante).then(function (data) {

            var file = new Blob([data.data], {type: 'application/pdf'});
            //console.log(data.data);
             var fileURL = window.URL.createObjectURL(file);
                a.href = fileURL;
                a.download = fileName;
                a.click();
        })
    }

   /* $scope.listarVariantes = function() {
        //$scope.selectPrueba();
        if ($scope.datos != "") {
            apiPruebaFactory.getPruebaVariante($scope.datos.id_prueba).then(function (data) {
                console.log(data);
            })
        } else {
            alert('Debe seleccionar una prueba');
        }

    }*/

    $scope.listaVariantesPrueba = null;
    $scope.listarVariantes = function() {
        $scope.selectPrueba();
        if ($scope.datos != "") {
            apiPruebaFactory.getVariantes($scope.datos.id_prueba).then(function (data) {
                $scope.listaVariantesPrueba = data.data.trxObject;
            })
        } else {
            alert('Debe seleccionar una prueba');
        }
    }

});




