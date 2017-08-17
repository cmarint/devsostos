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
          console.log('Datos Actualizados')
      }).then(function(error) {
          console.log('Error:' + error);
      });
    };


}])

app.factory("perfilFactory", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
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
		}
	}
}]);
