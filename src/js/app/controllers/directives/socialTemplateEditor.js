angular.module('App').controller('CD_socialTemplateEditor',
  function($scope, S_templater) {
    var ctr = this;

    ctr.data = {};

    ctr.template = S_templater.getTemplate();

    $scope.$on('loadedDataFromTab', function(event, data) {
      ctr.data = data;
    });


    ctr.setTemplate = function(){
      S_templater.setTemplate(ctr.template);
    }

    ctr.getVar = function(q) {
      if (ctr.data[q]) {
        return ctr.data[q];
      } else {
        return '[нет значения]';
      }
    }

    return ctr;
  }
);
