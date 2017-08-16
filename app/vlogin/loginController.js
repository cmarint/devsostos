app.controller('loginController', ['$scope','CONFIG', 'authFactory', 'jwtHelper', 'store', '$location','$rootScope', '$http', function($scope, CONFIG, authFactory, jwtHelper, store, $location,$rootScope, $http)
{
    $rootScope.isUserLoggedIn = false;
	  $scope.login = function(user)
    {
        authFactory.login(user).then(function(res)
        {
            if(res.data && res.data.token != '')
            {
                $rootScope.isUserLoggedIn = true;
                store.set('token', res.data.token);
                $location.path("/home");
            }
            else
            {
                $scope.error = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Error!</strong> Usuario o Contraseña Inválidos.</div>';
            }
        });
    }
}])

app.factory("authFactory", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
{
	return {
		login: function(user)
		{
            var deferred;
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS +'/token/get',
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
