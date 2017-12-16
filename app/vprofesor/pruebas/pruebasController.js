/*app.factory('apiPruebaFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/profesor/prueba/find';
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

app.controller('contenidosController', function ($scope, CONFIG, apiPruebaFactory, $filter) {


  $scope.getAll = function () {
      apiPruebaFactory.getTodos().then(function (data) {
          var parentId = "";

          $scope.comboTemas = $filter('filter')(data.data.trxObject,{id_Tema_Padre: null});
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
      apiPruebaFactory.getIns().then(function (data) {
          $scope.combo = data.data;
      });
  }

//Nivel
  $scope.getComboNivel = function () {
      apiPruebaFactory.getNiv().then(function (data) {
          $scope.comboNiv = data.data;
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
          apiPruebaFactory.delTem($scope.id_del).then(function (data){
              $scope.getAll();
          });
  }

  $scope.updTEM = function(registro){
      apiPruebaFactory.setTem(registro).then(function (data) {
        //borro
        $scope.gridOptions.data = [];
      }).then(function (data) {
        apiPruebaFactory.getTodos().then(function (data) {
            $scope.gridOptions.data = data.data;
        })
      })
  }

  $scope.addTEM = function(registro){
      apiPruebaFactory.addTem(registro).then(function (data) {
          $scope.getAll();
      })
  }


});
*/



