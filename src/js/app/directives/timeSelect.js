angular.module('App').directive('timeSelect', [function() {
  return {
    scope: {
      time: '=',
      setNewTime: '&'
    },
    controller: ['$scope', function($scope) {
      var ctr = this;

      ctr.hours = [];
      ctr.minutes = [];

      ctr.time = $scope.time;

      ctr.getView = function(q) {
        if (q.toString().length === 1) {
          q = "0" + q;
        }
        return q;
      }

      for (var i = 0; i < 24; i++) {
        ctr.hours.push(i);
      }
      for (var i = 0; i < 60; i++) {
        ctr.minutes.push(i);
      }

      ctr.updateTime = function() {
        var time = ctr.hour * 3600 + ctr.minute * 60;
        $scope.setNewTime({
          time: time
        });
      }

      $scope.$watch(function() {
        return $scope.time;
      }, function(time) {
        if (!time) return;
        var z = time % 3600;
        ctr.hour = Math.floor((time - z) / 3600);
        ctr.minute = Math.floor(z / 60);

        
      });

      return ctr;
    }],
    controllerAs: 'ctr',
    templateUrl: 'templates/directives/timeSelect.html'
  };
}])
