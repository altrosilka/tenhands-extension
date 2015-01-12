angular.module('App').directive('imageUploadArea', ['$timeout', '__api', function($timeout, __api) {
  return {
    scope: {
      afterImageUploaded: '=',
      onUploadStart: '='
    },
    templateUrl: 'templates/directives/imageUploadArea.html',
    controller: ['$scope', function($scope) {
      var ctr = this;


      return ctr;
    }],
    link: function($scope, $element) {
      $element.find('input').fileupload({
        url: __api.baseUrl + __api.paths.media,
        dataType: 'json',
        singleFileUploads: true,
        limitMultiFileUploads: 1,
        done: function(e, data) {
          var info = data.result;

          $scope.afterImageUploaded(info);
        },
        add: function(e, data) {
          _.forEach(data.files,function(){
            $scope.onUploadStart();
          });
          
          if (data.autoUpload || (data.autoUpload !== false &&
              $(this).fileupload('option', 'autoUpload'))) {
            data.process().done(function() {
              data.submit();
            });
          }
        }
      });
    },
    controllerAs: 'ctr'
  }


}]);
