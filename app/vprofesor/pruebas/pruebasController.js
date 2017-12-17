app.controller('pruebasController', function ($scope, CONFIG) {

$scope.models = {
        selected: null,
        lists: {"Preguntas": [], "Prueba": []}
    };


       $scope.models.lists.Preguntas = [
          {
                "id": 1,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 1"
            },
          {
                "id": 2,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 2"
            },
          {
                "id": 3,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 3"
            },
          {
                "id": 4,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 4"
            },
          {
                "id": 5,
                "id_Tema": 4,
                "estado": "A",
                "descripcion": "Pregunta 5"
            }
            ];


    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});




