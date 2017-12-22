app.factory('inicioFactory', function ($http, CONFIG) {
    var url = CONFIG.PAYSOSTOS;
    return {
        pay: function (tbkData,token) {
        	 $http.defaults.headers.common.Authorization = token;

            return $http.post(url + '/connectOneClick', tbkData);
        },
        processpay: function (tbkToken,token) {
        	 $http.defaults.headers.common.Authorization  = token;
            return $http.get(url + '/resultOneClick/'+tbkToken, { loader: 'loader' });
        }
    };
});

app.controller('suscripcionController', function ($scope, CONFIG, $http, $location, $interval, inicioFactory, $cookies) {
        var oInicio = this;

    oInicio.Fact = inicioFactory;

    ////PayTBK
    $scope.PayTBK = function (tbkData) {
        //$cookies.put('tokenSosto',oInicio.token);
        var token = 'Bearer ' + $cookies.get('sostos.tkn');
         console.log('datos:' + angular.toJson(tbkData) + '|' + 'token:' + token);
        oInicio.Fact.pay(angular.toJson(tbkData),token).then(function (data) {

        	redirectPost(data.url,data.token);

        })
        .catch(function (data) {
            console.log(data.ExceptionMessage);

        });
    }

    oInicio.processForm = function(data) {
   	 $http({
         method  : 'POST',
         url     : data.url,
         data    : 'TBK_TOKEN='+data.token,  // pass in data as strings
         headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
     }).then(function(response){
         //successfully posted data
         $location.path('/');
     }, function(response){
         //error has occurred
     })
    };

    function redirectPost(url, data) {
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = url;

            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'TBK_TOKEN';
            input.value = data;
            form.appendChild(input);

        form.submit();
    }

    oInicio.ProcessPayTBK = function (token) {

    	  //var tokensosto = $cookies.get('tokenSosto');
        var tokensosto = $cookies.get('sostos.tkn');
    	 oInicio.Fact.processpay(token,tokensosto).success(function (data) {

             //window.location.href = data.urlRedirection+"?token_ws="+token;

         })
         .error(function (data) {
             oInicio.error = data.ExceptionMessage;

         });


       // $interval(callReturnUrlTBK(urlTBK), 5000,1);

    }

    ///

    function callReturnUrlTBK(urlTBK) {
        window.location.href = urlTBK;
    }

   console.log('Entro a Suscripcion');

});
