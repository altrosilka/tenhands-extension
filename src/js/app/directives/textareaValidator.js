angular.module('App').directive('textareaValidator',
  function($timeout, S_utils) {
    return {
      scope: {
        image: '=',
        channel: '=channelInfo',
        showCounter: '='
      },
      templateUrl: 'templates/directives/textareaValidator.html',
      link: function($scope, $element, attrs, ngModelCtrl) {
        var maxLength = 0;


        var DOM = {
          parent: $element.find('.textareaValidator'),
          textarea: $element.find('.textarea'),
          section: $element.find('.text'),
          urls: $element.find('.urls'),
          counter: $element.find('.counter span')
        }

        DOM.textarea.on('keyup keydown keypress', function() {
          $timeout(track);
        }).on('scroll', function() {
          DOM.section.scrollTop($(this).scrollTop());
        });


        $scope.$watch('channel.text', function(q, old) {
          if (!q) return;

          maxLength = S_utils.getMaxTextLength($scope.channel.network, $scope.image, $scope.channel.text);

          track(q);
        });


        $scope.$on('emptyChannels', function(event, data) {
          DOM.textarea.val('');
          track();
        });

        $scope.$watch(function() {
          return S_utils.getMaxTextLength($scope.channel.network, $scope.image, $scope.channel.text);
        }, function(q, z) {
          if (!q || q === z) return;

          maxLength = q;
          track();
        });

        function track(q) {
          var separateSymbol = 'Ξ';
          var val = q || DOM.textarea.val();
          var text = val.replace(/\n/g, separateSymbol);

          var res = text.match(new RegExp('.{' + maxLength + '}(.*)'));

          if (res !== null) {
            var extra = res[1];
            var extraFilter = S_utils.escapeRegex(extra);

            var newContent = text.replace(new RegExp(extraFilter + '$'), "<span class='highlight'>" + extra + "</span>").replace(new RegExp(separateSymbol, 'g'), "<br>");
            DOM.section.html(newContent + '<br>').height(DOM.textarea.height());
          } else {
            DOM.section.html('');
          }

          if ($scope.showCounter) {
            DOM.counter.empty();
            var last = maxLength - text.length;
            var className = 'zero';
            if (last > 0) className = 'more';
            if (last < 0) className = 'less';

            if (text.length / maxLength > 0.1) {
              className += ' active';
            }

            DOM.counter.removeClass().addClass(className).html(last);
          }

          DOM.textarea.trigger('scroll');
          DOM.textarea.val(val);
          if (!q) {
            $scope.channel.text = val;
          }
        }
      }
    };
  })
