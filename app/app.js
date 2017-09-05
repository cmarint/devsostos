var app = angular.module('appSostos', ['ngRoute','ngSanitize','angular-jwt', 'angular-storage','xlsx-model','ngTouch','ui.grid','ui.grid.selection','ui.grid.pagination','ui.grid.cellNav','ngCookies']);

app.constant('CONFIG', {
    APISOSTOS: "http://168.232.165.85:8080/sostos_frontend_api",
    SOSTOSWEBURL: "http://168.232.165.85/sostosweb/"
})

app.run(['$rootScope','jwtHelper', 'store', '$location','$routeParams','$cookies', function($rootScope, jwtHelper, store, $location,$routeParams,$cookies) {

   //$rootScope.isUserLoggedIn = false ; //Cambiar a false
   //$cookies.remove('sostos.tkn');
   //store.remove('token');

   $rootScope.$on('$routeChangeStart', function (event, next)
   {
        var token = $cookies.get('sostos.tkn') || null;
        console.log('getAll:' + $cookies.getAll());
        console.log('token:' + token);
        //var token = store.get("token") || null;

       //var tokenPayload = jwtHelper.decodeToken(token);

        if(!token) {
            $rootScope.isUserLoggedIn = false;
            //$location.path("/");
            $location.url('/',true);
        }
        else {
            $rootScope.isUserLoggedIn = true ; //Cambiar a false
        }

        var bool = jwtHelper.isTokenExpired(token);
        console.log('bool:' + bool);

        if(bool === true) {
            $rootScope.isUserLoggedIn = false;
            //$location.path("/");
            $location.url('/',true);
        }
    });



}]);


app.config(function($routeProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {

  /*jwtOptionsProvider.config({
      tokenGetter: ['options', function(options) {
        //console.log(tknService.url.toString);
        return $cookies.get('sostos.tkn');
        //return localStorage.getItem('token');
      }],
      whiteListedDomains: ['168.232.165.85', 'localhost'] //,
      //authPrefix: 'Bearer '
    });
    $httpProvider.interceptors.push('jwtInterceptor');
		*/


  $routeProvider
  .when('/', {
    templateUrl : 'app/vlogin/login.htm',
    controller 	: 'loginController',
    authorization: false
  })
  .when('/home', {
    templateUrl : 'app/vhome/home.htm',
    controller 	: 'mainController',
    authorization: true
  })  
  // Sección Ayuda
  .when('/preguntasfrec', {
    templateUrl : 'app/vhelp/preguntas.htm',
    controller: 'preguntasfrecuenteController',
    authorization: true
  })
  .when('/chat', {
    templateUrl : 'app/vhelp/chat.htm',
    controller: 'chatController',
    authorization: true
  })
  //Fin Sección Ayuda
  //Mantenedores
  .when('/mntpreguntasseg', {
    templateUrl : 'app/vmaintainer/preguntasseguridad/preguntasseguridad.htm',
    controller: 'preguntasseguridadController',
    authorization: true
  })
  .when('/mntpreguntasfre', {
    templateUrl : 'app/vmaintainer/preguntasfrecuente/preguntasfrecuente.htm',
    controller: 'preguntasfrecuenteController',
    authorization: true
  })
  .when('/mntalumnos', {
    templateUrl : 'app/vmaintainer/alumnos/alumnos.htm',
    controller: 'alumnosController',
    authorization: true
  })
  .when('/mntinstituciones', {
    templateUrl : 'app/vmaintainer/instituciones/instituciones.htm',
    controller: 'institucionesController',
    authorization: true
  })
   .when('/mntniveles', {
    templateUrl : 'app/vmaintainer/niveles/niveles.htm',
    controller: 'nivelesController',
    authorization: true
  })
  .when('/mntasignaturas', {
    templateUrl : 'app/vmaintainer/asignaturas/asignaturas.htm',
    controller: 'asignaturasController',
    authorization: true
  })
 .when('/mntcategorias', {
    templateUrl : 'app/vmaintainer/categorias/categorias.htm',
    controller: 'categoriasController',
    authorization: true
  })

  //Profesor
  .when('/miscontenidos', {
    templateUrl : 'app/vprofesor/contenidos/contenidos.htm',
    controller: 'contenidosController',
    authorization: true
  })
 .when('/mntmisasignaturas', {
    templateUrl : 'app/vmaintainer/asignaturas/misasignaturas.htm',
    controller: 'misasignaturasController',
    authorization: true
  })


  //Comun perfiles
  .when('/perfil', {
    templateUrl : 'app/vperfil/perfil.htm',
    controller: 'perfilController',
    authorization: true
  })
  .when('/clave', {
    templateUrl : 'app/vperfil/contrasena.htm',
    controller: 'perfilController',
    authorization: true
  })
  .when('/logout', {
    template : '',
    controller: 'logoutController',
    authorization: false
  })
  .otherwise({
    redirectTo: '/'
  });
});




 app.controller('mainController', function($scope, $rootScope) {
     $scope.msg = 'Home';
 });

 app.controller('chatController', function($scope, $rootScope) {
      $scope.msg = 'Chat';
  });

 app.factory('apiMenuFactory', function($http, $q, CONFIG, store, $cookies){
    return {
        getTodos: function()
        {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('sostos.tkn');
            //$http.defaults.headers.common.Authorization = 'Bearer ' + store.get("token");
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APISOSTOS + '/usuario/getAllMenu'
            }).then(function(res) {
                deferred.resolve(res);
            }).then(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }
    }
  });

 app.controller('navController', function($scope, $rootScope, CONFIG, apiMenuFactory, $location, $cookies) {
      $scope.getAll = function () {
       apiMenuFactory.getTodos().then(function (data) {
            $scope.lista = data.data;
        });
      };

      $scope.logOut = function () {
          //store.remove('token');
          $cookies.remove('sostos.tkn');
          $http.defaults.headers.common.Authorization = null;
          $location.url("/",true);
      }
 });

app.controller('logoutController', function($scope, $rootScope, CONFIG, apiMenuFactory, $location, store, $http, $cookies, $window) {
          console.log('Saliendo......');
          store.remove('token');
          $cookies.remove('sostos.tkn');
          $http.defaults.headers.common.Authorization = null;
          $window.location.href = CONFIG.SOSTOSWEBURL;
          //$location.url("/",true);
 });




