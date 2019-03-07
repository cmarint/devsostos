app.factory('evaluacionesFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        evaluar: function(obj)
        {
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/revisor/check',
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

app.controller('evaluacionesController', function ($scope, CONFIG, evaluacionesFactory, $filter, $location, $routeParams,$rootScope, $http) {
  $scope.documento = null;

  $scope.evaluar = function (base64) {
      var obj = { "idForma": "1", "prueba": base64};
      evaluacionesFactory.evaluar(obj).then(function (data){
          console.log(data);
      })
      //console.log(base64);
  }

  $scope.onChange = function (e, fileList) {
    alert('this is on-change handler!');
  };

  $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
    //alert('this is handler for file reader onload event!');
      $scope.documento = file;
  };

  var uploadedCount = 0;

  $scope.files = [];
});
