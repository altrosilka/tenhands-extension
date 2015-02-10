angular.module('App').directive('textareaValidator', [
  '$timeout',
  'S_utils',
  function($timeout, S_utils) {
  return {
    scope: {
      model: '=',
      maxLength: '=',
      showCounter: '='
    }, 
    templateUrl: 'templates/directives/textareaValidator.html',
    link: function($scope, $element, attrs, ngModelCtrl) {

      var DOM = {
        parent: $element.find('.textareaValidator'),
        textarea: $element.find('.textarea'),
        section: $element.find('.text'),
        counter: $element.find('.counter span')
      }

      DOM.textarea.on('keyup keydown keypress', function(){
        $timeout(track);
      }).on('scroll',function(){
        DOM.section.scrollTop($(this).scrollTop());
      })
      $scope.$watch('model', function(q) {
        if (!q) return;

        DOM.textarea.val(q);
        track();
      });

      $scope.$watch('maxLength', function(q) {
        if (!q) return;
        track(); 
      });

      function track() {
        var separateSymbol = 'Ξ';
        var text = DOM.textarea.val().replace(/\n/g, separateSymbol);
 
        var res = text.match(new RegExp('.{' + $scope.maxLength + '}(.*)'));

        if (res !== null) {
          var extra = res[1];
          var extraFilter = S_utils.escapeRegex(extra);

          var newContent = text.replace(new RegExp(extraFilter + '$'),"<span class='highlight'>" + extra + "</span>").replace(new RegExp(separateSymbol, 'g'), "<br>");
          DOM.section.html(newContent+'<br>').height(DOM.textarea.height());
        }

        if ($scope.showCounter){
          DOM.counter.empty();
          var last = $scope.maxLength - text.length;
          var className = 'zero';
          if (last > 0) className = 'more';
          if (last < 0) className = 'less';

          if (text.length / $scope.maxLength > 0.5){
            className += ' active';
          }

          DOM.counter.removeClass().addClass(className).html(last);
        }

        DOM.textarea.trigger('scroll');
      }

    }
  };
}]).filter('cut', function() {
  return function(value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace != -1) {
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail);
  };
});;
