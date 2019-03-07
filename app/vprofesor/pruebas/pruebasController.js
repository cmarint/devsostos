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

    $scope.evaluar = function() {
      $location.url('/evaluar',true);
    }

    $scope.getNotasAlumnos = function (id, tipo) {
      var filtro = null;
      if (tipo === "P") { // Caso de uso Prueba
        filtro = { "id_Prueba": id };
        apiPruebaFactory.getNotasAlumnosPrueba(filtro).then(function(data) {
          $scope.notasAlumnos = data.data.trxObject;
        });
      } else { //Caso de Uso Variante
        filtro = { "id_PruebaVariante": id};
        apiPruebaFactory.getNotasAlumnosVariante(filtro).then(function(data) {
          $scope.notasAlumnos = data.data.trxObject;
        });
      }
     }

$scope.getFrecuenciaNotasPruebaVariante = function (id, tipo) {
  var filtro = null;
  var valores = [];
  //Grafico de Frecuencia
  $scope.labelsFrecuencia = [];
  $scope.dataFrecuencia = [];
  if (tipo === "P") { // Caso de uso Prueba
    filtro = { "id_Prueba": id };
    apiPruebaFactory.getFrecuenciaNotasPrueba(filtro).then(function(data) {
      $scope.reg = data.data.trxObject;
      for (var i=0; i < $scope.reg.length; i++) {
        $scope.labelsFrecuencia.push($scope.reg[i].nota.toString());
        valores.push($scope.reg[0].cantidad);
      }
      $scope.colorsFrecuencia = ['#803690'];
      $scope.seriesFrecuencia = ['Frecuencia Notas'];
      $scope.dataFrecuencia.push(valores);
    });
  } else { //Caso de Uso Variante
    filtro = { "id_PruebaVariante": id};
    apiPruebaFactory.getFrecuenciaNotasPruebaVariante(filtro).then(function(data) {
      $scope.reg = data.data.trxObject;
      for (var i=0; i < $scope.reg.length; i++) {
        $scope.labelsFrecuencia.push($scope.reg[i].nota.toString());
        valores.push($scope.reg[0].cantidad);
      }
      $scope.colorsFrecuencia = ['#803690'];
      //$scope.labelsFrecuencia = ['1,5', '2', '2,5', '3', '3,5', '4', '4,5', '5', '5,5', '6', '6,5', '7'];
      $scope.seriesFrecuencia = ['Frecuencia Notas'];
      //$scope.dataFrecuencia = [[0,0,0,1,1,8,10,5,0,1,0,0]];
      $scope.dataFrecuencia.push(valores);
      console.log($scope.dataFrecuencia);
    });
  }
 }

$scope.getFrecuenciaPuntajesPruebaVariante = function (id, tipo) {
   var filtro = null;
   var valores = [];
   //Grafico de Frecuencia
   $scope.labelsPuntaje = [];
   $scope.dataPuntaje = [];
   $scope.colorsPuntaje = ['#FDB45C'];
   $scope.seriesPuntaje = ['Puntajes'];
   if (tipo === "P") {
     filtro = { "id_Prueba": id };
     apiPruebaFactory.getFrecuenciaPuntajePrueba(filtro).then(function(data) {
       $scope.regp = data.data.trxObject;
       for (var i=0; i < $scope.regp.length; i++) {
         $scope.labelsPuntaje.push($scope.regp[i].puntaje.toString());
         valores.push($scope.regp[0].cantidad);
       }
       $scope.dataPuntaje.push(valores);
     });
   } else {
     filtro = { "id_PruebaVariante": id};
     apiPruebaFactory.getFrecuenciaPuntajePruebaVariante(filtro).then(function(data) {
       $scope.regp = data.data.trxObject;
       for (var i=0; i < $scope.regp.length; i++) {
         $scope.labelsPuntaje.push($scope.regp[i].puntaje.toString());
         valores.push($scope.regp[0].cantidad);
       }
       //$scope.labelsFrecuencia = ['1,5', '2', '2,5', '3', '3,5', '4', '4,5', '5', '5,5', '6', '6,5', '7'];
       //$scope.dataFrecuencia = [[0,0,0,1,1,8,10,5,0,1,0,0]];
       $scope.dataPuntaje.push(valores);
     });
   }
 }



});
app.factory('apiPruebaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getFrecuenciaNotasPrueba: function (filtro) {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/frecuencianotas/find'
            return $http.post(url, filtro);
        },
        getFrecuenciaNotasPruebaVariante: function (filtro) {
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/frecuencianotas/find'
            return $http.post(url, filtro);
        },
        getFrecuenciaPuntajePrueba: function (filtro) {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/frecuenciapuntajes/find'
            return $http.post(url, filtro);
        },
        getFrecuenciaPuntajePruebaVariante: function (filtro) {
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/frecuenciapuntajes/find'
            return $http.post(url, filtro);
        },
        getNotasAlumnosPrueba: function (filtro) {
            var url = CONFIG.APISOSTOS + '/profesor/prueba/notasalumnos/find'
            return $http.post(url, filtro);
        },
        getNotasAlumnosPruebaVariante: function (filtro) {
            var url = CONFIG.APISOSTOS + '/profesor/pruebavariante/notasalumnos/find'
            return $http.post(url, filtro);
        },
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
