angular.module('App').directive('editImageFilterOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/filter.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;

      ctr.collection = [{
        name: "none",
        title: "Без фильтра"
      },{
        name: "vintage",
        title: "Vintage"
      }, {
        name: "lomo",
        title: "Lomo"
      }, {
        name: "clarity",
        title: "Clarity"
      }, {
        name: "sunrise",
        title: "Sunrise"
      }, {
        name: "crossProcess",
        title: "Cross Process"
      }, {
        name: "orangePeel",
        title: "Orange Peel"
      }, {
        name: "love",
        title: "Love"
      }, {
        name: "grungy",
        title: "Grungy"
      }, {
        name: "jarques",
        title: "Jarques"
      }, {
        name: "pinhole",
        title: "Pinhole"
      }, {
        name: "oldBoot",
        title: "Old Boot"
      }, {
        name: "glowingSun",
        title: "Glowing Sun"
      }, {
        name: "hazyDays",
        title: "Hazy Days"
      }, {
        name: "herMajesty",
        title: "Her Majesty"
      }, {
        name: "nostalgia",
        title: "Nostalgia"
      }, {
        name: "hemingway",
        title: "Hemingway"
      }, {
        name: "concentrate",
        title: "Concentrate"
      }];

      ctr.onFontchange = function(point) {
        $scope.setValue('filter', point.name);
      } 

      ctr.getSelectPlaceholder = function(type) {
        return _.find(ctr.collection, function(q) {
          return $scope.model === q.name;
        }).title || 'Без фильтра';
      }
    }
  }
}]);
