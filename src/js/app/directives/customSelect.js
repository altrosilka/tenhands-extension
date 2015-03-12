angular.module('App').directive('customSelect', function() {
  return {
    transclude: true,
    scope: {
      selectId: '=customSelect',
      closeOnSelect: '=',
      options: '=',
      sectionFormat: '=',
      sectionDefault: '=',
      optionFormat: '=',
      optionDisabled: '&',
      optionActive: '&',
      onSelect: '&',
      options: '=',
      customContent: '=' 
    },
    controllerAs: 'cSCtr',
    controller: function($timeout, $scope, $interpolate, $sce) {

      var ctr = this;
      $scope.length = 123;
 
      $scope.$watch('sectionFormat', function() {

        $scope.section = $sce.trustAsHtml($interpolate('<span>' + $scope.sectionFormat + '</span>')($scope));
      })

      ctr.close = function() {
        ctr.opened = false;
        $('body').off('click');
      }

      ctr.open = function() {
  
        ctr.opened = !ctr.opened; 

        if (ctr.opened) {
          $timeout(function() {
            $('body').on('click', function(event) {

              $scope.$apply(function() {
                ctr.opened = false;
              });
              $(this).off('click');
            });
          });
        } else {
          $('body').off('click');
        }
      }

      ctr.isDisabled = function(option) {
        if (!$scope.optionDisabled()) {
          return;
        }
        return $scope.optionDisabled()(option, $scope.selectId);
      }

      ctr.isActive = function(option) {
        if (!$scope.optionActive()) {
          return;
        }
        return $scope.optionActive()(option, $scope.selectId);
      }

      ctr.selectOption = function($event, option) {
        $event.stopPropagation();
        $scope.selected = option;
        //$scope.onSelect()(option, $scope.selectId);

        //$scope.section = $sce.trustAsHtml($interpolate('<span>'+$scope.sectionFormat+'</span>')($scope));

        if ($scope.closeOnSelect) {
          ctr.open();
        }
      }

      return ctr;
    },
    templateUrl: 'templates/directives/customSelect.html',
    link: function(scope, element, attrs, ctrl, transclude) {
      var parent = scope.$parent.$new();
      var current = scope;

      transclude(parent, function(clone, scope) {
        scope.$close = current.cSCtr.close;
        element.find('[data-role="custom-content"]').append(clone);
      });

      element.find('menu').on('click', function(event) {
        event.stopPropagation();
      });
    }
  }
})
