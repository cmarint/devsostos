app.factory('apiTemaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/find';
            return $http.post(url,{});
        },
        getPruebas: function(id_tema)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/find';
            return $http.post(url,{});
        },
        setTem: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/tema/upd',
                data: regjson,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        addTem: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/tema/add',
                data: regjson
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        delTem: function(id)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(id);
            deferred = $q.defer();
            $http({
                method: 'GET',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/tema/del/' + id
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('contenidosController', function ($scope, CONFIG, apiTemaFactory, $filter, $location) {


  $scope.getAll = function () {
      apiTemaFactory.getTodos().then(function (data) {
          var parentId = "";

          $scope.comboTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: null});
          $scope.comboSubTemas = data.data.trxObject;
          var datos = data.data.trxObject;
          var datos2 = data.data.trxObject;
          var arbol = [];
          angular.forEach(datos, function (value, key) {
                if (value.id_Tema_Padre == null) {
                    //console.log('Padre Id' + value.id);
                    parentId = value.id;
                    parentName = value.nombre;

                    var hijos = [];
                    angular.forEach(datos2, function (value, key) {
                         if (angular.equals(value.id_Tema_Padre, parentId)) {
                            hijos.push({id: value.id, nombre: value.nombre});
                            //console.log('Id' + value.id + ' Hijo de' + value.id_Tema_Padre);
                         }
                    })
                    arbol.push({id: parentId, nombre: parentName, hijos: hijos});
                }

          });
          //console.log(arbol);
          $scope.arbolito = arbol;

      }).then(function (data) {
           //$scope.getCombo();
      });
  };

//Institución
  $scope.getCombo = function () {
      apiTemaFactory.getIns().then(function (data) {
          $scope.combo = data.data;
      });
  }

//Nivel
  $scope.getComboNivel = function () {
      apiTemaFactory.getNiv().then(function (data) {
          $scope.comboNiv = data.data;
      });
  }

  $scope.getCombosTema = function () {
      apiTemaFactory.getTodos().then(function (data) {
          $scope.comboTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: null});
          $scope.comboSubTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: ''});;
      });
  }


  $scope.editTEM = function(){
      var registro = $scope.gridApi.selection.getSelectedRows();
      //$scope.getCombo();
      if (registro != '') {
          $scope.registroEdit = registro[0];
          $scope.getComboNivel();
      }
  }

  $scope.delTMP = function(id) {
    $scope.id_del = id;
  }

  $scope.delTEM = function(){
          apiTemaFactory.delTem($scope.id_del).then(function (data){
              $scope.getAll();
          });
  }

  $scope.updTEM = function(registro){
      apiTemaFactory.setTem(registro).then(function (data) {
        //borro
        $scope.gridOptions.data = [];
      }).then(function (data) {
        apiTemaFactory.getTodos().then(function (data) {
            $scope.gridOptions.data = data.data;
        })
      })
  }

  $scope.addTEM = function(registro){
      apiTemaFactory.addTem(registro).then(function (data) {
          $scope.getAll();
      })
  }

  $scope.preguntasPage = function() {
      $location.path('/miscontenidos/preguntas',true);
  }

  $scope.listado = [
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
  $scope.listadoR = [
        {
            "id": 1,
            "estado": "A",
            "id_Pregunta": 1,
            "descripcion": "Respuesta a Pregunta 1",
            "correcta": "S"
        },
        {
            "id": 2,
            "estado": "A",
            "id_Pregunta": 1,
            "descripcion": "Respuesta B a Pregunta 1",
            "correcta": "N"
        },
      {
            "id": 3,
            "estado": "A",
            "id_Pregunta": 2,
            "descripcion": "Respuesta a Pregunta 1",
            "correcta": "N"
        },
        {
            "id": 4,
            "estado": "A",
            "id_Pregunta": 2,
            "descripcion": "Respuesta B a Pregunta 1",
            "correcta": "N"
        },
        {
            "id": 5,
            "estado": "A",
            "id_Pregunta": 2,
            "descripcion": "Respuesta c a Pregunta 1",
            "correcta": "S"
        },
        {
            "id": 6,
            "estado": "A",
            "id_Pregunta": 2,
            "descripcion": "Respuesta d a Pregunta 1",
            "correcta": "N"
        }
    ];
  $scope.getPreguntas = function(id_tema) {
        if (id_tema != null)
        {
              $scope.temaActual = id_tema;
              apiTemaFactory.getPruebas(id_tema).then(function (data) {
                //$scope.preguntaList = data.data.trxObject;

            })
        }
      $scope.preguntaList = $scope.listado;

  }

   $scope.getRespuesta = function(id_pregunta) {
        if (id_pregunta != null)
        {
                  $scope.preguntaActual = id_pregunta;
                  $scope.listadoRespuesta = $filter('filter')($scope.listadoR,{id_Pregunta: id_pregunta});
                //$scope.preguntaList = data.data.trxObject;

        }

  }

  $scope.addPregunta = function() {
                if (($scope.preguntaList) && ($scope.preguntaList.length > 0)) {

                    $scope.preguntaList.push({
                        "id": null,
                        "id_Tema": 4,
                        "estado": "A",
                        "descripcion": ""
                    })
                } else {
                    $scope.preguntaList = [{
                        "id": null,
                        "id_Tema": 4,
                        "estado": "A",
                        "descripcion": ""
                    }];
                }
      //$scope.preguntaList = data.data.trxObject;

  }

  $scope.addRespuesta = function() {
                if (($scope.listadoRespuesta) && ($scope.listadoRespuesta.length > 0)) {

                    $scope.listadoRespuesta.push({
                    "id": null,
                    "estado": "A",
                    "id_Pregunta": null,
                    "descripcion": "",
                    "correcta": "N"
                    })
                } else {
                    $scope.listadoRespuesta = [{
                    "id": null,
                    "estado": "A",
                    "id_Pregunta": null,
                    "descripcion": "",
                    "correcta": "N"
                    }];
                }
      //$scope.preguntaList = data.data.trxObject;

  }

  $scope.grabaPregunta = function(registro) {
      var log = [];
      angular.forEach($scope.preguntaList, function(value, key) {
        this.push({ "id": value.id, "descripcion": value.descripcion });
      }, log);
      console.log(log);
  }



});



