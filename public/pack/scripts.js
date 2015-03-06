var App = angular.module('App', [
  'LocalStorageModule',
  'config',
  'vkTools',
  'chromeTools',
  'ngSanitize',
  'ngAnimate',
  'utilsTools',
  'ui.bootstrap',
  'ui.select',
  'ui.calendar',
  'templates'
]); 
    
App.config([
  '$httpProvider',
  function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf8';
  }
]);
   
angular.module('config', [])
  .constant('__api', {
    baseUrl: 'http://smm.dev/api/',
    paths: { 
      saveExtensionVkToken: 'accounts/vkontakte/add',
      getShortUrl: 'utils/shortUrl',
      getAssignKey: 'user/getAssignKey',
      media: 'media',
      getOverrideKey: 'groups/getOverrideKey',
      getPostsInPeriod: 'posts/getInPeriod',
      createPost: 'posts',
      getUserInfo: 'users/getCurrentUser',
      signIn: 'auth/signIn',
      sets: 'sets',
      getSetChannels: 'sets/getChannels',
      getTable: 'table'
    }
  })
  .constant('__postMessagePrepend', 'Ejiw9494WvweejgreWCEGHeeE_FF_')
  .constant('__maxPollVariants', 10)
  .constant('__maxAttachments', 9)
  .constant('__twitterConstants',{
    maxSymbols: 140,
    linkLen: 22,
    mediaLen: 23 
  })

var oldTrack = 0;


function track(name) {
  var time = new Date().getTime();
  if (oldTrack) {
    console.log(name, time - oldTrack);
  } else {
    console.log(name);
  }
  oldTrack = time;
}


track('start');
App.run([
  'S_chrome',
  'S_vk',
  'S_google',
  'S_selfapi',
  function(S_chrome, S_vk, S_google, S_selfapi) {
    track('run');

    Highcharts.setOptions({
      global: {
        //timezoneOffset: moment().zone(),
        useUTC: false
      },
      lang: {
        shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      }
    });

    S_chrome.pageDataWatch();

    S_google.init();
  }
]);

angular.module('App').filter('findGroups', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) { 
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});
angular.module('App').filter('lastfmDateToLocal', ['localization',function(localization) {
  return function(date) {
    if (!date) {
      return;
    } 

    var parsed = moment(date,'DD MMM YYYY HH:mm'); 

    return parsed.format('DD') + ' ' + localization.months[parsed.month()] + ' ' + parsed.format('YYYY');
  }
}]);

angular.module('App').filter('parseVkText', [function() {
  return function(input, removeLink) {
    if (!input) {
      return;
    }

    var regClub = /\[club([0-9]*)\|([^\]]*)\]/g;
    var regId = /\[id([0-9]*)\|([^\]]*)\]/g;



    var bytes = [];

    for (var i = 0; i < input.length; ++i) {
      bytes.push(input.charCodeAt(i));
    }

    var ranges = [
      '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
      '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
      '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
    ];

    input = emojiParseInText(input);
      
    var text = input;

    text = (removeLink) ? text.replace(regClub, '<span>$2</span>') : text.replace(regClub, '<a class="link" href="/public/$1/">$2</a>');
    text = text.replace(regId, '<span>$2</span>').replace(/\n/g, "<br />");

    return text;
  }
}]);

angular.module('App').filter('substring', [function() {
  return function(text, len) {
    len = len || 100;
    if (!text) {
      return;
    } 

    if (text.length > len){
      return text.substring(0,len);
    } else {
      return text;
    }
  }
}]);
 
angular.module('App').filter('toGIS', function() {
  return function(time) {
    if (!time) {
      return '';
    }
    var out = '';
    var s_last = time % 60;
    var s_minutes = (time - s_last) / 60;
    out = s_minutes + ':' + ((s_last < 10) ? '0' : '') + s_last;
    return out;
  }
});

angular.module('App').directive('attachPoll', [function() {
  return {
    scope:{
      poll: '=attachPoll',
      destroy: '&'
    },
    templateUrl: 'templates/directives/attachPoll.html',
    controller: 'CD_attachPoll as ctr',
    link: function($scope, $element) {
      
    }
  }
}]);

angular.module('App').directive('autosizeTextarea', [function() {
  return {
    link: function($scope, $element) {
      $element.css({'transition':'0.2s'}).autosize();
    }
  }
}]);
  
