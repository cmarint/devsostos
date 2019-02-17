app.factory("fileReader", function($q, $log) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onError = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.reject(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast("fileProgress", {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);
    return reader;
  };

  var readAsDataURL = function(file, scope) {
    var deferred = $q.defer();

    var reader = getReader(deferred, scope);
    reader.readAsDataURL(file);

    return deferred.promise;
  };

  return {
    readAsDataUrl: readAsDataURL
  };
});

app.factory('apiPreguntaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTema: function(id)
        {
            var obj;
            if (id == null) { obj={}; } else { obj={ "id": id}; }

            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
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
        addPreguntaRespuestas: function(id_tema, obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/preguntasrespuestas/add';
            return $http.post(url,obj);
        },
        delPreguntaRespuestas: function(id_tema, obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/preguntasrespuestas/del';
            return $http.post(url,obj);
        },
        updPreguntaRespuestas: function(id_tema, obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/' + id_tema + '/preguntasrespuestas/upd';
            return $http.post(url,obj);
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

app.controller('preguntasController', function ($scope, CONFIG, apiPreguntaFactory, fileReader,$filter, $location, $routeParams, $timeout) {

  $scope.idPadre = $routeParams.idpadre;
  $scope.idTema = $routeParams.idtema;
  $scope.muestraTema = false;

  $scope.imageSrc = "";

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = progress.loaded / progress.total;
  });


  $scope.getTemaById = function (id) {
      apiPreguntaFactory.getTema(id).then(function (data) {
          //console.log(data.data.trxObject[0]);
          //$scope.registroEdit = data.data.trxObject;
          $scope.nombreTema = data.data.trxObject[0].nombre;
      })
  }

  $scope.getCombosTema = function () {
      apiPreguntaFactory.getTema(null).then(function (data) {
          $scope.comboTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: null});
          $scope.comboSubTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: ''});;
      });
  }



  $scope.preguntasPage = function(idPadre, id, nombre) {
          $location.path('/miscontenidos/preguntas/' + idPadre + '/' + id,true);
  }



  $scope.getPreguntas = function() {
          $scope.muestraTema = true;
              $scope.temaActual = $scope.idTema;
              //apiTemaFactory.getPreguntas($scope.idTema).then(function (data) {
              apiPreguntaFactory.getPreguntasRespuestas($scope.idTema, null).then(function (data) {
                $scope.preguntaList = data.data.trxObject;
                  $scope.getTemaById($scope.idTema);
                }).then(function (data) {
                  //limpio Archivo
                  $scope.datos.pregunta.adjunto_Pregunta = "";
                  document.getElementById("imagen").src = '';
                  //fin
                  $scope.datos = { "pregunta":
                                  { "tipo_Pregunta": "SM", "adjunto_Pregunta": "" },
                                  "respuestas": [
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" }]
                                 };
                  $scope.datos.pregunta.id_Categoria = 1;

                    //console.log($scope.datos);
                  //$scope.getTemaById($scope.idTema);
              })

  }


    $scope.tipoPregunta = function () {
        if ($scope.datos.pregunta.tipo_Pregunta == 'SM') {
            $scope.datos = { "pregunta":
                                  { "tipo_Pregunta": "SM", "adjunto_Pregunta": "" },
                                  "respuestas": [
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "", "correcta_Respuesta": "N" }]
                                 };
            $scope.datos.pregunta.id_Categoria = 1;
        } else {
           $scope.datos = { "pregunta":
                                  { "tipo_Pregunta": "VF", "adjunto_Pregunta": "" },
                                  "respuestas": [
                                      { "descripcion_Respuesta": "Verdadero", "correcta_Respuesta": "N" },
                                      { "descripcion_Respuesta": "Falso", "correcta_Respuesta": "N" }
                                    ]
                                 };
            $scope.datos.pregunta.id_Categoria = 1;
        }
    }


    $scope.getComboCategoria = function () {
      apiPreguntaFactory.getCategorias().then(function (data) {
          $scope.comboCategoria = data.data;
          //console.log(data);
      });
   }

    $scope.addPreguntaRespuestas = function (obj) {
        var arreglo = [];
        arreglo.push(obj);
        apiPreguntaFactory.addPreguntaRespuestas($scope.idTema ,arreglo).then(function (data) {
            $scope.getPreguntas();
        })
    }

    $scope.delPreguntaRespuestas = function (obj) {
        var arreglo = [];
        var respuestas = [];
        angular.forEach(obj.respuestas, function (value, key) {
                respuestas.push({ "id_Respuesta": value.id_Respuesta });
        })
        arreglo.push( { "pregunta": { "id_Pregunta": obj.pregunta.id_Pregunta }, "respuestas": respuestas} );
        //console.log(arreglo);


        apiPreguntaFactory.delPreguntaRespuestas($scope.idTema ,arreglo).then(function (data) {
            $scope.getPreguntas();
        })
    }

    $scope.editTemporal = function (obj) {
        $scope.editar = obj;
    }

    $scope.updPreguntaRespuestas = function (obj) {
        var arreglo = [];
        arreglo.push(obj);
        apiPreguntaFactory.updPreguntaRespuestas($scope.idTema ,arreglo).then(function (data) {
            $scope.getPreguntas();
        })

    }


   $scope.updateSelection = function(position, itens) {
       $scope.tieneCorrecta = false;
        angular.forEach(itens, function(subscription, index) {
            if (position != index)
            {
                subscription.correcta_Respuesta = 'N';
            }

            if (subscription.correcta_Respuesta == 'S'){
                $scope.tieneCorrecta = true;
            }
        });
    }

});



////////////

var app = angular.module('plunkr', [])
  app.controller('UploadController', function($scope, fileReader) {

  });
