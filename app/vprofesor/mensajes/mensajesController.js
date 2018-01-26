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
        },
        getMisAlumnos: function(id)
        {
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/find';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.post(url,{});
        },
        sendMail: function(obj)
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/mail/send',
                data: obj
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

    $scope.getAlumnos = function (id) {
        mensajesFactory.getMisAlumnos(id).then(function (data) {
            $scope.alumnos = data.data.trxObject;
        })
    }

    $scope.getAsignaturas = function () {
        mensajesFactory.getAsignatura().then(function (data) {
            $scope.combo = data.data.trxObject;
        })
    }

    $scope.sendMail = function (obj) {
                    var listadist = '';
                    angular.forEach($scope.alumnos, function (value, key) {
                             listadist = listadist + value.email + ","
                    })
        var test = { "toEmail": listadist, "subject": "[SOSTOS] - Informacion Importante", "body": obj.mensaje};
        mensajesFactory.sendMail(test).then(function (data) {
           console.log('Proband mail');
        })
    }
});