angular.module('App').directive('channel', [function() {
  return {
    scope:{
      channel: "=",
      pageData: "=",
      postChannelAgain: "&"
    },
    templateUrl: 'templates/directives/channel.html',
    controller: 'CD_channel as channel_ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 
angular.module('App').directive('channelsScrollbar', [function() {
  return {
    link: function($scope, $element) {
      $element.mCustomScrollbar({
        axis: 'x',
        advanced: {
          autoExpandHorizontalScroll: true
        },
        scrollInertia: 0,
        mouseWheel: {
          enable:true,
          invert: (navigator.platform === "MacIntel")
        }
      });
    }
  }
}]);

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

angular.module('App').directive('halfHeight', ["$window", function($window) {
  return {
    link: function($scope, $element) {
      $window.addEventListener('resize',callHeight);

      callHeight();

      function callHeight(){
        $element.height($window.innerHeight/2);
      }
    }
  }
}]);
 
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

angular.module('App').directive('instagramArea', [function() {
  return {
    scope:{
      attach: '=instagramArea'
    },
    templateUrl: 'templates/directives/instagramArea.html',
    controller: 'CD_instagramArea as ctr',
    link: function($scope, $element) {
      
    }
  }
}]);

angular.module('App').directive('jcropArea', ['$timeout', function($timeout) {
  return {
    scope: {
      image: '@',
      onCropReady: '='
    },
    templateUrl: 'templates/directives/jcropArea.html',
    controller: ['$scope', function($scope) {
      var ctr = this;

      var jCrop, image;

      ctr.disableActions = false;
      ctr.image = $scope.image;
      ctr.maxHeight = $(window).height() - 100;


      ctr.startCrop = function() {
        ctr.editType = 'crop';
        ctr.disableActions = true;

        image = $('#cropImage');


        image.Jcrop({
          setSelect: [0, 0, image.width(), image.height()]
        }, function() {
          jCrop = this;
        });


      }

      ctr.applyCrop = function() {
        var c = jCrop.tellSelect();
        var orW = image.width();
        var orH = image.height();
        if (c.x === 0 && c.y === 0 && c.x2 === orW && c.y2 === orH) {
          ctr.cancelCrop();
        } else {
          $scope.onCropReady(ctr.image, c, image.width(), image.height());
        }
      }

      ctr.cancelCrop = function() {
        ctr.editType = undefined;
        ctr.disableActions = false;
        jCrop.destroy();
        jCrop = undefined;
        $.fancybox.close();
      }

      $timeout(function() {

        ctr.startCrop();
      })

      return ctr;
    }],
    link: function($scope, $element) {

    },
    controllerAs: 'ctr'
  }


}]);

angular.module('App').directive('photobankSearch', [function() {
  return {
    templateUrl: 'templates/directives/photobankSearch.html',
    controller: 'CD_photobankSearch as pbctr',
    link: function($scope, $element) {
      
    }
  }
}]);

angular.module('App').directive('popoverHtmlUnsafePopup', function() {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        content: '@',
        placement: '@',
        animation: '&',
        isOpen: '='
      },
      templateUrl: 'templates/directives/popoverHtmlUnsafePopup.html'
    };
  })
  .directive('popoverHtmlUnsafe', ['$tooltip',
    function($tooltip) {
      return $tooltip('popoverHtmlUnsafe', 'popover', 'click');
    }
  ])
 
angular.module('App').directive('selectArea', [
  '$timeout',
  '$compile',
  'S_selfapi',
  'S_utils',
  function($timeout, $compile, S_selfapi, S_utils) {
    return {
      scope: {
        attachments: '=',
        selectedAttachments: '=',
        onAttachClick: '&',
        noAttachesText: '@'
      },
      templateUrl: 'templates/directives/selectArea.html',
      controller: ['$scope', function($scope) {
        var ctr = this;

        var _fanciedImage;

        ctr.noAttachesText = $scope.noAttachesText;

        ctr.toggle = function(attach) {
          var i = _.remove($scope.selectedAttachments, function(q) {
            return q.id === attach.id;
          });
          if (i.length === 0) {
            $scope.selectedAttachments.push(attach);
          }
        }

        ctr.remove = function(attach) {
          _.remove($scope.selectedAttachments, function(q) {
            return attach.id === q.id;
          });
        }

        ctr.showRealImageSize = function(attach) {
          return (attach.clientWidth !== attach.width && attach.clientHeight !== attach.height);
        }

        ctr.attachIsSelected = function(attach) {
          return typeof _.find($scope.selectedAttachments, function(q) {
            return q.id === attach.id;
          }) !== 'undefined';
        }

        ctr.onAttachClick = function(attach) {
          $scope.onAttachClick({
            attach: attach
          });
        }

        return ctr;
      }],
      link: function($scope, $element) {},
      controllerAs: 'ctr'
    }
  }
]);

angular.module('App').directive('selectCropArea', [
  '$timeout',
  '$compile',
  'S_selfapi',
  'S_utils',
  function($timeout, $compile, S_selfapi, S_utils) {
    return {
      scope: {
        processingAttachments: '=',
        attachments: '=',
        postAttachments: '=',
        noAttachesText: '@'
      },
      templateUrl: 'templates/directives/selectCropArea.html',
      controller: ['$scope', function($scope) {
        var ctr = this;

        var _fanciedImage;

        ctr.showRealImageSize = function(attach) {
          return (attach.clientWidth !== attach.width && attach.clientHeight !== attach.height);
        }

        ctr.attachIsSelected = function(attach) {
          return typeof _.find($scope.postAttachments, function(q) {
            return q.id === attach.id;
          }) !== 'undefined';
        }

        ctr.attachIsProcessing = function(attach) {
          return typeof _.find($scope.processingAttachments, function(q) {
            return q.id === attach.id;
          }) !== 'undefined';
        }

        ctr.remove = function(attach){
          _.remove($scope.attachments,function(q){
            return attach.id === q.id;
          });
        }

        ctr.onCropReady = function(src, c, w, h) {
          $scope.processingAttachments.push(_fanciedImage);
          $.fancybox.close();

          S_selfapi.uploadImageToVk(src, c, w, h, _fanciedImage.id).then(function(resp) {
            var photo = resp.photo;
            var image = _.remove($scope.processingAttachments, function(q) {
              return q.id === resp.id;
            })[0];

            _.extend(image, {
              photo: photo, 
              width: photo.width, 
              clientWidth: photo.width,
              height: photo.height,
              clientHeight: photo.height,
              src: photo.photo_130,
              src_big: photo.photo_807 || photo.photo_604
            });
          });
        }

        ctr.edit = function(image) {
          _fanciedImage = image;
          var src = image.src_big || image.src;

          S_utils.loadImage(src).then(function() {
            _fancyBoxObject = $.fancybox({
              type: 'html',
              overlayShow: true,
              content: $compile('<div jcrop-area on-crop-ready="ctr.onCropReady" image="' + src + '"></div>')($scope),
              padding: 0,
              openEffect: 'none',
              closeEffect: 'none',
              width: 960,
              height: 520,
              helpers: {
                overlay: {
                  locked: false
                }
              }
            });
            $('.fancybox-wrap').addClass('showed');
          });
        }

        ctr.openVideo = function(attach){
          S_utils.callVideoPlayerDialog(attach.video.title, attach.video.player);
        }

        return ctr;
      }],
      link: function($scope, $element) {
      },
      controllerAs: 'ctr'
    }
  }
]);

angular.module('App')
  .directive('selectDate', [
    '$filter',
    function($filter) {
      return {
        scope: {
          isOpen: '=',
          hideInputs: '=',
          minDate: '=',
          maxDate: '=',
          model: '='
        },
        templateUrl: 'templates/directives/selectDate.html',
        link: function($scope, element, attrs) {

          $scope.editdate = {
            day: undefined,
            month: undefined,
            year: undefined
          };

          $scope.$watch('model', function(date) {
            applyNewDate($scope, date);
          });

          element.find('.inputs input').on('blur', function() {

            if (typeof $scope.editdate.day === 'undefined' || typeof $scope.editdate.month === 'undefined' || typeof $scope.editdate.year === 'undefined')
              return;

            var date = new Date(parseInt($scope.editdate.year), parseInt($scope.editdate.month) - 1, parseInt($scope.editdate.day));

            if (!isNaN(date)) {
              $scope.$apply(function() {
                $scope.model = date;
                applyNewDate($scope, date);
              });

            } else {
              $scope.$apply(function() {
                applyNewDate($scope, $scope.model);
              });

            }
          }).on('keypress', function(e) {
            if (e.which == 13) {
              $(this).trigger('blur'); 
            }
          });

          function applyNewDate(scope, date) {
            if (!date) {
              return
            }
            scope.editdate.day = $filter('date')(date, 'dd', 0);
            scope.editdate.month = $filter('date')(date, 'MM', 0);
            scope.editdate.year = $filter('date')(date, 'yyyy', 0);
          }
        }
      }
    }
  ])

angular.module('App').directive('socialTemplateEditor', [function() {
  return {
    scope:{

    },
    templateUrl: 'templates/directives/socialTemplateEditor.html',
    controller: 'CD_socialTemplateEditor as ctr',
    link: function($scope, $element, attrs, ctr) {
     
    }
  }
}]);

angular.module('App').directive('sourceLink', [function() {
  return {
    scope:{
      link: '=sourceLink'
    },
    templateUrl: 'templates/directives/sourceLink.html',
    controller: 'CD_sourceLink as ctr',
    link: function($scope, $element) {
      
    }  
  }
}]);

angular.module('App').directive('textareaValidator',
  ["$timeout", "S_utils", function($timeout, S_utils) {
    return {
      scope: {
        model: '=',
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

          maxLength = S_utils.getMaxTextLength($scope.channel.network, $scope.channel.attachments, $scope.channel.text);

          track(q);
        });


        $scope.$on('emptyChannels', function(event, data) {
          DOM.textarea.val('');
          track();
        });

        $scope.$watch(function() {
          return S_utils.getMaxTextLength($scope.channel.network, $scope.channel.attachments, $scope.channel.text);
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
  }])

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

angular.module('App').directive('videoCover', function() {
    return {
      templateUrl: 'templates/directives/videoCover.html'
    };
  });
angular.module('App').directive('vkPostAttachments', ['S_utils', function(S_utils) {
  return {
    scope:{
      attachments: '=vkPostAttachments',
      first: '=',
      own: '='
    },
    templateUrl: 'templates/directives/vkPostAttachments.html',
    link: function($scope, $element) {
      if ($scope.first === true && $scope.attachments && $scope.attachments.length){
        $scope.attach = S_utils.findFirstAttach($scope.attachments, $scope.own);
      }
    }
  }
}]);
 
angular.module('chromeTools', [])
  .service('S_chrome', ['$q', 'S_eventer', function($q, S_eventer) {
    var service = {};

    service.pageDataWatch = function() {
 
      window.addEventListener('message', function(e) {
        S_eventer.sendEvent('loadedDataFromTab', e.data);
      });
    }

    service.showExtensionPopup = function(tab, info) {
      debugger 
      chrome.tabs.executeScript(tab.id, {
        file: "pack/pageEnviroment.js"
      });
    }

    service.openPreAuthPage = function() {
      chrome.tabs.create({
        url: '/pages/afterInstall.html',
        selected: true
      }, function(tab) {});
    }


    return service;
  }]);

angular.module('App')
  .service('S_eventer', [
    '$rootScope',
    '__postMessagePrepend',
    function($rootScope, __postMessagePrepend) {
      var service = {};

      service.sendEvent = function(name, arguments) {
        $rootScope.$broadcast(name, arguments);
      }

      service.sayToFrame = function(code) {
        parent.postMessage(__postMessagePrepend + code, "*");
      }

      service.onPostMessage = function(next) {
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function(e) {
          var key = e.message ? "message" : "data";
          var data = e[key];

          next(e, data);
        }, false);
      }

      return service;
    }
  ]);



angular.module('App')
  .service('S_google', [
    '$q',
    function($q) {
      var service = {};

      service.init = function() {
        google.load('search', '1');
      }
 
      service.loadImages = function(q) {
        var defer = $q.defer();
        var imageSearch = new google.search.ImageSearch();

        imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,
          google.search.ImageSearch.IMAGESIZE_MEDIUM);

        imageSearch.setResultSetSize(8);

        imageSearch.setSearchCompleteCallback(this, function() {
          defer.resolve(imageSearch);
        }, null);

        imageSearch.execute(q);
        return defer.promise;
      }

      return service;
    }
  ]);

angular.module('App')
  .service('S_selfapi', [
    '$http',
    '$q',
    '__api',
    function($http, $q, __api) {
      var service = {};
      var base = __api.baseUrl;
      service.sendExtensionToken = function(token) {
        return $http({
          url: base + __api.paths.saveExtensionVkToken,
          method: 'POST',
          data: {
            token: token
          }
        });
      }

      service.createPost = function(setId, postInfo, socket_channel, time) {
        return $http({
          url: base + __api.paths.createPost,
          method: 'POST',
          data: {
            setId: setId,
            postInfo: postInfo,
            socket_channel: socket_channel,
            time: time
          }
        });
      }

      service.getTable = function(from, to, set_ids, user_ids) {
        return $http({
          url: base + __api.paths.getTable,
          method: 'GET',
          withCredentials: true,
          params: {
            from: from,
            to: to,
            set_ids: set_ids,
            user_ids: user_ids
          }
        });
      }



      service.getShortUrl = function(url) {
        return $http({
          url: base + __api.paths.getShortUrl,
          method: 'POST',
          data: {
            url: url
          }
        });
      }

      service.getUserInfo = function() {
        return $http({
          url: base + __api.paths.getUserInfo,
          method: 'GET',
          withCredentials: true
        });
      }

      service.getAllSets = function() {
        return $http({
          url: base + __api.paths.sets,
          method: 'GET',
          withCredentials: true
        });
      }

      service.getSetInfo = function(setId) {
        return $http({
          url: base + __api.paths.getSetChannels,
          method: 'GET',
          withCredentials: true,
          params: {
            id: setId
          }
        });
      }

      service.signIn = function(email, password) {
        return $http({
          withCredentials: true,
          url: base + __api.paths.signIn,
          method: 'POST',
          data: {
            email: email,
            password: password
          }
        });
      }

      var _uploadStack = [];
      service.uploadImage = function(url, c, w, h, id) {
        var defer = $q.defer();

        var obj = {
          url: url,
          id: id
        };

        if (c) {
          _.extend(obj, c);
          obj.originalWidth = w;
          obj.originalHeight = h;
        }

        _uploadStack.push({
          obj: obj,
          defer: defer
        });

        if (_uploadStack.length === 1) {
          uploadImageCall();
        }

        return defer.promise;
      }

      function uploadImageCall() {
        var q = _uploadStack[0];
        $http({
          url: base + __api.paths.media,
          method: 'POST',
          data: q.obj
        }).then(function(resp) {
          _uploadStack.shift();
          q.defer.resolve({
            media_id: resp.data.data.media_id,
            media_url: resp.data.data.media_url,
            id: q.obj.id
          });

          if (_uploadStack.length > 0) {
            uploadImageCall();
          }
        });
      }

      return service;
    }
  ]);

angular.module('App')
  .service('S_templater',

    ["localStorageService", "S_eventer", function(localStorageService, S_eventer) {
      var service = {};

      var templateKeyName = 'template';
      var defaultTemplate = '{{title}}\n\n{{url}}';

      service.getTemplate = function() {

        var q = localStorageService.get(templateKeyName);

        if (q) {
          return q.text;
        } else {
          return defaultTemplate;
        }
      }

      service.setTemplate = function(tpl) {

        localStorageService.set(templateKeyName, {text: tpl});
        S_eventer.sendEvent('trigger:templateChanged');
      }

      return service;
    }]
  );

angular.module('App')
  .service('S_tour',
    ["localStorageService", "$timeout", function(localStorageService, $timeout) {
      var service = {};

      var tour;

      var tourKeyName = 'tour.base';

      service.init = function(force) {

        var q = localStorageService.get(tourKeyName) || {};

        if (!force && q.complete){
          return;
        }

        tour = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: false
          }
        });

        tour.on('complete', function(){
          localStorageService.set(tourKeyName, {
            complete: 1
          });
        });

        tour.addStep('step1', {
          text: 'В настойках можно отредактировать шаблон сбора информации со страницы',
          attachTo: '[data-step="settings"]',
          buttons: [{
            text: 'Ясно',
            action: tour.next
          }]
        });

        tour.addStep('step3', {
          text: 'Можно свернуть окошко расширения и увидеть на заднем плане сайт. Чтобы скопировать что-то, например',
          attachTo: '[data-step="resizer"] bottom',
          buttons: [{
            text: 'Хорошо',
            action: tour.next
          }]
        });

        tour.addStep('step4', {
          text: 'Закрыть расширение можно этим крестиком',
          attachTo: '[data-step="remover"]',
          buttons: [{
            text: 'Все понятно',
            action: tour.next
          }]
        });

        if ($('body').find('[data-step="shareSetName"]').length) {
          tour.addStep('step5', {
            text: 'Всегда можно выбрать нужный для публикации набор',
            attachTo: '[data-step="shareSetName"] bottom',
            buttons: [{
              text: 'Все понятно',
              action: tour.next
            }]
          });
        }

        if ($('body').find('[data-step="channel"]').length) {
          tour.addStep('step5', {
            text: 'Это канал в социальной сети. Для каждого канала своё окно для публикации',
            attachTo: '[data-step="channel"] top',
            buttons: [{
              text: 'Понятно',
              action: tour.next
            }]
          });
        }

        if ($('body').find('[data-step="changeChannelVisibility"]').length) {
          tour.addStep('changeChannelVisibility', {
            text: 'Можно не публиковать запись в некоторые каналы',
            attachTo: '[data-step="changeChannelVisibility"]',
            buttons: [{
              text: 'Дальше',
              action: tour.next
            }]
          });
        }

        if ($('body').find('[data-step="publicNow"]').length) {
          tour.addStep('step5', {
            text: 'Записи можно разместить сейчас',
            attachTo: '[data-step="publicNow"] top',
            buttons: [{
              text: 'Так-так...',
              action: tour.next
            }]
          });
          tour.addStep('step5', {
            text: 'А можно и запланировать их на будущее',
            attachTo: '[data-step="publicLater"] top',
            buttons: [{
              text: 'Это хорошо',
              action: tour.next
            }]
          });
          tour.addStep('step5', {
            text: 'Можно закрыть окно расширения сразу после успешной публикации',
            attachTo: '[data-step="closeAfterPosting"] top',
            buttons: [{
              text: 'ОК',
              action: tour.next
            }]
          });
          tour.addStep('step5', {
            text: 'Послать все записи в социальные сети',
            attachTo: '[data-step="publicButton"] top',
            buttons: [{
              text: 'Пора пользоваться!',
              action: tour.next
            }]
          });
        }

         tour.start();
      }



      return service;
    }]
  );

