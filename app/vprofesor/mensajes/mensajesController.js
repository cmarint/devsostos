app.factory('mensajesFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getIns: function()
        {
            var url = CONFIG.APISOSTOS + '/institucion/get';
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            return $http.get(url);
        },
        getNiv: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            var url = CONFIG.APISOSTOS + '/nivel/get';
            return $http.get(url);
        },
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

    $scope.comboCursoInstitucion = function () {
      mensajesFactory.getIns().then(function (data) {
          $scope.comboIns = data.data;
          //console.log(data);
          $timeout(function() {
                $scope.getComboNiv();
            }, 2000);
      });
    }

    $scope.getComboNiv = function () {
        mensajesFactory.getNiv().then(function (data) {
            $scope.cmbNiv = data.data;
        });
    }

    $scope.comboAsignatura = function (id_Institucion, id_Nivel) {
        mensajesFactory.getAsignaturas(id_Institucion, id_Nivel).then(function (data) {
            $scope.combo = data.data.trxObject;
        });
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
