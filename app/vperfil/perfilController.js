app.controller('perfilController', ['$scope','CONFIG', 'perfilFactory', '$http', function($scope, CONFIG, perfilFactory, $http)
{

    $scope.getPER = function () {
      perfilFactory.getPer().then(function (data) {
          $scope.data = data.data;
      });
    };

    $scope.updPER = function (usuario) {
      perfilFactory.updPer(usuario).then(function (data) {
          //$scope.data = data.data;
          console.log('Datos Actualizados');
      }).then(function(error) {
          console.log('Error:' + error);
      });
    };

    $scope.updPRE = function (preg1, preg2) {
      perfilFactory.setPreSeg(preg1).then(function (data) {
          //$scope.data = data.data;
          console.log('Datos Actualizados Preg1');
      }).then(function(error) {
          console.log('Error:' + error);
      });

       perfilFactory.setPreSeg(preg2).then(function (data) {
          //$scope.data = data.data;
          console.log('Datos Actualizados Preg2')
      }).then(function(error) {
          console.log('Error:' + error);
      });
    };


    $scope.getPRE = function () {
      perfilFactory.getPreSeg().then(function (data) {
          $scope.mispreg = data.data;
      }).then(function (data) {
          $scope.preg1 = $scope.mispreg[0];
          $scope.preg2 = $scope.mispreg[1];
      });
    };

    $scope.getPREALL = function () {
      perfilFactory.getPregAll().then(function (data) {
          $scope.listapreg = data.data;
      });
    };


}])

app.factory("perfilFactory", ["$http", "$q", "CONFIG","$cookies", function($http, $q, CONFIG, $cookies)
{
	return {
		getPer: function()
		{
            var deferred;
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: false,
                url: CONFIG.APISOSTOS +'/usuario/get/1',
                headers: {'Content-Type': 'application/json'}
            })
            .then(function(res)
            {
                deferred.resolve(res);
            })
            .then(function(error)
            {
                deferred.reject(error);
            })
            return deferred.promise;
		},
        updPer: function(user)
		{
            var deferred;
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: false,
                url: CONFIG.APISOSTOS +'/usuario/act',
                data: user,
                headers: {'Content-Type': 'application/json'}
            })
            .then(function(res)
            {
                deferred.resolve(res);
            })
            .then(function(error)
            {
                deferred.reject(error);
            })
            return deferred.promise;
		},
        getPregAll: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/preguntaseguridad/get'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getPreSeg: function()
		{
            var deferred;
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS +'/usuario_preguntaseguridad/get',
                headers: {'Content-Type': 'application/json'}
            })
            .then(function(res)
            {
                deferred.resolve(res);
            })
            .then(function(error)
            {
                deferred.reject(error);
            })
            return deferred.promise;
		},
        setPreSeg: function(obj)
		{
            var deferred;
            var msg = {
                    "estado": "",
                    "respuesta": obj.resp,
                    "id_Usuario": 0,
                    "id_PreguntaSeguridad": obj.id_PreguntaSeguridad
                }
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS +'/usuario_preguntaseguridad/upd',
                headers: {'Content-Type': 'application/json'},
                data: msg
            })
            .then(function(res)
            {
                deferred.resolve(res);
            })
            .then(function(error)
            {
                deferred.reject(error);
            })
            return deferred.promise;
		}

	}
}]);
