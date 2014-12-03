angular.module('App')
  .directive('dateButton', [
    '$filter',
    function($filter) {
      return {
        scope: {
          minDate: '=',
          maxDate: '=',
          model: '='
        },
        templateUrl: 'templates/directives/dateButton.html',
        controller: ['$scope', function($scope) {
          var ctr = this;
          ctr.toggle = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            ctr.isOpen = !ctr.isOpen;
          }
          return ctr;
        }],
        controllerAs: 'ctr',
        link: function($scope, element, attrs) {
          $scope.$watch('model', function(date) {
            applyNewDate($scope, date);
          });

          function applyNewDate(scope, date) {
            if (!date) {
              return
            }
            scope.viewModel = $filter('date')(date, 'd MMMM yyyy, EEE', 0);
          }
        }
      }
    }
  ])
