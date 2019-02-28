app.factory('ApiAyudaFactory', function($http, $q, CONFIG, $cookies){
    return {
        getTodos: function()
        {
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/usuario/getAllPreguntaFrecuente'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }
    }
});




app.controller('ayudaController', function ($scope, CONFIG, ApiAyudaFactory) {



  $scope.getFaqs = function () {
    ApiAyudaFactory.getTodos().then(function (data) {
          $scope.datos = data.data;
      }).then(function (data) {
           //$scope.getCombo();
      });
  }


});
