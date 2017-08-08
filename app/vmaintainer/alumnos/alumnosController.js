app.factory('alumnosFact', function($http, $q, CONFIG   ){
  return{
        get: function()
        {
            var deferred;
            deferred = $q.defer();
            $http({
                method: 'GET',
                skipAuthorization: true,
                url: CONFIG.APIJSON + '/users'
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

app.controller('alumnosController', function ($scope, CONFIG, alumnosFact, ngDialog, $window, $rootScope) {
  
  var templateUpd =     'app/vmaintainer/preguntasfrecuente/updpreguntasfrecuente.htm';
  $scope.templateAdd =  'app/vmaintainer/preguntasfrecuente/addpreguntasfrecuente.htm';
  $scope.planilla = $scope.excel;
  $scope.gridOptions = {
    enableSorting: true,
      columnDefs: [
          { field: 'name' },
          { field: 'age' },
          { field: 'location', enableSorting: false }
      ]
      ,onRegisterApi: function (gridApi) {
      $scope.grid1Api = gridApi;
      }
  };
  
    $scope.alumnos = null;

  $scope.getAll = function ()
  {
    
      //jQuery.support.cors = true;
      $scope.alumnos = alumnosFact.get();
      $scope.gridOptions.data = $scope.alumnos;
      /*var lista2 = '{' + lista + '}';
      //var lista = JSON.toString('{ data:' + alumnosFact.get() + '}');
      var otable =  $('#tblalumnos').DataTable({
         "paging": true,
         "lengthChange": true,
         "searching": true,
         "ordering": true,
         "info": true,
         "autoWidth": false,
         "processing": true,
         "ajax": lista2,
         "dataSrc": "",
         "language": {"url":"//cdn.datatables.net/plug-ins/1.10.12/i18n/Spanish.json"},
         "scrollY": "300px",
         "pagingType": "full_numbers",
         "columns": [
                       { data : 'id' },
                       { data : 'username'} ,
                       { data : 'name'} ,
                       { data : 'email'} ,
                       { "targets": -1,
                            "data": null,
                            "defaultContent": "<button id='btnEditar'  class='btn btn-mini btn-primary'><i class='fa fa-pencil'></i> Editar</button> <button id='btnEliminar'  class='btn btn-mini btn-danger'><i class='fa fa-trash'></i> Eliminar</button>",
                            "orderable": false }
                       
                    ],
           "order": [[0, 'asc']]
       });


      $('#tblalumnos' + ' tbody').on('click', 'button', function () {
            var object = $(this);
            var data = otable.row(object.parents('tr')).data();

            if (object[0].id == 'btnEditar') {
                  $scope.Dialogo(data, templateUpd);
            }
        });
        */
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
                      id: 'dgAlumnos',
                      width:'900px',
                      height: '400px'
                  });

  };


});