angular.module('utilsTools', [])
  .service('S_utils', [
    '$modal',
    '$q',
    '$templateCache',
    '$compile',
    '$rootScope',
    '__twitterConstants',
    function($modal, $q, $templateCache, $compile, $rootScope, __twitterConstants) {
      var service = {};

      service.getUrlParameterValue = function(url, parameterName) {
        "use strict";
 
        var urlParameters = url.substr(url.indexOf("#") + 1),
          parameterValue = "",
          index,
          temp;

        urlParameters = urlParameters.split("&");

        for (index = 0; index < urlParameters.length; index += 1) {
          temp = urlParameters[index].split("=");

          if (temp[0] === parameterName) {
            return temp[1];
          }
        }

        return parameterValue;
      }

      service.decodeEntities = (function() {
        var element = document.createElement('div');

        function decodeHTMLEntities(str) {
          if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
          }

          return str;
        }

        return decodeHTMLEntities;
      })();

      service.getRandomString = function(len) {
        len = len || 10;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }

      service.showTablePopup = function(setId) {
        return $modal.open({
          templateUrl: 'templates/modals/table.html',
          controller: 'CM_table as ctr',
          size: 'lg',
          resolve: {
            setId: function() {
              return setId;
            }
          }
        }).result;
      }

      service.callAttachPhotoDialog = function(fromPage, uploadCallbacks) {
        return $modal.open({
          templateUrl: 'templates/modals/attachPhoto.html',
          controller: 'CM_attachPhoto as ctr',
          resolve: {
            pageAttachments: function() {
              return fromPage;
            },
            uploadCallbacks: function() {
              return uploadCallbacks;
            }
          }
        }).result;
      }


      service.callAttachVideoDialog = function(group_id) {
        return $modal.open({
          templateUrl: 'templates/modals/attachVideo.html',
          controller: 'CM_attachVideo as ctr',
          resolve: {
            group_id: function() {
              return group_id;
            }
          }
        }).result;
      }


      service.callVideoPlayerDialog = function(title, videoSrc) {
        return $modal.open({
          templateUrl: 'templates/modals/videoPlayer.html',
          controller: 'CM_videoPlayer as ctr',
          resolve: {
            videoSrc: function() {
              return videoSrc;
            },
            title: function() {
              return title;
            }
          }
        }).result;
      }

      service.getAttachesByType = function(attaches, type) {
        return _.filter(attaches, function(q) {
          return q.type === type;
        });
      }

      service.attachToFancy = function(ats) {
        return _.map(ats, function(image) {
          return {
            href: image.src
          }
        });
      }

      service.loadImage = function(src) {
        var defer = $q.defer();

        var image = new Image();
        image.src = src;
        image.onload = function() {
          defer.resolve(this);
        }
        image.onerror = function() {
          defer.reject(this);
        }

        return defer.promise;
      }

      service.convertUploadedPhotoToAttach = function(media_id, media_url, info) {
        return {
          media_id: media_id,
          width: info.width,
          clientWidth: info.width,
          height: info.height,
          clientHeight: info.height,
          src: media_url,
          src_big: media_url,
          type: 'image'
        }
      }

      service.wrapVideo = function(video) {
        return {
          video: video,
          id: service.getRandomString(16),
          duration: video.duration,
          src: video.photo_320,
          type: 'video'
        }
      }

      service.convertGoogleImageToAttach = function(image) {
        return {
          photo: image.photo,
          id: image.id || service.getRandomString(16),
          width: image.width,
          clientWidth: image.width,
          height: image.height,
          clientHeight: image.height,
          src: image.url,
          src_big: image.url,
          type: 'image'
        }
      }

      service.createEmptyPoll = function() {
        return {
          id: service.getRandomString(16),
          type: 'poll'
        }
      }

      service.getCurrentTime = function() {
        return Math.floor(new Date().getTime() / 1000);
      }

      service.sortAttachments = function(attaches) {
        var priority = ['image', 'video', 'doc', 'audio', 'poll'];
        return _.sortBy(attaches, function(attach) {
          var i = _.findIndex(priority, function(q) {
            return q === attach.type;
          });
          if (i !== -1) {
            return i;
          } else {
            return 0;
          }
        });
      }

      service.findFirstAttach = function(attaches) {
        if (!attaches || attaches.length === 0) {
          return;
        }

        var priority = ['image', 'video', 'poll'];
        _.sortBy(attaches, function(attach) {
          var i = _.findIndex(priority, function(q) {
            return q === attach.type;
          });
          if (i !== -1) {
            return i;
          } else {
            return 0;
          }
        });

        return attaches[0];
      }

      service.getFailDescription = function(data) {
        var q;

        if (data.network === 'tw' && data.error && data.error.code && data.error.code === 187) {
          return "Статус повторяется";
        }

        if (data.network === 'fb') {
          if (data.data.error && data.data.error.code && data.data.error.code == 506) {
            return "Сообщение повторяется";
          }

           if (data.data.error && data.data.error.code && data.data.error.code == 1) {
            return "Нужно перепривязать аккаунт";
          }
        }

        if (data.network === 'ig') {
          if (data.error && data.error.code === 'notFull') {
            return "Необходимо прикрепить изображение"
          }
          if (data.error && data.error.code === 'notMedia') {
            return "Изображение не найдено, повторите загрузку"
          }
          if (data.error && data.error.code === 'notSquared') {
            return "Изображение не квадратное"
          }
        }

        return ((data.error) ? JSON.stringify(data.error) : 'не удалось определить');
      }

      service.configurePostInfo = function(channels, channel_ids) {
        var postInfo = [];
        _.forEach(channels, function(channel) {
          if (channel.disabled || channel.complete || channel.inprogress) return;

          if (!channel_ids || (channel_ids && _.indexOf(channel_ids, channel.id) !== -1)) {
            postInfo.push({
              channel_id: channel.id,
              text: channel.text,
              attachments: channel.attachments
            });
          }
        });
        return postInfo;
      }

      service.disableProgress = function(channels) {
        _.forEach(channels, function(channel) {
          channel.inprogress = false;
          channel.complete = false;
          channel.error = false;
        });
      }

      service.trackProgress = function(channels, info) {
        var q;
        _.forEach(info, function(_channel) {
          _.find(channels, function(channel) {
            return channel.id === _channel.channel_id;
          }).inprogress = true;
        });
      }

      service.getMaxTextLength = function(type, attachments, text) {
        switch (type) {
          case 'tw':
            {
              var lc = service.getLinksFromText(text);
              var len = __twitterConstants.maxSymbols;

              _.forEach(lc, function(link) {
                len += (link.length - __twitterConstants.linkLen);
              });

              if (attachments.length) {
                len -= __twitterConstants.mediaLen;
              }

              return len;
            }
          case 'ig':
            {
              return 2200;
            }
        }
        return 10000;
      }

      service.getLinksFromText = function(text) {
        text = text || '';
        var links = [];
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        text.replace(urlRegex, function(url) {
          links.push(url);
        });
        return links;
      }

      service.attachmentsLimitReached = function(network, channelsLenth) {
        switch (network) {
          case 'ig':
            {
              return channelsLenth >= 1;
              break;
            }
          case 'fb':
            {
              return channelsLenth >= 1;
              break;
            }
          case 'tw':
            {
              return channelsLenth >= 4;
              break;
            }
          case 'vk':
            {
              return channelsLenth >= 9;
              break;
            }
        }
      }

      service.unixTo = function(time, format) {
        return moment(time, 'X').format(format);
      }

      service.escapeRegex = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      }

      return service;
    }
  ]);

angular.module('vkTools', [])
  .service('S_vk', [
    '$q',
    '$http',
    'S_utils',
    function($q, $http, S_utils ) {
      var service = {};

      return service;
    }
  ]);

angular.module('App').controller('C_afterInstall', [
  '$scope',
  '$location',
  'S_vk',
  function($scope, $location, S_vk) {
    var ctr = this;


    return ctr;
  }
]);

angular.module('App').controller('C_login', [
  '$scope',
  'S_selfapi',
  function($scope, S_selfapi) {
    var ctr = this;


    

    ctr.email = ctr.password = '';

    ctr.auth = function(email, password) {
      ctr.authInProgress = true;
      ctr.error = false;
      S_selfapi.signIn(email, password).then(function(resp) {
        ctr.authInProgress = false;
        if (resp.data.success) {
          $scope.ctr.checkAuth();
        }

        if (resp.data.error) {
          ctr.error = true;
        }
      });
    }

    return ctr;
  }
]);

angular.module('App').controller('C_main',
  ["$scope", "$timeout", "S_utils", "S_selfapi", "S_eventer", "S_tour", function($scope, $timeout, S_utils, S_selfapi, S_eventer, S_tour) {
    var ctr = this;
    var _pushedMenu = false;

    track('main');
    ctr._state = 'post';

    ctr.showExtension = function() {
      return ctr._state;
    }

    /* enviroment */
    ctr.resizeIframe = function() {
      ctr.minState = !ctr.minState;
      S_eventer.sayToFrame('toggle');
    }

    ctr.closeIframe = function() {
      S_eventer.sayToFrame('close');
    }


    ctr.toggleMenu = function() {
      _pushedMenu = !_pushedMenu;
    }

    ctr.emptyChannels = function() {
      S_eventer.sendEvent('emptyChannels');
    }

    ctr.isPushed = function() {
      return _pushedMenu;
    }

    ctr.openTour = function() {
      S_tour.init(true);
    }


    $scope.$on('hideLoader', function() {
      ctr.hideLoader = true;
      track('end');
      S_tour.init();
    });
    $scope.$on('badLogin', function() {
      ctr._state = 'login';
    });


    $scope.$on('showSuccessProgress', function() {
      ctr.showSing = true;
      $timeout(function() {
        ctr.showSing = false;
      }, 2000);
    });





    return ctr;
  }]
);

