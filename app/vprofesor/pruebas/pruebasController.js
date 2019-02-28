app.controller('pruebasController', function ($scope, CONFIG, $http, $location, apiPruebaFactory, i18nService, uiGridConstants, $filter, $timeout) {

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
          { field: 'asignatura.nombre_Institucion', displayName: 'Institucin', minWidth: 200, width: 200, headerCellClass: $scope.highlightFilteredHeader, enableColumnResizing: true },
          { field: 'asignatura.nombre_Nivel', displayName: 'Nivel', minWidth: 100, width: 100, headerCellClass: $scope.highlightFilteredHeader, enableColumnResizing: true },
          { field: 'asignatura.nombre', displayName: 'Asignatura', minWidth: 150, width: 150, headerCellClass: $scope.highlightFilteredHeader, enableColumnResizing: true },
          { field: 'prueba.id', displayName: 'Identificador', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'prueba.descripcion', displayName: 'Descripcin', minWidth: 200, width: 200, enableColumnResizing: false },
          { field: 'prueba.exigencia', displayName: 'Exigencia', minWidth: 90, width: 90, enableColumnResizing: false },
          { field: 'prueba.fecha', displayName: 'Fecha', minWidth: 100, width: 120, enableColumnResizing: false },
          { field: 'prueba.estado', displayName: 'Estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };

  /**** NUEVO 28/02/2019 ****************/
  $scope.comboCursoInstitucion = function () {
    apiPruebaFactory.getIns().then(function (data) {
        $scope.comboIns = data.data.trxObject;
        //console.log(data);
        $timeout(function() {
              $scope.getComboNiv();
          }, 2000);
    });
  }

  $scope.getComboNiv = function () {
      apiPruebaFactory.getNiv().then(function (data) {
          $scope.cmbNiv = data.data;
      });
  }

  $scope.comboAsignaturaPorNivel = function (id_Institucion, id_Nivel) {
      apiPruebaFactory.getAsignaturasPorNivel(id_Institucion, id_Nivel).then(function (data) {
          $scope.combo = data.data.trxObject;
      });
  }
  /********** FIN ************************/

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
        let filtro = {};
        apiPruebaFactory.getTodos(filtro).then(function(data) {
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
    }

});
app.controller('evaluacionesController', function ($scope, CONFIG, $http, $location, apiPruebaFactory, i18nService, uiGridConstants, $filter, $timeout) {

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
          { field: 'prueba.id', displayName: 'Identificador', minWidth: 80, width: 110, enableColumnResizing: false },
          { field: 'prueba.descripcion', displayName: 'Descripcin', minWidth: 200, width: 200, enableColumnResizing: false },
          { field: 'prueba.exigencia', displayName: 'Exigencia', minWidth: 90, width: 90, enableColumnResizing: false },
          { field: 'prueba.fecha', displayName: 'Fecha', minWidth: 100, width: 120, enableColumnResizing: false },
          { field: 'prueba.estado', displayName: 'Estado', minWidth: 80, width: 80, enableColumnResizing: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      }
  };

  /**** NUEVO 28/02/2019 ****************/
  $scope.comboCursoInstitucion = function () {
    apiPruebaFactory.getIns().then(function (data) {
        $scope.comboIns = data.data.trxObject;
        //console.log(data);
        $timeout(function() {
              $scope.getComboNiv();
          }, 2000);
    });
  }

  $scope.getComboNiv = function () {
      apiPruebaFactory.getNiv().then(function (data) {
          $scope.cmbNiv = data.data;
      });
  }

  $scope.comboAsignaturaPorNivel = function (id_Institucion, id_Nivel) {
      apiPruebaFactory.getAsignaturasPorNivel(id_Institucion, id_Nivel).then(function (data) {
          $scope.combo = data.data.trxObject;
      });
  }
  /********** FIN ************************/
    $scope.getAll = function(id_Asignatura) {
        let filtro = { "id_Asignatura": id_Asignatura, "estado": "C" };
        apiPruebaFactory.getTodos(filtro).then(function(data) {
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

    $scope.estadisticas = function() {
      $location.url('/misevaluaciones/estadisticas',true);
    }


 $scope.notasAlumnos = [
{ "buena": 58, "mala":	17,	"rut": "174577390",	"nombre": "MARDONES FUENTES ROXANA CECILIA", "ptje": "44,6", "nota": "4,7"},
{ "buena": 48, "mala":	22,	"rut": "176765887",	"nombre": "SOTO ALVEAR FRANCISCO JAVIER", "ptje": "43,6", "nota": "3,7"},
{ "buena": 57, "mala":	23,	"rut": "178540408",	"nombre": "REYES CEA ANTONIETA XIMENA", "ptje": "52,4", "nota": "4,7"},
{ "buena": 60, "mala":	19,	"rut": "173232039",	"nombre": "RAMOS GONZALEZ MARIA FERNANDA", "ptje": "56,2", "nota": "4,8"},
{ "buena": 50, "mala":	21,	"rut": "17641331K",	"nombre": "CALZADILLA RIVERAS JEANNETTE ALEJANDRA", "ptje": "55,0", "nota": "3,8"},
{ "buena": 42, "mala":	16,	"rut": "17040565K",	"nombre": "NAVARRO VALDES CONSTANZA DEL PILAR", "ptje": "45,8", "nota": "3,1"},
{ "buena": 57, "mala":	15,	"rut": "17323290K",	"nombre": "VARGAS DIAZ MONICA PAMELA", "ptje": "38,8", "nota": "4,6"},
{ "buena": 53, "mala":	21,	"rut": "165583434",	"nombre": "ZAPATA JORQUERA MARIA GABRIELA", "ptje": "46,8", "nota": "4,1"},
{ "buena": 53, "mala":	21,	"rut": "178246488",	"nombre": "CASTRO CARREÑO HELEN CONSTANZA", "ptje": "55,0", "nota": "4,1"},
{ "buena": 68, "mala":	11,	"rut": "178865005",	"nombre": "ARELLANO ALCANTARA ANA GABRIEL", "ptje": "48,8", "nota": "5,7"},
{ "buena": 56, "mala":	15,	"rut": "179876531",	"nombre": "RAMIREZ YAÑEZ RAFAEL ZACARIAS", "ptje": "55,0", "nota": "4,5"}
 ];

//Grafico de Frecuencia
  $scope.colorsFrecuencia = ['#803690'];
  $scope.labelsFrecuencia = ['1,5', '2', '2,5', '3', '3,5', '4', '4,5', '5', '5,5', '6', '6,5', '7'];
  $scope.seriesFrecuencia = ['Frecuencia Notas'];
  $scope.dataFrecuencia = [
    [0,0,0,1,1,8,10,5,0,1,0,0]
  ];

//Grafico de Puntajes
$scope.colorsPuntaje = ['#FDB45C'];
$scope.labelsPuntaje = ['6,7','13,3','20','26,7','27,4','40','46,7','53,3','60','66,7','73,3','80'];
$scope.seriesPuntaje = ['Puntajes'];
$scope.dataPuntaje = [ [0,0,0,0,0,2,4,14,5,1,0,0] ];



});
app.factory('apiPruebaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function(filtro)
        {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/find';
            return $http.post(url,filtro);
        },
        getIns: function()
        {
          var datos = {};
          var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
          return $http.post(url,datos);
        },
        getNiv: function()
        {
            var url = CONFIG.APISOSTOS + '/nivel/get';
            return $http.get(url);
        },
        getAsignaturasPorNivel: function( id, id_niv )
        {
            var datos = { "id_Institucion": id, "id_Nivel": id_niv };
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        },
        getAsignaturas: function()
        {
            var datos = {};
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        },
        getTemas: function(id_tema)
        {
            var url = CONFIG.APISOSTOS + '/profesor/tema/find';
            return $http.post(url,{});
        },
        addPruebaAutomatica: function(obj) {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/crear';
            return $http.post(url, obj);

        },
        setVariante: function(id_prueba, num_var)
        {
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/crear';
            return $http.post(url,{ "id_Prueba": id_prueba,"cant_Variante": num_var});
        },
        getPreguntas: function(id_tema)
        {
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/find';
            return $http.post(url,{});
        },
        printPrueba: function(id_variante)
        {
            var url = CONFIG.APISOSTOS + '/pdf/create';
            return $http.post(url,{"id_PruebaVariante": id_variante} ,{ responseType: 'arraybuffer'});
        },
        getPruebaVariante: function(idPrueba)
        {
            var url = CONFIG.APISOSTOS + '/profesor/' + idPrueba + '/pruebavariante/find';
            return $http.post(url,{});
        },
        getVariantes: function(idPrueba)
        {
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/find';
            return $http.post(url,{ "id_Prueba": idPrueba });
        },
        addPruebaManual: function(obj) {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/add';
            return $http.post(url, obj);
        },
        updEstadoPrueba: function(id) {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/upd';
            console.log(id);
            return $http.post(url, { "id": id, "estado": "C"});
        }

    }
});
