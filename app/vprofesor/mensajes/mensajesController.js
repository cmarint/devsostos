app.factory('mensajesFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getAsignatura: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/profesor/asignatura/find',
                data: {}
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }
    }
});

app.controller('mensajesController', function ($scope, CONFIG, mensajesFactory, $filter, $location, $routeParams) {

    $scope.getAsignaturas = function () {
        mensajesFactory.getAsignatura().then(function (data) {
            $scope.listaAsignatura = data.data.trxObject;
        })
    }
    console.log('Mensajes');
});