angular.module('App').controller('C_posting',
  ["$scope", "$compile", "$timeout", "S_utils", "S_selfapi", "S_eventer", function($scope, $compile, $timeout, S_utils, S_selfapi, S_eventer) {
    var ctr = this;

    var _socketListeningId, skipPostingNowChange = false;

    ctr.sets = [];

    ctr.selectedSet = {};
    ctr.attachments = [];


    ctr.closeAfterSuccess = false;

    S_selfapi.getAllSets().then(function(resp) {
      if (resp.data.error) {
        S_eventer.sendEvent('badLogin');
        return;
      }
      ctr.sets = resp.data.data.own;

      ctr.sets = ctr.sets.concat(_.map(resp.data.data.guest, function(q) {
        q.guest = true;
        return q;
      }));

      ctr.selectedSet = ctr.sets[0];
    });

    $scope.$watch(function() {
      return ctr.selectedSet.id;
    }, function(setId) {
      if (!setId) return;

      ctr.channelsIsLoaded = false;
      ctr.allPostsComplete = false;
      ctr.postingCount = 0;
      ctr.channels = [];

      S_selfapi.getSetInfo(setId).then(function(resp) {
        ctr.channels = _.filter(resp.data.data, function(channel) {
          return !channel.disabled;
        });
        ctr.channelsIsLoaded = true;

        S_eventer.sendEvent('loadedDataFromArea', ctr.data);
      });
    });

    $scope.$on('emptyChannels', function() {
      ctr.allPostsComplete = false;
      S_utils.disableProgress(ctr.channels);
    });


    $scope.$on('loadedDataFromTab', function(event, data) {
      ctr.data = data;
      S_eventer.sendEvent('loadedDataFromArea', ctr.data);
      $timeout(function() {
        S_eventer.sendEvent('hideLoader');
      });
    });

    ctr.createPost = function(channel_ids) {
      var postInfo = S_utils.configurePostInfo(ctr.channels, channel_ids);
      ctr.postingCount = postInfo.length;
      ctr.postingInProgress = true;
      ctr.completePostsCount = 0;

      ctr.errorPostCount = 0;

      if (ctr.postingNow) {
        S_utils.trackProgress(ctr.channels, postInfo);
      }
      debugger
      return;
      S_selfapi.createPost(ctr.selectedSet.id, postInfo, _socketListeningId, ((!ctr.postingNow) ? moment(ctr.postingDate).format('X') : undefined)).then(function(resp) {
        var socketUrl = resp.data.data.socketUrl;
        _socketListeningId = resp.data.data.hash;

        var socket = io(socketUrl);

        socket.on('post_success', function(data) {
          var channel = _.find(ctr.channels, function(c) {
            return c.id === data.channel_id;
          });

          if (channel) {
            $scope.$apply(function() {
              ctr.completePostsCount++;
              channel.inprogress = false;
              channel.complete = true;
              channel.post_url = data.post_url;
              onChannelInfoRecieved();
            });
          }
        });

        socket.on('post_fail', function(data) {
          var channel = _.find(ctr.channels, function(c) {
            return c.id === data.channel_id;
          });

          if (channel) {
            $scope.$apply(function() {
              ctr.completePostsCount++;
              ctr.errorPostCount++;
              channel.inprogress = false;
              channel.error = true;
              channel.errorData = data;
              onChannelInfoRecieved();
            });
          }
        });

        socket.on('post_planned_success', function(data) {
          $scope.$apply(function() {
            ctr.postingInProgress = false;
            ctr.allPostsComplete = true;

            S_eventer.sendEvent('showSuccessProgress');
          });
        });
      });

      function onChannelInfoRecieved() {
        if (ctr.completePostsCount === ctr.postingCount) {
          if (ctr.errorPostCount) {
            ctr.postingInProgress = false;
            S_eventer.sendEvent('showSuccessProgress');
          } else {
            ctr.allPostsComplete = true;
            ctr.postingInProgress = false;
            S_eventer.sendEvent('showSuccessProgress');
            if (ctr.closeAfterSuccess) {
              $timeout(function() {
                S_eventer.sayToFrame('close');
              }, 2000);
            }
          }
        }
      }
    }

    ctr.showPostProcessingLayer = function() {
      return ctr.postingInProgress;
    }

    ctr.getProgressLineStyles = function() {
      var d = ctr.completePostsCount / ctr.postingCount;
      return {
        width: ((d * 100) + '%'),
        opacity: d
      }
    }

    ctr.showFooter = function() {
      return ctr.channelsIsLoaded && ctr.channels.length && !ctr.allPostsComplete;
    }

    ctr.postChannelAgain = function(channel_id) {
      ctr.createPost([channel_id]);
    }

    ctr.showSetSelect = function() {
      return ctr.sets.length > 1;
    }

    ctr.getChannelsCount = function(q) {
      return ((q) ? q.length : 0);
    }

    ctr.channelsPlural = {
      0: 'нет каналов',
      one: '{} канал',
      few: '{} канала',
      many: '{} каналов',
      other: '{} каналов'
    };


    ctr.minDate = new Date();
    ctr.postingDate = moment();
    ctr.postingNow = true;


    $scope.$watch(function() {
      return ctr.postingNow;
    }, function(q) {
      if (typeof q === 'undefined' || skipPostingNowChange) {
        skipPostingNowChange = false;
        return;
      }

      if (q === false) {
        ctr.postingDate = moment().add(3, 'hours').toDate();
      } else {
        $timeout(function() {
          ctr.postingDate = moment().toDate();
        }, 300);
      }
    });

    ctr.onTimeChange = function(time) {
      if (!ctr.postingDate) return;

      ctr.postingDate = moment(moment(ctr.postingDate).format('YYYYMMDD'),'YYYYMMDD').add(time, 'seconds').format()
    }

    ctr.canPost = function(){
      return (ctr.postingNow || (+moment(ctr.postingDate).format('X') > +moment().format('X')));
    }

    ctr.viewTable = function() {
      S_utils.showTablePopup(ctr.selectedSet.id).then(function(newDate) {
        skipPostingNowChange = true;
        ctr.postingDate = newDate.toDate();
        ctr.postingNow = false;
      });
    }

    return ctr;
  }]
);

/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*
*/ 
 
angular.module('ui.calendar', [])
  .constant('uiCalendarConfig', {calendars: {}})
  .controller('uiCalendarCtrl', ['$scope', 
                                 '$timeout', 
                                 '$locale', function(
                                  $scope, 
                                  $timeout, 
                                  $locale){

      var sourceSerialId = 1,
          eventSerialId = 1,
          sources = $scope.eventSources,
          extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop,

          wrapFunctionWithScopeApply = function(functionToWrap){
              var wrapper;

              if (functionToWrap){
                  wrapper = function(){
                      // This happens outside of angular context so we need to wrap it in a timeout which has an implied apply.
                      // In this way the function will be safely executed on the next digest.

                      var args = arguments;
                      var _this = this;
                      $timeout(function(){
                        functionToWrap.apply(_this, args);
                      });
                  };
              }

              return wrapper;
          };

      this.eventsFingerprint = function(e) {
        if (!e._id) {
          e._id = eventSerialId++;
        }
        // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
        return "" + e._id + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
          (e.allDay || '') + (e.className || '') + extraEventSignature(e) || '';
      };

      this.sourcesFingerprint = function(source) {
          return source.__id || (source.__id = sourceSerialId++);
      };

      this.allEvents = function() {
        // return sources.flatten(); but we don't have flatten
        var arraySources = [];
        for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
          var source = sources[i];
          if (angular.isArray(source)) {
            // event source as array
            arraySources.push(source);
          } else if(angular.isObject(source) && angular.isArray(source.events)){
            // event source as object, ie extended form
            var extEvent = {};
            for(var key in source){
              if(key !== '_uiCalId' && key !== 'events'){
                 extEvent[key] = source[key];
              }
            }
            for(var eI = 0;eI < source.events.length;eI++){
              angular.extend(source.events[eI],extEvent);
            }
            arraySources.push(source.events);
          }
        }

        return Array.prototype.concat.apply([], arraySources);
      };

      // Track changes in array by assigning id tokens to each element and watching the scope for changes in those tokens
      // arguments:
      //  arraySource array of function that returns array of objects to watch
      //  tokenFn function(object) that returns the token for a given object
      this.changeWatcher = function(arraySource, tokenFn) {
        var self;
        var getTokens = function() {
          var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
          var result = [], token, el;
          for (var i = 0, n = array.length; i < n; i++) {
            el = array[i];
            token = tokenFn(el);
            map[token] = el;
            result.push(token);
          }
          return result;
        };
        // returns elements in that are in a but not in b
        // subtractAsSets([4, 5, 6], [4, 5, 7]) => [6]
        var subtractAsSets = function(a, b) {
          var result = [], inB = {}, i, n;
          for (i = 0, n = b.length; i < n; i++) {
            inB[b[i]] = true;
          }
          for (i = 0, n = a.length; i < n; i++) {
            if (!inB[a[i]]) {
              result.push(a[i]);
            }
          }
          return result;
        };

        // Map objects to tokens and vice-versa
        var map = {};

        var applyChanges = function(newTokens, oldTokens) {
          var i, n, el, token;
          var replacedTokens = {};
          var removedTokens = subtractAsSets(oldTokens, newTokens);
          for (i = 0, n = removedTokens.length; i < n; i++) {
            var removedToken = removedTokens[i];
            el = map[removedToken];
            delete map[removedToken];
            var newToken = tokenFn(el);
            // if the element wasn't removed but simply got a new token, its old token will be different from the current one
            if (newToken === removedToken) {
              self.onRemoved(el);
            } else {
              replacedTokens[newToken] = removedToken;
              self.onChanged(el);
            }
          }

          var addedTokens = subtractAsSets(newTokens, oldTokens);
          for (i = 0, n = addedTokens.length; i < n; i++) {
            token = addedTokens[i];
            el = map[token];
            if (!replacedTokens[token]) {
              self.onAdded(el);
            }
          }
        };
        return self = {
          subscribe: function(scope, onChanged) {
            scope.$watch(getTokens, function(newTokens, oldTokens) {
              if (!onChanged || onChanged(newTokens, oldTokens) !== false) {
                applyChanges(newTokens, oldTokens);
              }
            }, true);
          },
          onAdded: angular.noop,
          onChanged: angular.noop,
          onRemoved: angular.noop
        };
      };

      this.getFullCalendarConfig = function(calendarSettings, uiCalendarConfig){
          var config = {};

          angular.extend(config, uiCalendarConfig);
          angular.extend(config, calendarSettings);
         
          angular.forEach(config, function(value,key){
            if (typeof value === 'function'){
              config[key] = wrapFunctionWithScopeApply(config[key]);
            }
          });

          return config;
      };

    this.getLocaleConfig = function(fullCalendarConfig) {
      if (!fullCalendarConfig.lang || fullCalendarConfig.useNgLocale) {
        // Configure to use locale names by default
        var tValues = function(data) {
          // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
          var r, k;
          r = [];
          for (k in data) {
            r[k] = data[k];
          }
          return r;
        };
        var dtf = $locale.DATETIME_FORMATS;
        return {
          monthNames: tValues(dtf.MONTH),
          monthNamesShort: tValues(dtf.SHORTMONTH),
          dayNames: tValues(dtf.DAY),
          dayNamesShort: tValues(dtf.SHORTDAY)
        };
      }
      return {};
    };
  }])
  .directive('uiCalendar', ['uiCalendarConfig', function(uiCalendarConfig) {
    return {
      restrict: 'A',
      scope: {eventSources:'=ngModel',calendarWatchEvent: '&'},
      controller: 'uiCalendarCtrl',
      link: function(scope, elm, attrs, controller) {
  
        var sources = scope.eventSources,
            sourcesChanged = false,
            calendar,
            eventSourcesWatcher = controller.changeWatcher(sources, controller.sourcesFingerprint),
            eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventsFingerprint),
            options = null;

        function getOptions(){
          var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {},
              fullCalendarConfig;

          fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);

          var localeFullCalendarConfig = controller.getLocaleConfig(fullCalendarConfig);
          angular.extend(localeFullCalendarConfig, fullCalendarConfig);
          options = { eventSources: sources };
          angular.extend(options, localeFullCalendarConfig);
          //remove calendars from options
          options.calendars = null;

          var options2 = {};
          for(var o in options){
            if(o !== 'eventSources'){
              options2[o] = options[o];
            }
          }
          return JSON.stringify(options2);
        }

        scope.destroy = function(){
          if(calendar && calendar.fullCalendar){
            calendar.fullCalendar('destroy');
          }
          if(attrs.calendar) {
            calendar = uiCalendarConfig.calendars[attrs.calendar] = $(elm).html('');
          } else {
            calendar = $(elm).html('');
          }
        };

        scope.init = function(){
          calendar.fullCalendar(options);
        };

        eventSourcesWatcher.onAdded = function(source) {
            calendar.fullCalendar('addEventSource', source);
            sourcesChanged = true;
        };

        eventSourcesWatcher.onRemoved = function(source) {
          calendar.fullCalendar('removeEventSource', source);
          sourcesChanged = true;
        };

        eventsWatcher.onAdded = function(event) {
          calendar.fullCalendar('renderEvent', event);
        };

        eventsWatcher.onRemoved = function(event) {
          calendar.fullCalendar('removeEvents', function(e) { 
            return e._id === event._id;
          });
        };
 
        eventsWatcher.onChanged = function(event) {
          event._start = $.fullCalendar.moment(event.start);
          event._end = $.fullCalendar.moment(event.end);
          calendar.fullCalendar('updateEvent', event);
        };

        eventSourcesWatcher.subscribe(scope);
        eventsWatcher.subscribe(scope, function(newTokens, oldTokens) {
          if (sourcesChanged === true) {
            sourcesChanged = false;
            // prevent incremental updates in this case
            return false;
          }
        });

        scope.$watch(getOptions, function(newO,oldO){
            scope.destroy();
            scope.init();
        });
      }
    };
}]);
(function replaceEmojiWithImages(root) {

  var REGIONAL_INDICATOR_A = parseInt("1f1e6", 16),
    REGIONAL_INDICATOR_Z = parseInt("1f1ff", 16),
    IMAGE_HOST = "assets.github.com",
    IMAGE_PATH = "/images/icons/emoji/unicode/",
    IMAGE_EXT = ".png";

  // String.fromCodePoint is super helpful
  if (!String.fromCodePoint) {
    /*!
     * ES6 Unicode Shims 0.1
     * (c) 2012 Steven Levithan <http://slevithan.com/>
     * MIT License
     **/
    String.fromCodePoint = function fromCodePoint() {
      var chars = [],
        point, offset, units, i;
      for (i = 0; i < arguments.length; ++i) {
        point = arguments[i];
        offset = point - 0x10000;
        units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
        chars.push(String.fromCharCode.apply(null, units));
      }
      return chars.join("");
    }
  }

  /**
   * Create a treewalker to walk an element and return an Array of Text Nodes.
   * This function is (hopefully) smart enough to exclude unwanted text nodes
   * like whitespace and script tags.
   * https://gist.github.com/mwunsch/4693383
   */
  function getLegitTextNodes(element) {
    if (!document.createTreeWalker) return [];

    var blacklist = ['SCRIPT', 'OPTION', 'TEXTAREA'],
      textNodes = [],
      walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        function excludeBlacklistedNodes(node) {
          if (blacklist.indexOf(node.parentElement.nodeName.toUpperCase()) >= 0) return NodeFilter.FILTER_REJECT;
          if (String.prototype.trim && !node.nodeValue.trim().length) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
        false
      );

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    return textNodes;
  }

  /**
   * Determine if this browser supports emoji.
   */
  function doesSupportEmoji() {
    var context, smiley;
    if (!document.createElement('canvas').getContext) return;
    context = document.createElement('canvas').getContext('2d');
    if (typeof context.fillText != 'function') return;
    smile = String.fromCodePoint(0x1F604); // :smile: String.fromCharCode(55357) + String.fromCharCode(56835)

    context.textBaseline = "top";
    context.font = "32px Arial";
    context.fillText(smile, 0, 0);
    return context.getImageData(16, 16, 1, 1).data[0] !== 0;
  }

  /**
   * For a UTF-16 (JavaScript's preferred encoding...kinda) surrogate pair,
   * return a Unicode codepoint.
   */
  function surrogatePairToCodepoint(lead, trail) {
    return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
  }

  /**
   * Get an Image element for an emoji codepoint (in hex).
   */
  function getImageForCodepoint(hex) {
    var img = document.createElement('IMG');
    
    img.src = "http://" + IMAGE_HOST + IMAGE_PATH + hex + IMAGE_EXT;
    img.className = "emoji";
    return img;
  }

  /**
   * Convert an HTML string into a DocumentFragment, for insertion into the dom.
   */
  function fragmentForString(htmlString) {
    var tmpDoc = document.createElement('DIV'),
      fragment = document.createDocumentFragment(),
      childNode;

    tmpDoc.innerHTML = htmlString;

    while (childNode = tmpDoc.firstChild) {
      fragment.appendChild(childNode);
    }
    return fragment;
  }

  /**
   * Iterate through a list of nodes, find emoji, replace with images.
   */
  function emojiReplace(nodes) {
    var PATTERN = /([\ud800-\udbff])([\udc00-\udfff])/g;

    nodes.forEach(function(node) {
      var replacement,
        value = node.nodeValue,
        matches = value.match(PATTERN);
 
      if (matches) {
        replacement = value.replace(PATTERN, function(match, p1, p2) {
          var codepoint = surrogatePairToCodepoint(p1.charCodeAt(0), p2.charCodeAt(0)),
            img = getImageForCodepoint(codepoint.toString(16));
          return img.outerHTML;
        });

        node.parentNode.replaceChild(fragmentForString(replacement), node);
      }
    });
  }


  function emojiReplaceText(value) {
    var PATTERN = /([\ud800-\udbff])([\udc00-\udfff])/g;

    var replacement,
      matches = value.match(PATTERN);

    if (matches) {
      replacement = value.replace(PATTERN, function(match, p1, p2) {
        var codepoint = surrogatePairToCodepoint(p1.charCodeAt(0), p2.charCodeAt(0)),
          img = getImageForCodepoint(codepoint.toString(16));
        return img.outerHTML;
      });
      value = replacement;
    }
    return value;
  }
 
  // Call everything we've defined
  //if (!doesSupportEmoji()) {
  //  emojiReplace(getLegitTextNodes(document.body));
  //}

  window.emojiParseInText = emojiReplaceText;

}(this));

