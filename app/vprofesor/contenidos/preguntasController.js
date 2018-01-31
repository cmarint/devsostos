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

app.controller('preguntasController', function ($scope, CONFIG, apiTemaFactory, $filter, $location, $routeParams, $timeout) {

  $scope.idPadre = $routeParams.idpadre;
  $scope.idTema = $routeParams.idtema;
  $scope.muestraTema = false;

  $scope.getTemaById = function (id) {
      apiTemaFactory.getTema(id).then(function (data) {
          //console.log(data.data.trxObject[0]);
          //$scope.registroEdit = data.data.trxObject;
          $scope.nombreTema = data.data.trxObject[0].nombre;
      })
  }

  $scope.getCombosTema = function () {
      apiTemaFactory.getTema(null).then(function (data) {
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



