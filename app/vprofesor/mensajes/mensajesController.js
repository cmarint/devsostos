
app.controller('mensajesController', function ($scope, CONFIG, mensajesFactory, $filter, $location, $routeParams, $timeout) {

    $scope.getAlumnos = function (id) {
        mensajesFactory.getMisAlumnos(id).then(function (data) {
            $scope.alumnos = data.data.trxObject;
        })
    }

    $scope.comboCursoInstitucion = function () {
      mensajesFactory.getIns().then(function (data) {
          $scope.comboIns = data.data.trxObject;
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

app.factory('mensajesFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getIns: function()
        {
          var datos = {};
          var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
          return $http.post(url,datos);
        },
        getNiv: function()
        {
            var url = CONFIG.APISOSTOS + '/nivel/get';
            return $http.get(url);
        },
        getAsignaturas: function( id, id_niv )
        {
            var datos = { "id_Institucion": id, "id_Nivel": id_niv };
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/find';
            return $http.post(url,datos);
        },
        getMisAlumnos: function(id)
        {
            var url = CONFIG.APISOSTOS + '/profesor/asignatura/' + id + '/alumno/find';
            return $http.post(url,{});
        },
        sendMail: function(obj)
        {
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