if (!window['googleLT_']) {
  window['googleLT_'] = (new Date()).getTime();
}
if (!window['google']) {
  window['google'] = {};
}
if (!window['google']['loader']) {
  window['google']['loader'] = {};
  google.loader.ServiceBase = 'https://www.google.com/uds';
  google.loader.GoogleApisBase = 'http://ajax.googleapis.com/ajax';
  google.loader.ApiKey = 'AIzaSyA5m1Nc8ws2BbmPRwKu5gFradvD_hgq6G0';
  google.loader.KeyVerified = true;
  google.loader.LoadFailure = false;
  google.loader.Secure = false;
  google.loader.GoogleLocale = 'www.google.com';
  google.loader.ClientLocation = null;
  google.loader.AdditionalParams = '';
  (function() {
    var d = encodeURIComponent,
      g = window,
      h = document;

    function l(a, b) {
      return a.load = b
    }
    var m = "replace",
      n = "charAt",
      q = "getTime",
      r = "setTimeout",
      t = "push",
      u = "indexOf",
      v = "ServiceBase",
      w = "name",
      x = "length",
      y = "prototype",
      z = "loader",
      A = "substring",
      B = "join",
      C = "toLowerCase";

    function D(a) {
      return a in E ? E[a] : E[a] = -1 != navigator.userAgent[C]()[u](a)
    }
    var E = {};

    function F(a, b) {
      var c = function() {};
      c.prototype = b[y];
      a.U = b[y];
      a.prototype = new c
    }

    function G(a, b, c) {
      var e = Array[y].slice.call(arguments, 2) || [];
      return function() {
        return a.apply(b, e.concat(Array[y].slice.call(arguments)))
      }
    }

    function H(a) {
      a = Error(a);
      a.toString = function() {
        return this.message
      };
      return a
    }

    function I(a, b) {
      for (var c = a.split(/\./), e = g, f = 0; f < c[x] - 1; f++) e[c[f]] || (e[c[f]] = {}), e = e[c[f]];
      e[c[c[x] - 1]] = b
    }

    function J(a, b, c) {
      a[b] = c
    }
    if (!K) var K = I;
    if (!L) var L = J;
    google[z].v = {};
    K("google.loader.callbacks", google[z].v);
    var M = {},
      N = {};
    google[z].eval = {};
    K("google.loader.eval", google[z].eval);
    l(google, function(a, b, c) {
      function e(a) {
        var b = a.split(".");
        if (2 < b[x]) throw H("Module: '" + a + "' not found!");
        "undefined" != typeof b[1] && (f = b[0], c.packages = c.packages || [], c.packages[t](b[1]))
      }
      var f = a;
      c = c || {};
      if (a instanceof Array || a && "object" == typeof a && "function" == typeof a[B] && "function" == typeof a.reverse)
        for (var k = 0; k < a[x]; k++) e(a[k]);
      else e(a);
      if (a = M[":" + f]) {
        c && !c.language && c.locale && (c.language = c.locale);
        c && "string" == typeof c.callback && (k = c.callback, k.match(/^[[\]A-Za-z0-9._]+$/) && (k = g.eval(k), c.callback =
          k));
        if ((k = c && null != c.callback) && !a.s(b)) throw H("Module: '" + f + "' must be loaded before DOM onLoad!");
        k ? a.m(b, c) ? g[r](c.callback, 0) : a.load(b, c) : a.m(b, c) || a.load(b, c)
      } else throw H("Module: '" + f + "' not found!");
    });
    K("google.load", google.load);
    google.T = function(a, b) {
      b ? (0 == O[x] && (P(g, "load", Q), !D("msie") && !D("safari") && !D("konqueror") && D("mozilla") || g.opera ? g.addEventListener("DOMContentLoaded", Q, !1) : D("msie") ? h.write("<script defer onreadystatechange='google.loader.domReady()' src=//:>\x3c/script>") : (D("safari") || D("konqueror")) && g[r](S, 10)), O[t](a)) : P(g, "load", a)
    };
    K("google.setOnLoadCallback", google.T);

    function P(a, b, c) {
      if (a.addEventListener) a.addEventListener(b, c, !1);
      else if (a.attachEvent) a.attachEvent("on" + b, c);
      else {
        var e = a["on" + b];
        a["on" + b] = null != e ? aa([c, e]) : c
      }
    }

    function aa(a) {
      return function() {
        for (var b = 0; b < a[x]; b++) a[b]()
      }
    }
    var O = [];
    google[z].P = function() {
      var a = g.event.srcElement;
      "complete" == a.readyState && (a.onreadystatechange = null, a.parentNode.removeChild(a), Q())
    };
    K("google.loader.domReady", google[z].P);
    var ba = {
      loaded: !0,
      complete: !0
    };

    function S() {
      ba[h.readyState] ? Q() : 0 < O[x] && g[r](S, 10)
    }

    function Q() {
      for (var a = 0; a < O[x]; a++) O[a]();
      O.length = 0
    }
    google[z].d = function(a, b, c) {
      //TODO c must fe truthy, but taking false 
      c = true;
      if (c) {
        var e;
        "script" == a ? (e = h.createElement("script"), e.type = "text/javascript", e.src = b) : "css" == a && (e = h.createElement("link"), e.type = "text/css", e.href = b, e.rel = "stylesheet");
        (a = h.getElementsByTagName("head")[0]) || (a = h.body.parentNode.appendChild(h.createElement("head")));
        a.appendChild(e)
      } else "script" == a ? h.write('<script src="' + b + '" type="text/javascript">\x3c/script>') : "css" == a && h.write('<link href="' + b + '" type="text/css" rel="stylesheet"></link>')
    };
    K("google.loader.writeLoadTag", google[z].d);
    google[z].Q = function(a) {
      N = a
    };
    K("google.loader.rfm", google[z].Q);
    google[z].S = function(a) {
      for (var b in a) "string" == typeof b && b && ":" == b[n](0) && !M[b] && (M[b] = new T(b[A](1), a[b]))
    };
    K("google.loader.rpl", google[z].S);
    google[z].R = function(a) {
      if ((a = a.specs) && a[x])
        for (var b = 0; b < a[x]; ++b) {
          var c = a[b];
          "string" == typeof c ? M[":" + c] = new U(c) : (c = new V(c[w], c.baseSpec, c.customSpecs), M[":" + c[w]] = c)
        }
    };
    K("google.loader.rm", google[z].R);
    google[z].loaded = function(a) {
      M[":" + a.module].l(a)
    };
    K("google.loader.loaded", google[z].loaded);
    google[z].O = function() {
      return "qid=" + ((new Date)[q]().toString(16) + Math.floor(1E7 * Math.random()).toString(16))
    };
    K("google.loader.createGuidArg_", google[z].O);
    I("google_exportSymbol", I);
    I("google_exportProperty", J);
    google[z].a = {};
    K("google.loader.themes", google[z].a);
    google[z].a.I = "//www.google.com/cse/style/look/bubblegum.css";
    L(google[z].a, "BUBBLEGUM", google[z].a.I);
    google[z].a.K = "//www.google.com/cse/style/look/greensky.css";
    L(google[z].a, "GREENSKY", google[z].a.K);
    google[z].a.J = "//www.google.com/cse/style/look/espresso.css";
    L(google[z].a, "ESPRESSO", google[z].a.J);
    google[z].a.M = "//www.google.com/cse/style/look/shiny.css";
    L(google[z].a, "SHINY", google[z].a.M);
    google[z].a.L = "//www.google.com/cse/style/look/minimalist.css";
    L(google[z].a, "MINIMALIST", google[z].a.L);
    google[z].a.N = "//www.google.com/cse/style/look/v2/default.css";
    L(google[z].a, "V2_DEFAULT", google[z].a.N);

    function U(a) {
      this.b = a;
      this.o = [];
      this.n = {};
      this.e = {};
      this.f = {};
      this.j = !0;
      this.c = -1
    }
    U[y].g = function(a, b) {
      var c = "";
      void 0 != b && (void 0 != b.language && (c += "&hl=" + d(b.language)), void 0 != b.nocss && (c += "&output=" + d("nocss=" + b.nocss)), void 0 != b.nooldnames && (c += "&nooldnames=" + d(b.nooldnames)), void 0 != b.packages && (c += "&packages=" + d(b.packages)), null != b.callback && (c += "&async=2"), void 0 != b.style && (c += "&style=" + d(b.style)), void 0 != b.noexp && (c += "&noexp=true"), void 0 != b.other_params && (c += "&" + b.other_params));
      if (!this.j) {
        google[this.b] && google[this.b].JSHash && (c += "&sig=" + d(google[this.b].JSHash));
        var e = [],
          f;
        for (f in this.n) ":" == f[n](0) && e[t](f[A](1));
        for (f in this.e) ":" == f[n](0) && this.e[f] && e[t](f[A](1));
        c += "&have=" + d(e[B](","))
      }
      return google[z][v] + "/?file=" + this.b + "&v=" + a + google[z].AdditionalParams + c
    };
    U[y].t = function(a) {
      var b = null;
      a && (b = a.packages);
      var c = null;
      if (b)
        if ("string" == typeof b) c = [a.packages];
        else if (b[x])
        for (c = [], a = 0; a < b[x]; a++) "string" == typeof b[a] && c[t](b[a][m](/^\s*|\s*$/, "")[C]());
      c || (c = ["default"]);
      b = [];
      for (a = 0; a < c[x]; a++) this.n[":" + c[a]] || b[t](c[a]);
      return b
    };
    l(U[y], function(a, b) {
      var c = this.t(b),
        e = b && null != b.callback;
      if (e) var f = new W(b.callback);
      for (var k = [], p = c[x] - 1; 0 <= p; p--) {
        var s = c[p];
        e && f.B(s);
        if (this.e[":" + s]) c.splice(p, 1), e && this.f[":" + s][t](f);
        else k[t](s)
      }
      if (c[x]) {
        b && b.packages && (b.packages = c.sort()[B](","));
        for (p = 0; p < k[x]; p++) s = k[p], this.f[":" + s] = [], e && this.f[":" + s][t](f);
        if (b || null == N[":" + this.b] || null == N[":" + this.b].versions[":" + a] || google[z].AdditionalParams || !this.j) b && b.autoloaded || google[z].d("script", this.g(a, b), e);
        else {
          c = N[":" + this.b];
          google[this.b] = google[this.b] || {};
          for (var R in c.properties) R && ":" == R[n](0) && (google[this.b][R[A](1)] = c.properties[R]);
          google[z].d("script", google[z][v] + c.path + c.js, e);
          c.css && google[z].d("css", google[z][v] + c.path + c.css, e)
        }
        this.j && (this.j = !1, this.c = (new Date)[q](), 1 != this.c % 100 && (this.c = -1));
        for (p = 0; p < k[x]; p++) s = k[p], this.e[":" + s] = !0
      }
    });
    U[y].l = function(a) {
      -1 != this.c && (X("al_" + this.b, "jl." + ((new Date)[q]() - this.c), !0), this.c = -1);
      this.o = this.o.concat(a.components);
      google[z][this.b] || (google[z][this.b] = {});
      google[z][this.b].packages = this.o.slice(0);
      for (var b = 0; b < a.components[x]; b++) {
        this.n[":" + a.components[b]] = !0;
        this.e[":" + a.components[b]] = !1;
        var c = this.f[":" + a.components[b]];
        if (c) {
          for (var e = 0; e < c[x]; e++) c[e].C(a.components[b]);
          delete this.f[":" + a.components[b]]
        }
      }
    };
    U[y].m = function(a, b) {
      return 0 == this.t(b)[x]
    };
    U[y].s = function() {
      return !0
    };

    function W(a) {
      this.F = a;
      this.q = {};
      this.r = 0
    }
    W[y].B = function(a) {
      this.r++;
      this.q[":" + a] = !0
    };
    W[y].C = function(a) {
      this.q[":" + a] && (this.q[":" + a] = !1, this.r--, 0 == this.r && g[r](this.F, 0))
    };

    function V(a, b, c) {
      this.name = a;
      this.D = b;
      this.p = c;
      this.u = this.h = !1;
      this.k = [];
      google[z].v[this[w]] = G(this.l, this)
    }
    F(V, U);
    l(V[y], function(a, b) {
      var c = b && null != b.callback;
      c ? (this.k[t](b.callback), b.callback = "google.loader.callbacks." + this[w]) : this.h = !0;
      b && b.autoloaded || google[z].d("script", this.g(a, b), c)
    });
    V[y].m = function(a, b) {
      return b && null != b.callback ? this.u : this.h
    };
    V[y].l = function() {
      this.u = !0;
      for (var a = 0; a < this.k[x]; a++) g[r](this.k[a], 0);
      this.k = []
    };
    var Y = function(a, b) {
      return a.string ? d(a.string) + "=" + d(b) : a.regex ? b[m](/(^.*$)/, a.regex) : ""
    };
    V[y].g = function(a, b) {
      return this.G(this.w(a), a, b)
    };
    V[y].G = function(a, b, c) {
      var e = "";
      a.key && (e += "&" + Y(a.key, google[z].ApiKey));
      a.version && (e += "&" + Y(a.version, b));
      b = google[z].Secure && a.ssl ? a.ssl : a.uri;
      if (null != c)
        for (var f in c) a.params[f] ? e += "&" + Y(a.params[f], c[f]) : "other_params" == f ? e += "&" + c[f] : "base_domain" == f && (b = "http://" + c[f] + a.uri[A](a.uri[u]("/", 7)));
      google[this[w]] = {}; - 1 == b[u]("?") && e && (e = "?" + e[A](1));
      return b + e
    };
    V[y].s = function(a) {
      return this.w(a).deferred
    };
    V[y].w = function(a) {
      if (this.p)
        for (var b = 0; b < this.p[x]; ++b) {
          var c = this.p[b];
          if ((new RegExp(c.pattern)).test(a)) return c
        }
      return this.D
    };

    function T(a, b) {
      this.b = a;
      this.i = b;
      this.h = !1
    }
    F(T, U);
    l(T[y], function(a, b) {
      this.h = !0;
      google[z].d("script", this.g(a, b), !1)
    });
    T[y].m = function() {
      return this.h
    };
    T[y].l = function() {};
    T[y].g = function(a, b) {
      if (!this.i.versions[":" + a]) {
        if (this.i.aliases) {
          var c = this.i.aliases[":" + a];
          c && (a = c)
        }
        if (!this.i.versions[":" + a]) throw H("Module: '" + this.b + "' with version '" + a + "' not found!");
      }
      return google[z].GoogleApisBase + "/libs/" + this.b + "/" + a + "/" + this.i.versions[":" + a][b && b.uncompressed ? "uncompressed" : "compressed"]
    };
    T[y].s = function() {
      return !1
    };
    var ca = !1,
      Z = [],
      da = (new Date)[q](),
      fa = function() {
        ca || (P(g, "unload", ea), ca = !0)
      },
      ga = function(a, b) {
        fa();
        if (!(google[z].Secure || google[z].Options && !1 !== google[z].Options.csi)) {
          for (var c = 0; c < a[x]; c++) a[c] = d(a[c][C]()[m](/[^a-z0-9_.]+/g, "_"));
          for (c = 0; c < b[x]; c++) b[c] = d(b[c][C]()[m](/[^a-z0-9_.]+/g, "_"));
          g[r](G($, null, "//gg.google.com/csi?s=uds&v=2&action=" + a[B](",") + "&it=" + b[B](",")), 1E4)
        }
      },
      X = function(a, b, c) {
        c ? ga([a], [b]) : (fa(), Z[t]("r" + Z[x] + "=" + d(a + (b ? "|" + b : ""))), g[r](ea, 5 < Z[x] ? 0 : 15E3))
      },
      ea = function() {
        if (Z[x]) {
          var a =
            google[z][v];
          0 == a[u]("http:") && (a = a[m](/^http:/, "https:"));
          $(a + "/stats?" + Z[B]("&") + "&nc=" + (new Date)[q]() + "_" + ((new Date)[q]() - da));
          Z.length = 0
        }
      },
      $ = function(a) {
        var b = new Image,
          c = $.H++;
        $.A[c] = b;
        b.onload = b.onerror = function() {
          delete $.A[c]
        };
        b.src = a;
        b = null
      };
    $.A = {};
    $.H = 0;
    I("google.loader.recordCsiStat", ga);
    I("google.loader.recordStat", X);
    I("google.loader.createImageForLogging", $);

  })();
  google.loader.rm({
    "specs": [{
      "name": "books",
      "baseSpec": {
        "uri": "http://books.google.com/books/api.js",
        "ssl": "https://encrypted.google.com/books/api.js",
        "key": {
          "string": "key"
        },
        "version": {
          "string": "v"
        },
        "deferred": true,
        "params": {
          "callback": {
            "string": "callback"
          },
          "language": {
            "string": "hl"
          }
        }
      }
    }, "feeds", {
      "name": "friendconnect",
      "baseSpec": {
        "uri": "http://www.google.com/friendconnect/script/friendconnect.js",
        "ssl": "https://www.google.com/friendconnect/script/friendconnect.js",
        "key": {
          "string": "key"
        },
        "version": {
          "string": "v"
        },
        "deferred": false,
        "params": {}
      }
    }, "spreadsheets", "identitytoolkit", "gdata", "ima", "visualization", {
      "name": "sharing",
      "baseSpec": {
        "uri": "http://www.google.com/s2/sharing/js",
        "ssl": null,
        "key": {
          "string": "key"
        },
        "version": {
          "string": "v"
        },
        "deferred": false,
        "params": {
          "language": {
            "string": "hl"
          }
        }
      }
    }, {
      "name": "maps",
      "baseSpec": {
        "uri": "http://maps.google.com/maps?file\u003dgoogleapi",
        "ssl": "https://maps-api-ssl.google.com/maps?file\u003dgoogleapi",
        "key": {
          "string": "key"
        },
        "version": {
          "string": "v"
        },
        "deferred": true,
        "params": {
          "callback": {
            "regex": "callback\u003d$1\u0026async\u003d2"
          },
          "language": {
            "string": "hl"
          }
        }
      },
      "customSpecs": [{
        "uri": "http://maps.googleapis.com/maps/api/js",
        "ssl": "https://maps.googleapis.com/maps/api/js",
        "version": {
          "string": "v"
        },
        "deferred": true,
        "params": {
          "callback": {
            "string": "callback"
          },
          "language": {
            "string": "hl"
          }
        },
        "pattern": "^(3|3..*)$"
      }]
    }, "search", "annotations_v2", "payments", "wave", "orkut", {
      "name": "annotations",
      "baseSpec": {
        "uri": "http://www.google.com/reviews/scripts/annotations_bootstrap.js",
        "ssl": null,
        "key": {
          "string": "key"
        },
        "version": {
          "string": "v"
        },
        "deferred": true,
        "params": {
          "callback": {
            "string": "callback"
          },
          "language": {
            "string": "hl"
          },
          "country": {
            "string": "gl"
          }
        }
      }
    }, "language", "earth", "picker", "ads", "elements"]
  });
  google.loader.rfm({
    ":search": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/search/1.0/23952f7483f1bca4119a89c020d13def/",
      "js": "default+ru.I.js",
      "css": "default+ru.css",
      "properties": {
        ":JSHash": "23952f7483f1bca4119a89c020d13def",
        ":NoOldNames": false,
        ":Version": "1.0"
      }
    },
    ":language": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/language/1.0/7b15944f20c0d2d7b2d2d87406a8916b/",
      "js": "default+ru.I.js",
      "properties": {
        ":JSHash": "7b15944f20c0d2d7b2d2d87406a8916b",
        ":Version": "1.0"
      }
    },
    ":feeds": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/feeds/1.0/482f2817cdf8982edf2e5669f9e3a627/",
      "js": "default+ru.I.js",
      "css": "default+ru.css",
      "properties": {
        ":JSHash": "482f2817cdf8982edf2e5669f9e3a627",
        ":Version": "1.0"
      }
    },
    ":spreadsheets": {
      "versions": {
        ":0": "1",
        ":0.4": "1"
      },
      "path": "/api/spreadsheets/0.4/87ff7219e9f8a8164006cbf28d5e911a/",
      "js": "default.I.js",
      "properties": {
        ":JSHash": "87ff7219e9f8a8164006cbf28d5e911a",
        ":Version": "0.4"
      }
    },
    ":ima": {
      "versions": {
        ":3": "1",
        ":3.0": "1"
      },
      "path": "/api/ima/3.0/28a914332232c9a8ac0ae8da68b1006e/",
      "js": "default.I.js",
      "properties": {
        ":JSHash": "28a914332232c9a8ac0ae8da68b1006e",
        ":Version": "3.0"
      }
    },
    ":wave": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/wave/1.0/3b6f7573ff78da6602dda5e09c9025bf/",
      "js": "default.I.js",
      "properties": {
        ":JSHash": "3b6f7573ff78da6602dda5e09c9025bf",
        ":Version": "1.0"
      }
    },
    ":earth": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/earth/1.0/db22e5693e0a8de1f62f3536f5a8d7d3/",
      "js": "default.I.js",
      "properties": {
        ":JSHash": "db22e5693e0a8de1f62f3536f5a8d7d3",
        ":Version": "1.0"
      }
    },
    ":annotations": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/annotations/1.0/ee29f1a32c343fea662c6e1b58ec6d0d/",
      "js": "default+ru.I.js",
      "properties": {
        ":JSHash": "ee29f1a32c343fea662c6e1b58ec6d0d",
        ":Version": "1.0"
      }
    },
    ":picker": {
      "versions": {
        ":1": "1",
        ":1.0": "1"
      },
      "path": "/api/picker/1.0/1c635e91b9d0c082c660a42091913907/",
      "js": "default.I.js",
      "css": "default.css",
      "properties": {
        ":JSHash": "1c635e91b9d0c082c660a42091913907",
        ":Version": "1.0"
      }
    }
  });
  google.loader.rpl({
    ":scriptaculous": {
      "versions": {
        ":1.8.3": {
          "uncompressed": "scriptaculous.js",
          "compressed": "scriptaculous.js"
        },
        ":1.9.0": {
          "uncompressed": "scriptaculous.js",
          "compressed": "scriptaculous.js"
        },
        ":1.8.2": {
          "uncompressed": "scriptaculous.js",
          "compressed": "scriptaculous.js"
        },
        ":1.8.1": {
          "uncompressed": "scriptaculous.js",
          "compressed": "scriptaculous.js"
        }
      },
      "aliases": {
        ":1.8": "1.8.3",
        ":1": "1.9.0",
        ":1.9": "1.9.0"
      }
    },
    ":yui": {
      "versions": {
        ":2.6.0": {
          "uncompressed": "build/yuiloader/yuiloader.js",
          "compressed": "build/yuiloader/yuiloader-min.js"
        },
        ":2.9.0": {
          "uncompressed": "build/yuiloader/yuiloader.js",
          "compressed": "build/yuiloader/yuiloader-min.js"
        },
        ":2.7.0": {
          "uncompressed": "build/yuiloader/yuiloader.js",
          "compressed": "build/yuiloader/yuiloader-min.js"
        },
        ":2.8.0r4": {
          "uncompressed": "build/yuiloader/yuiloader.js",
          "compressed": "build/yuiloader/yuiloader-min.js"
        },
        ":2.8.2r1": {
          "uncompressed": "build/yuiloader/yuiloader.js",
          "compressed": "build/yuiloader/yuiloader-min.js"
        },
        ":2.8.1": {
          "uncompressed": "build/yuiloader/yuiloader.js",
          "compressed": "build/yuiloader/yuiloader-min.js"
        },
        ":3.3.0": {
          "uncompressed": "build/yui/yui.js",
          "compressed": "build/yui/yui-min.js"
        }
      },
      "aliases": {
        ":3": "3.3.0",
        ":2": "2.9.0",
        ":2.7": "2.7.0",
        ":2.8.2": "2.8.2r1",
        ":2.6": "2.6.0",
        ":2.9": "2.9.0",
        ":2.8": "2.8.2r1",
        ":2.8.0": "2.8.0r4",
        ":3.3": "3.3.0"
      }
    },
    ":swfobject": {
      "versions": {
        ":2.1": {
          "uncompressed": "swfobject_src.js",
          "compressed": "swfobject.js"
        },
        ":2.2": {
          "uncompressed": "swfobject_src.js",
          "compressed": "swfobject.js"
        }
      },
      "aliases": {
        ":2": "2.2"
      }
    },
    ":ext-core": {
      "versions": {
        ":3.1.0": {
          "uncompressed": "ext-core-debug.js",
          "compressed": "ext-core.js"
        },
        ":3.0.0": {
          "uncompressed": "ext-core-debug.js",
          "compressed": "ext-core.js"
        }
      },
      "aliases": {
        ":3": "3.1.0",
        ":3.0": "3.0.0",
        ":3.1": "3.1.0"
      }
    },
    ":webfont": {
      "versions": {
        ":1.0.28": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.27": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.29": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.12": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.13": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.14": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.15": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.10": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.11": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.2": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.1": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.0": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.6": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.19": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.5": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.18": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.4": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.17": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.16": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.3": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.9": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.21": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.22": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.25": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.26": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.23": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        },
        ":1.0.24": {
          "uncompressed": "webfont_debug.js",
          "compressed": "webfont.js"
        }
      },
      "aliases": {
        ":1": "1.0.29",
        ":1.0": "1.0.29"
      }
    },
    ":mootools": {
      "versions": {
        ":1.3.1": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.1.1": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.3.0": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.3.2": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.1.2": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.2.3": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.2.4": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.2.1": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.2.2": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.2.5": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.4.0": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.4.1": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        },
        ":1.4.2": {
          "uncompressed": "mootools.js",
          "compressed": "mootools-yui-compressed.js"
        }
      },
      "aliases": {
        ":1": "1.1.2",
        ":1.11": "1.1.1",
        ":1.4": "1.4.2",
        ":1.3": "1.3.2",
        ":1.2": "1.2.5",
        ":1.1": "1.1.2"
      }
    },
    ":jqueryui": {
      "versions": {
        ":1.6.0": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.0": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.2": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.1": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.9": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.15": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.14": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.7": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.13": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.8": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.12": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.7.2": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.5": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.11": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.7.3": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.10": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.6": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.7.0": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.7.1": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.4": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.5.3": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.5.2": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.17": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        },
        ":1.8.16": {
          "uncompressed": "jquery-ui.js",
          "compressed": "jquery-ui.min.js"
        }
      },
      "aliases": {
        ":1.8": "1.8.17",
        ":1.7": "1.7.3",
        ":1.6": "1.6.0",
        ":1": "1.8.17",
        ":1.5": "1.5.3",
        ":1.8.3": "1.8.4"
      }
    },
    ":chrome-frame": {
      "versions": {
        ":1.0.2": {
          "uncompressed": "CFInstall.js",
          "compressed": "CFInstall.min.js"
        },
        ":1.0.1": {
          "uncompressed": "CFInstall.js",
          "compressed": "CFInstall.min.js"
        },
        ":1.0.0": {
          "uncompressed": "CFInstall.js",
          "compressed": "CFInstall.min.js"
        }
      },
      "aliases": {
        ":1": "1.0.2",
        ":1.0": "1.0.2"
      }
    },
    ":dojo": {
      "versions": {
        ":1.3.1": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.6.1": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.3.0": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.1.1": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.3.2": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.6.0": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.2.3": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.7.2": {
          "uncompressed": "dojo/dojo.js.uncompressed.js",
          "compressed": "dojo/dojo.js"
        },
        ":1.7.0": {
          "uncompressed": "dojo/dojo.js.uncompressed.js",
          "compressed": "dojo/dojo.js"
        },
        ":1.7.1": {
          "uncompressed": "dojo/dojo.js.uncompressed.js",
          "compressed": "dojo/dojo.js"
        },
        ":1.4.3": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.5.1": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.5.0": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.2.0": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.4.0": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        },
        ":1.4.1": {
          "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
          "compressed": "dojo/dojo.xd.js"
        }
      },
      "aliases": {
        ":1.7": "1.7.2",
        ":1": "1.6.1",
        ":1.6": "1.6.1",
        ":1.5": "1.5.1",
        ":1.4": "1.4.3",
        ":1.3": "1.3.2",
        ":1.2": "1.2.3",
        ":1.1": "1.1.1"
      }
    },
    ":jquery": {
      "versions": {
        ":1.6.2": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.3.1": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.6.1": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.3.0": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.6.4": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.6.3": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.3.2": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.6.0": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.2.3": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.7.0": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.7.1": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.2.6": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.4.3": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.4.4": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.5.1": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.5.0": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.4.0": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.5.2": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.4.1": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        },
        ":1.4.2": {
          "uncompressed": "jquery.js",
          "compressed": "jquery.min.js"
        }
      },
      "aliases": {
        ":1.7": "1.7.1",
        ":1.6": "1.6.4",
        ":1": "1.7.1",
        ":1.5": "1.5.2",
        ":1.4": "1.4.4",
        ":1.3": "1.3.2",
        ":1.2": "1.2.6"
      }
    },
    ":prototype": {
      "versions": {
        ":1.7.0.0": {
          "uncompressed": "prototype.js",
          "compressed": "prototype.js"
        },
        ":1.6.0.2": {
          "uncompressed": "prototype.js",
          "compressed": "prototype.js"
        },
        ":1.6.1.0": {
          "uncompressed": "prototype.js",
          "compressed": "prototype.js"
        },
        ":1.6.0.3": {
          "uncompressed": "prototype.js",
          "compressed": "prototype.js"
        }
      },
      "aliases": {
        ":1.7": "1.7.0.0",
        ":1.6.1": "1.6.1.0",
        ":1": "1.7.0.0",
        ":1.6": "1.6.1.0",
        ":1.7.0": "1.7.0.0",
        ":1.6.0": "1.6.0.3"
      }
    }
  });
}

