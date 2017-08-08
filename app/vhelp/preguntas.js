app.factory('ayudaFactory', function($http, faqService){
  return {
    faqlist: function(callback){
      return faqService.list();
    }
  };
});


app.controller('ayudaController', function ($scope, faqService, ayudaFactory) {

  $scope.getFaqs = function () {
    $scope.faqs = faqService.list();
  }

  $scope.saveContact = function () {
      faqService.save($scope.newcontact);
      $scope.newcontact = {};
  }

  $scope.delete = function (id) {
      faqService.delete(id);
      if ($scope.newcontact.id == id) $scope.newcontact = {};
  }

  $scope.edit = function (id) {
      $scope.newcontact = angular.copy(faqService.get(id));
  }
});
