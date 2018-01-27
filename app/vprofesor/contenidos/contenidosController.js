app.factory('apiTemaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTema: function(id)
        {
            var obj;
            if (id == null) { obj={}; } else { obj={ "id": id}; }

            /*$http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/find';
            return $http.post(url, obj);*/
             deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/tema/find',
                data: obj,
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getPreguntas: function(id_tema)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/find';
            return $http.post(url,{});
        },
        getPreguntasRespuestas: function(id_tema, id)
        {
            var obj = {};
            if (id != null) {
                obj = { "id": id };
            }
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/preguntasrespuestas/find';
            return $http.post(url, obj);
        },
        addPregunta: function(id_tema, obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/add';
            return $http.post(url,obj);
        },
        delPregunta: function(id_tema, obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/del/' + obj.id;
            return $http.get(url,obj);
        },
        updPregunta: function(id_tema, obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/pregunta/upd';
            return $http.post(url,obj);
        },
        setTem: function(registro)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var regjson = angular.toJson(registro);
            deferred = $q.defer();
            $http({
                method: 'POST',
                //skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/tema/upd',
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
        },
         getCategorias: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/categoria/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

    }
});

app.controller('contenidosController', function ($scope, CONFIG, apiTemaFactory, $filter, $location, $routeParams, $timeout) {

  $scope.idPadre = $routeParams.idpadre;
  $scope.idTema = $routeParams.idtema;
  $scope.muestraTema = false;

  $scope.getAll = function () {
      apiTemaFactory.getTema(null).then(function (data) {
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

  $scope.getTemaById = function (id) {
      apiTemaFactory.getTema(id).then(function (data) {
          $scope.registroEdit = data.data.trxObject;
          $scope.nombreTema = data.data.trxObject.nombre;
      })
  }

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
      apiTemaFactory.getTema(null).then(function (data) {
          $scope.comboTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: null});
          $scope.comboSubTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: ''});;
      });
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
         if (data.data.detailsResponse.code == "00") {
              alert('Registro Editado Correctamente');
              $scope.getAll();
          } else {
              alert('Error al editar registro');
          }
      }).then(function (data) {
        //
      })
  }

  $scope.addTEM = function(registro){
      apiTemaFactory.addTem(registro).then(function (data) {
          if (data.data.detailsResponse.code == "00") {
              alert('Registro Agregado Correctamente');
              $scope.getAll();
          } else {
              alert('Error al agregar registro');
          }

      })
  }

  $scope.preguntasPage = function(idPadre, id) {
      if (id == null) {
          $location.path('/miscontenidos/preguntas',true);
      } else {
          $location.path('/miscontenidos/preguntas/' + idPadre + '/' + id,true);
      }

  }

  $scope.preguntasPage = function(idPadre, id) {
      if (id == null) {
          $location.path('/miscontenidos/preguntas',true);
      } else {
          $location.path('/miscontenidos/preguntas/' + idPadre + '/' + id,true);
      }

  }



  $scope.getPreguntas = function(id_tema) {
      if (id_tema != null) {
          $scope.temaActual = id_tema;
              //apiTemaFactory.getPreguntas(id_tema).then(function (data) {
            apiTemaFactory.getPreguntasRespuestas(id_tema, null).then(function (data) {
                $scope.preguntaList = data.data.trxObject;
            })
           $scope.idTema = null;
           $scope.idPadre = null;
           $scope.nombreTema = null;
      } else {
          $scope.muestraTema = true;
          if ($scope.idTema != null) {
              $scope.temaActual = $scope.idTema;
              //apiTemaFactory.getPreguntas($scope.idTema).then(function (data) {
              apiTemaFactory.getPreguntasRespuestas($scope.idTema, null).then(function (data) {
                $scope.preguntaList = data.data.trxObject;
                }).then(function (data) {
                  $scope.getTemaById($scope.idTema);
              })


          }

      }



    //$scope.preguntaList = $scope.listado;
  }

   $scope.getRespuesta = function(id_pregunta) {
        if (id_pregunta != null)
        {
                  $scope.preguntaActual = id_pregunta;
                  $scope.listadoRespuesta = $filter('filter')($scope.listadoR,{id_Pregunta: id_pregunta});

        }

  }

  $scope.addPregunta = function() {

                if (($scope.preguntaListNew) && ($scope.preguntaListNew.length > 0)) {

                    $scope.preguntaListNew.push({
                        "id": null,
                        "id_Tema": $scope.temaActual,
                        "estado": "A",
                        "descripcion": null
                    })
                } else {
                    $scope.preguntaListNew = [{
                        "id": null,
                        "id_Tema": $scope.temaActual,
                        "estado": "A",
                        "descripcion": null
                    }];
                }
      //$scope.preguntaList = data.data.trxObject;

  }

  $scope.delPregunta = function(id) {
      apiTemaFactory.delPregunta($scope.temaActual, {"id": id}).then(function (data) {
          $scope.getPreguntas(null);
      })
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

  $scope.updPregunta = function(obj) {
      apiTemaFactory.updPregunta($scope.idTema, obj).then(function (data) {
            console.log('UPD: ' + data);
        })
  }

  $scope.grabaPregunta = function() {
      var log = [];
      var logn = [];
     /* var cont = 0;
      angular.forEach($scope.preguntaList, function(value, key) {
          if (cont < 4) {
              apiTemaFactory.updPregunta(value.id_Tema, { "id": value.id, "descripcion": value.descripcion, "estado": value.estado }).then(function (data) {
              console.log('UPD: ' + data);
              })
          }

          cont++;
      })*/

      //Preguntas nuevas
      angular.forEach($scope.preguntaListNew, function(value, key) {
           $timeout( function(){
             apiTemaFactory.addPregunta(value.id_Tema, { "descripcion": value.descripcion, "estado": value.estado } ).then(function (data) {

          })
        }, 1000 );

      })
      $timeout( function(){
            $scope.getPreguntas(null);
        }, 2000 );

  }

    $scope.addPReguntaSola = function (obj)
    {
        apiTemaFactory.addPregunta($scope.idTema, obj ).then(function (data) {
               $scope.getPreguntas(null);
          })
    }

    $scope.getComboCategoria = function () {
      apiTemaFactory.getCategorias().then(function (data) {
          $scope.comboCategoria = data.data;
          //console.log(data);
      });
   }

});