var VKS = function(_options) {
  var self = this;

  self.options = _options || {};

  self.default = {
    version: '5.26',
    language: 'ru'
  };

  self.request = function(_method, _params, _response) {
    var path = '/method/' + _method + '?' + 'access_token=' + self.token;
    _params['v'] = _params['v'] || self.options.version || self.default.version;
    _params['lang'] = _params['lang'] || self.options.language || self.default.language;

    for (var key in _params) {
      if (key === "message") {
        path += ('&' + key + '=' + encodeURIComponent(_params[key]));
      } else {
        path += ('&' + key + '=' + _params[key]);
      }
    }

    $.get('https://api.vk.com' + path, function(res) {
      if (typeof _response === 'function') {
        _response(res);
      }
    });
  };

  self.setToken = function(_param) {
    self.token = _param.token;
  };

  self.getToken = function() {
    return self.token;
  };
};

angular.module('App').controller('CD_attachPoll', [
  '$scope',
  'S_vk',
  'S_selfapi',
  'S_chrome',
  '__maxPollVariants',
  function($scope, S_vk, S_selfapi, S_chrome, __maxPollVariants) {
    var ctr = this;

    ctr.poll = $scope.poll;

    ctr.poll.variants = [{
      index: 0,
      text: ''
    }, {
      index: 1,
      text: ''
    }];

    ctr.createNewVariant = function(index) {
      if (index === ctr.poll.variants.length - 1 && index < __maxPollVariants - 2) {
        ctr.poll.variants.push({
          index: index+1,
          text: ''
        });
      }
    }

    ctr.removeVariant = function(variant){
      _.remove(ctr.poll.variants,variant);
    }

    ctr.removeIsEnabled = function(index){
      return (index > 2 || ctr.poll.variants.length > 2);
    }

    ctr.removePoll = function(){
      $scope.destroy({
        attach: $scope.poll
      });
    }

    return ctr;
  }
]);

