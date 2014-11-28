angular.module('App').controller('CM_parserResults', [
  '$scope',
  '$modalInstance',
  'S_google',
  'S_utils',
  'attaches',
  function($scope, $modalInstance, S_google, S_utils, attaches) {
    var ctr = this;

    ctr.attachments = [];
    ctr.selectedAttachments = [];
    ctr.processingImages = []; 

    if (!attaches) {
      $scope.$on('loadedDataFromTab', function(event, data) {
        $scope.$apply(function() {
          var images = _.map(data.images, function(q) {
            q.type = 'image';
            q.id = S_utils.getRandomString(16);
            return q;
          });
          ctr.attachments = ctr.attachments.concat(images);
        });
      });
    } else {
      ctr.attachments = attaches;
    }

    return ctr;
  }
]);
