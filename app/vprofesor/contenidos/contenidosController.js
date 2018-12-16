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
        getEjesCon: function(id_Tema_Padre)
        {

            if (id_Tema_Padre == null) { obj={}; } else { obj={ "id_Tema_Padre": id_Tema_Padre}; }

            /*$http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/tema/find';
            return $http.post(url, obj);*/
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

  $scope.filtrarSubtemas = function(id) {
    $scope.hijos = $filter('filter')($scope.comboSubTemas,{id_Tema_Padre: id})
  }

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
          //console.log(data.data.trxObject[0]);
          $scope.registroEdit = data.data.trxObject[0];
          $scope.nombreTema = data.data.trxObject[0].nombre;
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

  $scope.delTEM = function(id){
          apiTemaFactory.delTem(id).then(function (data){
            if (data.data.detailsResponse.code != 0) {
              alert('Existe un error al eliminar, contacte al Administrador');
            } else {
              $scope.getAll();
            }

          });
  }

  $scope.delCON = function(){
          apiTemaFactory.delTem($scope.id_del).then(function (data){
            if (data.data.detailsResponse.code != 0) {
              alert('Existe un error al eliminar, contacte al Administrador');
            } else {
              $scope.getEjeCon($scope.ejeTematico);
            }

          });
  }

  $scope.updTEM = function(registro){
      apiTemaFactory.setTem(registro).then(function (data) {
         if (data.data.detailsResponse.code == "00") {
              alert('Registro Editado Correctamente');
              setTimeout(function(){
                 $scope.arbolito = '';
                 $scope.getAll();
                 $scope.$digest();
              }, 1000)

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
              setTimeout(function(){
                 $scope.arbolito = '';
                 $scope.getAll();
                 $scope.$digest();
              }, 1000)
          } else {
              alert('Error al agregar registro');
          }

      })
  }

  $scope.getEjeCon = function(id_Tema_Padre) {
    apiTemaFactory.getEjesCon(id_Tema_Padre).then(function (data) {
      //console.log(data);
      $scope.contenidos = data.data.trxObject;
    })
  }

  $scope.addCON = function(registro){
      let obj = { "id_Tema_Padre": $scope.ejeTematico, "nombre": registro.nombre };
      apiTemaFactory.addTem(obj).then(function (data) {
          if (data.data.detailsResponse.code == "00") {
              $scope.getEjeCon($scope.ejeTematico);
          } else {
              alert('Error al agregar registro');
          }

      })
  }

  $scope.selSubitem = function (id) {
    $scope.ejeTematico = id;
    $scope.getEjeCon(id);

  }


  $scope.preguntasPage = function(idPadre, id, nombre) {
          $location.path('/miscontenidos/preguntas/' + idPadre + '/' + id,true);
  }



  $scope.getPreguntas = function() {
          $scope.muestraTema = true;
              $scope.temaActual = $scope.idTema;
              //apiTemaFactory.getPreguntas($scope.idTema).then(function (data) {
              apiTemaFactory.getPreguntasRespuestas($scope.idTema, null).then(function (data) {
                $scope.preguntaList = data.data.trxObject;
                  $scope.getTemaById($scope.idTema);
                }).then(function (data) {
                  //$scope.getTemaById($scope.idTema);
              })

  }




    $scope.getComboCategoria = function () {
      apiTemaFactory.getCategorias().then(function (data) {
          $scope.comboCategoria = data.data;
          //console.log(data);
      });
   }

});
