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
        },
        addPruebaManual: function(obj) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/prueba/add';
            return $http.post(url, obj);
            /*
            {
                "estado": "A",
                "id_Asignatura": 1,
                "id_Profesor": 1,
                "fecha": 1508904000000,
                "id_Categoria": 1
                }
            */
        },
        updEstadoPrueba: function(id) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/prueba/upd';
            console.log(id);
            return $http.post(url, { "id": id, "estado": "C"});
        }

    }
});

app.controller('pruebasController', function ($scope, CONFIG, $http, $location, apiPruebaFactory, i18nService, uiGridConstants, $filter) {

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
          { field: 'asignatura.nombre_Institucion', displayName: 'Institución', minWidth: 200, width: 200, headerCellClass: $scope.highlightFilteredHeader, enableColumnResizing: true },
          { field: 'asignatura.nombre_Nivel', displayName: 'Nivel', minWidth: 100, width: 100, headerCellClass: $scope.highlightFilteredHeader, enableColumnResizing: true },
          { field: 'asignatura.nombre', displayName: 'Asignatura', minWidth: 150, width: 150, headerCellClass: $scope.highlightFilteredHeader, enableColumnResizing: true },
          { field: 'prueba.id', displayName: 'Identificador', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'prueba.descripcion', displayName: 'Descripción', minWidth: 200, width: 200, enableColumnResizing: false },
          { field: 'prueba.exigencia', displayName: 'Exigencia', minWidth: 90, width: 90, enableColumnResizing: false },
        /*  { field: 'prueba.puntajeMax', minWidth: 90, width: 90, enableColumnResizing: false },
          { field: 'prueba.notaMin', minWidth: 90, width: 90, enableColumnResizing: false },
         { field: 'prueba.notaMax', minWidth: 90, width: 90, enableColumnResizing: false },
         { field: 'prueba.notaAprob', minWidth: 90, width: 90, enableColumnResizing: false },*/
          { field: 'prueba.fecha', displayName: 'Fecha', minWidth: 100, width: 120, enableColumnResizing: false },
          { field: 'prueba.estado', displayName: 'Estado', minWidth: 80, width: 80, enableColumnResizing: false }
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


   $scope.getCombosTema = function () {
       apiTemaFactory.getTemas(null).then(function (data) {
           $scope.comboTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: null});
           $scope.comboSubTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: ''});;
       });
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
            $scope.datos = { id_prueba: registro[0].prueba.id, num_var: ""};
            console.log(registro);
        } else {
            alert('Debe Seleccionar un Registro');
        }
    }

    $scope.PruebaCorregida = function() {
      apiPruebaFactory.updEstadoPrueba($scope.datos.id_prueba).then(function (data) {
        console.log(data);
      })
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

        obj.fecha = $filter('date')(obj.fecha, 'dd/MM/yyyy');
        //console.log(obj.fecha);

        apiPruebaFactory.addPruebaAutomatica(obj).then(function (data) {
          console.log('Ejecutado');
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

    $scope.delPreguntaPrueba = function(id) {
        $scope.listaPreguntasPrueba.splice(id,1);
        //console.log(id);
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

    $scope.grabaPruebaManual = function(obj)
    {
        var objPrueba = { "estado": "A",
                "id_Asignatura": obj.id_Asignatura,
                "fecha": obj.fecha,
                "id_Forma": 1,
                "descripcion": obj.descripcion,
                "exigencia": obj.exigencia,
                "puntajeMax": obj.puntajeMax,
                "notaMin": obj.notaMin,
                "notaAprob": obj.notaAprob,
                "notaMax": obj.notaMax };

        //console.log(obj);
        apiPruebaFactory.addPruebaManual(objPrueba).then(function (data) {
            console.log(data);
        })
         /*
         "exigencia", "puntajeMax", "notaMin", "estado", "id_Asignatura", "notaAprob", "id_Forma", "id", "fecha", "id_Profesor", "notaMax", "descripcion"
            {
                "estado": "A",
                "id_Asignatura": 1,
                "id_Profesor": 1,
                "fecha": 1508904000000,
                "id_Categoria": 1
                }
            */

    }

});
