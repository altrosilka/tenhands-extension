angular.module('App').controller('CD_channel',
  function($scope, $interpolate, S_utils, S_templater) {
    var ctr = this;

    $scope.$watch('text', function(text) {
      $scope.channel.text = text;
    });

    ctr.isComplete = function() {
      return $scope.channel.complete;
    }

    ctr.isFail = function() {
      return $scope.channel.error;
    }

    ctr.getFailDescription = function() {
      if ($scope.channel.errorData) {
        return S_utils.getFailDescription($scope.channel.errorData);
      }
    }

    ctr.editPost = function() {
      delete $scope.channel.error;
      delete $scope.channel.errorData;
    }

    ctr.postInChannelAgain = function() {
      $scope.postChannelAgain();
    }

    ctr.textOverflow = function() {
      var q = $scope.channel.text.length > S_utils.getMaxTextLength($scope.channel.network, $scope.image, $scope.channel.text);

      if (q) {
        $scope.channel.separately = true;
      }

      return q;
    }

    ctr.showProgress = function(channel) {
      return channel.inprogress;
    }

    ctr.toggleChannel = function() {
      $scope.channel.disabled = !$scope.channel.disabled;
    }

    ctr.getAvatarStyle = function() {
      if ($scope.channel.img) {
        return {
          'background-image': 'url(' + $scope.channel.img + ')'
        }
      }
    }

    return ctr;
  }
);