angular.module('App').controller('CD_channel',
  ["$scope", "$interpolate", "S_utils", "S_templater", function($scope, $interpolate, S_utils, S_templater) {
    var ctr = this;

    ctr.network = $scope.channel.network;
    ctr.screen_name = $scope.channel.screen_name;

    $scope.channel.attachments = [];

    ctr.selectedAttachments = [];
    ctr.uploadingAttaches = [];
    ctr.processingAttachments = [];
    ctr.pageAttachments = [];

    $scope.$on('loadedDataFromArea', function(event, data) {
      parseData(data);
    });

    $scope.$on('emptyChannels', function(event, data) {
      ctr.data = {};
      ctr.text = '';
      $scope.channel.text = '';

      $scope.channel.attachments.length = 0;
    });

    $scope.$on('trigger:templateChanged', function() {
      parseData(ctr.data);
    });


    if ($scope.pageData) {
      parseData($scope.pageData);
    }

    function parseData(data) {
      ctr.data = data;

      if (data.imageSrc && data.imageSrc !== '') {
        data.images.unshift({
          src: data.imageSrc,
          big_src: data.imageSrc
        });
      }

      var images = _.map(data.images, function(q) {
        q.type = 'image';
        q.id = S_utils.getRandomString(16);
        return q;
      });
      if (images.length) {
        $scope.pageAttachments = $scope.channel.attachments.concat(images);
        $scope.channel.attachments.length = 0;
        $scope.channel.attachments.push(images[0]);
      }

      $scope.channel.text = $interpolate(S_templater.getTemplate())(ctr.data);
      console.log('new text')
    }

    ctr.isComplete = function() {
      return $scope.channel.complete;
    }

    ctr.isFail = function() {
      return $scope.channel.error;
    }

    ctr.attachItem = function(type) {
      switch (type) {
        case 'image':
          {
            S_utils.callAttachPhotoDialog($scope.pageAttachments, {
              before: ctr.pushUploadingAttach,
              after: ctr.afterImageUploaded
            }).then(function(resp) {

              $scope.channel.attachments = S_utils.sortAttachments(_.uniq($scope.channel.attachments.concat(resp), 'id'));
            });
            break;
          }
        case 'video':
          {
            S_utils.callAttachVideoDialog(ctr.selectedGroup.id).then(function(resp) {
              var video = S_utils.wrapVideo(resp[0]);
              $scope.channel.attachments = S_utils.sortAttachments($scope.channel.attachments.concat(video));
            });
            break;
          }
        case 'poll':
          {
            var poll = S_utils.createEmptyPoll();
            $scope.channel.attachments = S_utils.sortAttachments($scope.channel.attachments.concat(poll));
            break;
          }
      }
    }



    ctr.pushUploadingAttach = function() {
      var obj = {
        src: '/images/nophoto.jpg',
        type: 'image',
        processing: true,
        id: S_utils.getRandomString(16)
      };

      $scope.$apply(function() {
        $scope.channel.attachments.push(obj);
        ctr.uploadingAttaches.push(obj);
        ctr.processingAttachments.push(obj);
      });
      return obj;
    }

    ctr.afterImageUploaded = function(resp, id) {
      var attach = ctr.uploadingAttaches.shift();
      var image = S_utils.convertUploadedPhotoToAttach(resp.data.media_id, resp.data.media_url, resp.data.info);
      $scope.$apply(function() {
        _.extend(attach, image);
        ctr.processingAttachments.shift();
      });
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

    ctr.toggleVisibility = function(channel) {
      channel.disabled = !channel.disabled;
    }

    ctr.attachmentsLimitReached = function(network) {
      return S_utils.attachmentsLimitReached(network, $scope.channel.attachments.length);
    }

    ctr.showActions = function(channel) {
      return !channel.inprogress && !channel.error && !channel.complete;
    }

    ctr.showProgress = function(channel) {
      return channel.inprogress;
    }

    return ctr;
  }]
);

angular.module('App').controller('CD_instagramArea', [
  '$scope',

  function($scope, S_vk, S_selfapi, S_chrome, __maxPollVariants) {
    var ctr = this;


    return ctr;
  }
]);
 
angular.module('App').controller('CD_photobankSearch', [
  '$scope',
  'S_google',
  'S_utils',
  function($scope, S_google, S_utils) {
    var ctr = this;

    var _fanciedImage, _fancyBoxObject;
    ctr.attachments = [];
    ctr.selectedAttachments = [];
    ctr.processingImages = []; 

    ctr.aboutSearchText = '<div style="width:300px">Например, ты хочешь найти <b>борщ</b>. Какие запросы ты можешь задать: <b>борщ</b>, <b>украинский борщ</b>, <b>борщ с бараниной</b>, <b>розовый борщ</b>, <b>шутка про борщ</b>, <b>борщ на природе</b>, <b>борщ с пампушками</b>. И все эти запросы приведут тебя к разным изображениям.<br><br>Формируй запросы правильно и все будет хорошо!</div>';

    ctr.page = 0;

    ctr.search = function(q) {
      if (q === '') {
        return
      }

      S_google.loadImages(q).then(function(resp) {
        var images = _.map(resp.results, function(q) {
          return S_utils.convertGoogleImageToAttach(q);
        });
        ctr.attachments = images;
      });
    }

    return ctr;
  }
]);

angular.module('App').controller('CD_socialTemplateEditor',
  ["$scope", "S_templater", function($scope, S_templater) {
    var ctr = this;

    ctr.data = {};

    ctr.template = S_templater.getTemplate();

    $scope.$on('loadedDataFromTab', function(event, data) {
      ctr.data = data;
    });


    ctr.setTemplate = function(){
      S_templater.setTemplate(ctr.template);
    }

    ctr.getVar = function(q) {
      if (ctr.data[q]) {
        return ctr.data[q];
      } else {
        return '[нет значения]';
      }
    }

    return ctr;
  }]
);
 
angular.module('App').controller('CD_sourceLink', [
  '$scope',
  'S_vk',
  'S_selfapi', 
  'S_chrome',
  '__maxPollVariants',
  function($scope, S_vk, S_selfapi, S_chrome, __maxPollVariants) {
    var ctr = this;
  

    return ctr;
  }
]);

angular.module('App').controller('CM_attachPhoto', [
  '$scope',
  'S_vk',
  'S_selfapi',
  'S_chrome',
  '$modalInstance',
  'pageAttachments',
  'uploadCallbacks',
  function($scope, S_vk, S_selfapi, S_chrome, $modalInstance, pageAttachments, uploadCallbacks) {
    var ctr = this;

    ctr.selectedAttachments = [];

    ctr.pageAttachments = pageAttachments;

    ctr.imagesPlurals = {
      0: '{} фотографий',
      one: '{} фотографию',
      few: '{} фотографии',
      many: '{} фотографий',
      other: '{} фотографий'
    };


    ctr.closeDialog = function() {
      $modalInstance.close(ctr.selectedAttachments);
    }

    ctr.sendAttach = function(attach){
      ctr.selectedAttachments = [attach];
      ctr.closeDialog();
    }

    ctr.beforeUploading = function(q,w,e,r){
      uploadCallbacks.before(q,w,e,r);
      ctr.closeDialog();
    }

    ctr.afterUploading = function(q,w,e,r){
      uploadCallbacks.after(q,w,e,r);
    }

    return ctr;
  }
]);

angular.module('App').controller('CM_attachVideo', [
  '$scope',
  'S_vk',
  'S_selfapi',
  'S_utils',
  '$modalInstance',
  'group_id',
  function($scope, S_vk, S_selfapi, S_utils, $modalInstance, group_id) {
    var ctr = this;

    ctr.hd = true;
    ctr.adult = true;
    ctr.sort = 2;

    ctr.selectedAttachments = [];

    ctr.closeDialog = function() {
      $modalInstance.close(ctr.selectedAttachments);
    }

    ctr.selectVideo = function(attach) {
      ctr.selectedAttachments = [attach];
      ctr.closeDialog();
    }


    ctr.search = function() {
      if (!ctr.q || ctr.q === '') {
        return;
      }
      ctr.searchInProgress = true;
      S_vk.request('video.search', {
        q: ctr.q,
        adult: (ctr.adult) ? 0 : 1,
        hd: (ctr.hd) ? 1 : 0,
        sort: ctr.sort
      }).then(function(resp) {
        ctr.searchedVideos = resp.response.items;
        ctr.searchInProgress = false;
      });
    }


    ctr.loadUserVideos = function(){
      ctr.loadUserVideosInProgress = true;
      S_vk.request('video.get', {
        width: 320
      }).then(function(resp) {
        ctr.userVideos = resp.response.items;
        ctr.loadUserVideosInProgress = false;
      });
    }

    ctr.loadGroupVideos = function(){
      ctr.groupSearchError = undefined;
      ctr.loadGroupVideosInProgress = true;
      S_vk.request('video.get', {
        width: 320,
        owner_id: '-'+group_id
      }).then(function(resp) {
        ctr.loadGroupVideosInProgress = false;
        if (resp.error){
          if (resp.error.error_code === 15){
            ctr.groupSearchError = 'Видеозаписи группы заблокированы или отсутствуют';
            return;
          }

          ctr.groupSearchError = 'Ошибка при получении видозаписей';
        } else {
          ctr.groupVideos = resp.response.items;
        }
      });
    }


    ctr.getVideoQuality = function(video) {
      return S_utils.getVideoQuality(video);
    }

    return ctr;
  }
]);

angular.module('App').controller('CM_table',
  ["$scope", "$compile", "$timeout", "$modalInstance", "S_selfapi", "setId", function($scope, $compile, $timeout, $modalInstance, S_selfapi, setId) {
    var ctr = this;


    $scope.eventSources = [];

    $scope.eventMouseover = function(date, jsEvent, view) {
      console.log(date);
    };

    $scope.eventRender = function(event, element, view) {
      console.log(event.start.format());
      element.attr({
        'tooltip': event.title.replace('\n', ' '),
        'tooltip-append-to-body': true,
        'tooltip-placement': 'left',
        'tooltip-trigger': 'mouseenter',
        'tooltip-animation': false
      });
      $compile(element.parent())($scope.$new());
    };



    $scope.uiConfig = {
      calendar: {

        height: 550,
        editable: false,
        header: {
          left: 'today prev,next',
          center: 'title',
          right: 'month,agenda10Days,agendaWeek,agenda3Days'
        },
        dayNames: ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        eventMouseover: $scope.eventMouseover,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        viewRender: function(view) {

        },
        slotEventOverlap: false,
        timeFormat: 'h:mm',
        columnFormat: {
          day: 'dddd',
          week: 'ddd, D MMMM',
          month: 'ddd'
        },
        allDaySlot: false,
        slotDuration: '00:30:00',
        timeFormat: 'H(:mm)',
        defaultTimedEventDuration: '00:30:00',
        eventLimit: true, // for all non-agenda views
        scrollTime: '09:00:00',
        views: {
          month: {

          },
          agenda10Days: {
            type: 'agenda',
            duration: {
              days: 10
            },
            buttonText: '10 дней',
            columnFormat: 'ddd, DD MMM'
          },
          agenda3Days: {
            type: 'agenda',
            duration: {
              days: 3
            },
            buttonText: '3 дня',
            columnFormat: 'ddd, D MMMM'
          }
        },
        timezone: 'local',
        dayClick: function(date, jsEvent, view) {
          if (view.name === 'month') {
            view.calendar.changeView('agenda3Days');
            view.calendar.gotoDate(date.add(-1, 'days'));
          } else {
            $modalInstance.close(date);
          }
        }
      }
    };


    $timeout(function() {
      $scope.eventSources.push(function(start, end, timezone, callback) {
        var from = start.utc().format('X');
        var to = end.utc().format('X');

        S_selfapi.getTable(from, to, setId).then(function(resp) {
          callback(resp.data.data.table);
        });
      })

    })

    return ctr;
  }]
);

angular.module('App').controller('CM_videoPlayer', [
  '$scope',
  '$sce',
  'videoSrc',
  'title',
  function($scope, $sce, videoSrc, title) {
    var ctr = this;

    ctr.videoSrc = $sce.trustAsResourceUrl(videoSrc);
    ctr.title = title;

    return ctr;
  }
]);
