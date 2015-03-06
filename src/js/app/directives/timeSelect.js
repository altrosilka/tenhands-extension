angular.module('App').directive('timeSelect', [function() {
  return {
    scope: {
      date: '=',
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
        return $scope.date;
      }, function(date) {
        if (!date) return;
        date = moment(date);
        var timeFromDayStart = date.diff(moment(date.format('YYYYMMDD'),'YYYYMMDD').hour(0).minute(0).second(0), 'seconds');

        var z = timeFromDayStart % 3600;
        ctr.hour = Math.floor((timeFromDayStart - z) / 3600);
        ctr.minute = Math.floor(z / 60);
      });

      return ctr;
    }],
    controllerAs: 'ctr',
    templateUrl: 'templates/directives/timeSelect.html'
  };
}])
