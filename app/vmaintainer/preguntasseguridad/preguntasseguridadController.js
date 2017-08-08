app.factory('preguntasSeguridad', function($http, $q, CONFIG){
  return{
        get: function()
        {
            var deferred;
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: false,
                url: CONFIG.APILOCAL+'/srv_preguntasseg.php'
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
});

app.controller('preguntasseguridadController', function ($scope, CONFIG, preguntasSeguridad, ngDialog, $window, $rootScope) {
  
  var templateUpd =    'app/vmaintainer/preguntasseguridad/updpreguntasseguridad.htm';
  $scope.templateAdd = 'app/vmaintainer/preguntasseguridad/addpreguntasseguridad.htm';

  $scope.getAll = function ()
  {
      //var lista = JSON.toString(preguntasSeguridad.get());
      var otable =  $('#tblpreguntas').DataTable({
         "paging": true,
         "lengthChange": true,
         "searching": true,
         "ordering": true,
         "info": true,
         "autoWidth": false,
         "processing": true,
         "ajax":
            { "url": CONFIG.APILOCAL + '/srv_preguntasseg.php',
            "dataType": "json",
            "contentType": "application/json",
            "type":'POST'
            //"data":function ( d ) {return JSON.stringify();}
            },
         "language": {"url":"//cdn.datatables.net/plug-ins/1.10.12/i18n/Spanish.json"},
         "scrollY": "300px",
         "pagingType": "full_numbers",
         "columns": [
                       { data: 'id' },
                       { data: 'pregunta' },
                       { "targets": -1,
                            "data": null,
                            "defaultContent": "<button id='btnEditar'  class='btn btn-mini btn-primary'><i class='fa fa-pencil'></i> Editar</button> <button id='btnEliminar'  class='btn btn-mini btn-danger'><i class='fa fa-trash'></i> Eliminar</button>",
                            "orderable": false

                       }
                    ],
           "order": [[0, 'asc']]
       });


      $('#tblpreguntas' + ' tbody').on('click', 'button', function () {
            var object = $(this);
            var data = otable.row(object.parents('tr')).data();

            if (object[0].id == 'btnEditar') {
                  $scope.Dialogo(data, templateUpd);
            }
        });

  };


  $scope.Dialogo = function(data, vtemplate)
  {
      ngDialog.open(
                  {
                      template: vtemplate,
                      className: 'ngdialog-theme-default',
                      data: JSON.stringify({ 'datos': data }),
                      scope: $scope,
                      showClose: false,
                      overlay: true,
                      closeByEscape: false,
                      closeByDocument: false,
                      id: 'dgPreguntas',
                      width:'900px'
                  });

  };


});
