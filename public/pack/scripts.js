var App = angular.module('App', [
  'LocalStorageModule',
  'config',
  'chromeTools',
  'ngSanitize',
  'ngAnimate',
  'utilsTools',
  'colorpicker.module',
  'ui.bootstrap',
  'ui.select',
  'ui.calendar',
  'templates'
]);  
    
App.config(
  ["$httpProvider", "$animateProvider", function($httpProvider, $animateProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];


    $animateProvider.classNameFilter(/angular-animate/);
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf8';
  }]
);

angular.module('config', [])
  .constant('__api', {
    baseUrl: 'https://10hands.io/api/',
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
      getTable: 'table',
      start: 'extension/start'
    }
  })
  .constant('__postMessagePrepend', 'Ejiw9494WvweejgreWCEGHeeE_FF_')
  .constant('__maxPollVariants', 10)
  .constant('__maxAttachments', 9)
  .constant('__maxImageWidth', 800)
  .constant('__showPaymentRequsetSecs', 24*3600*10)
  .constant('__twitterConstants',{
    maxSymbols: 140,
    linkLen: 22,
    mediaLen: 23 
  })
App.run(
  ["$rootScope", "S_chrome", "S_google", "S_selfapi", function($rootScope, S_chrome, S_google, S_selfapi) {

    /*Highcharts.setOptions({
      global: {
        //timezoneOffset: moment().zone(),
        useUTC: false
      },
      lang: { 
        shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      }
    });*/

    S_chrome.pageDataWatch();

    S_google.init();




  }]
);

angular.module('App')
  .service('S_transport',
    ["$rootScope", "S_eventer", function($rootScope, S_eventer) {
      var service = {};

      var dataFromTab; 

      $rootScope.$on('loadedDataFromTab', function(event, data) {
        dataFromTab = data;
        service.emitData();
      });

      service.emitData = function(){
        S_eventer.sendEvent('loadedDataFromArea', dataFromTab);
      }

      return service; 
    }]
  );

angular.module('App').controller('C_afterInstall',
  ["$scope", "$location", function($scope, $location) {
    var ctr = this;


    return ctr;
  }]
);

angular.module('App').controller('C_login',
  ["$scope", "S_selfapi", "S_eventer", function($scope, S_selfapi, S_eventer) {
    var ctr = this;




    ctr.email = ctr.password = '';

    ctr.auth = function(email, password) {
      ctr.authInProgress = true;
      ctr.error = false;
      S_selfapi.signIn(email, password).then(function(resp) {
        ctr.authInProgress = false;
        S_eventer.sendEvent('successLogin');
      }, function() {
        ctr.authInProgress = false;
        ctr.error = true;
      });
    }

    return ctr;
  }]
);

angular.module('App').controller('C_main',
  ["$scope", "$timeout", "S_utils", "S_selfapi", "S_eventer", "S_tour", "S_transport", "__showPaymentRequsetSecs", function($scope, $timeout, S_utils, S_selfapi, S_eventer, S_tour, S_transport, __showPaymentRequsetSecs) {
    var ctr = this;
    var _pushedMenu = false;

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


    $scope.$on('paidUntilRecieved', function(event, time) {
      var now = +moment().format('X');
      if (now + __showPaymentRequsetSecs > time){
        if (now > time){
          ctr.paidUntilStr = 'истекла '+moment(time, "X").fromNow();
        } else {
          ctr.paidUntilStr = 'истечет '+moment(time, "X").fromNow();
        }
      }
    });   

    $scope.$on('paymentRequired', function(event, time) {
      ctr._state = 'payment';
      ctr.hideLoader = true;
    });   


    $scope.$on('hideLoader', function() {
      ctr.hideLoader = true;
      S_tour.init();
    });
    $scope.$on('tourStart', function() {
      $timeout(function() {
        ctr.showBlock = true;
      });
    });
    $scope.$on('tourEnd', function() {
      $timeout(function() {
        ctr.showBlock = false;
      })
    });

    $scope.$on('badLogin', function() {
      ctr._state = 'login';
      ctr.hideLoader = true;
    });


    $scope.$on('showSuccessProgress', function() {
      ctr.showSing = true;
      $timeout(function() {
        ctr.showSing = false;
      }, 2000);
    });

    $scope.$on('successLogin', function() {
      ctr._state = 'post';
      $timeout(function() {
        S_transport.emitData();
      }, 200);
    });





    return ctr;
  }]
);

angular.module('App').controller('C_payment',
  ["$scope", "S_selfapi", "S_eventer", function($scope, S_selfapi, S_eventer) {
    var ctr = this;
 


    return ctr;
  }]
);

angular.module('App').controller('C_posting',
  ["$scope", "$compile", "$timeout", "S_utils", "S_selfapi", "S_eventer", function($scope, $compile, $timeout, S_utils, S_selfapi, S_eventer) {
    var ctr = this;

    var _socketListeningId, skipPostingNowChange = false;



    ctr.image = {};
    ctr.sets = [];


    ctr.selectedSet = {};
    ctr.attachments = [];


    ctr.closeAfterSuccess = false;

    S_selfapi.getStart().then(function(resp) {
      ctr.sets = resp.data.sets.own;

      ctr.sets = ctr.sets.concat(_.map(resp.data.sets.guest, function(q) {
        q.guest = true;
        return q;
      }));

      ctr.selectedSet = ctr.sets[0];
      ctr.channels = resp.data.channels;

      $scope.$watch(function() {
        return ctr.selectedSet.id;
      }, function(setId) {
        if (!setId) return;

        ctr.channelsIsLoaded = false;
        ctr.allPostsComplete = false;
        ctr.postingCount = 0;

        S_selfapi.getSetInfo(setId).then(function(resp) {
          ctr.channels = _.filter(resp.data, function(channel) {
            return !channel.disabled;
          });
          ctr.channelsIsLoaded = true;

          S_eventer.sendEvent('loadedDataFromArea', ctr.data);
        });
      });

      S_eventer.sendEvent('paidUntilRecieved', resp.data.paid_until);


    }, function(resp) {
      if (resp.status === 402) {
        S_eventer.sendEvent('paymentRequired');
      } else {
        S_eventer.sendEvent('badLogin');
      }
    });



    $scope.$on('emptyChannels', function() {
      ctr.allPostsComplete = false;
      S_utils.disableProgress(ctr.channels);
    });


    $scope.$on('loadedDataFromArea', function(event, data) {
      ctr.data = data;
      $timeout(function() {
        S_eventer.sendEvent('hideLoader');
      });
    });

    ctr.createPost = function(channel_ids) {
      if (typeof channel_ids !== 'undefined') {
        if (!_.isArray(channel_ids)) {
          channel_ids = [channel_ids];
        }
      }

      var postInfo = S_utils.configurePostInfo(ctr.channels, channel_ids, ctr.image);
      if (!postInfo.length) {
        return;
      }
      ctr.postingCount = postInfo.length;


      ctr.postingInProgress = true;
      ctr.completePostsCount = 0;

      ctr.errorPostCount = 0;

      if (ctr.postingNow) {
        S_utils.trackProgress(ctr.channels, postInfo);
      }


      S_selfapi.createPost(ctr.selectedSet.id, postInfo, _socketListeningId, ((!ctr.postingNow) ? moment(ctr.postingDate).format('X') : undefined)).then(function(resp) {
        var socketUrl = resp.data.socketUrl;
        _socketListeningId = resp.data.hash;

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
          });
        });
      }, function(resp) {
        if (resp.status === 402) {
          S_utils.showPaymentRequestModal(resp.data).then(function() {
            ctr.postingInProgress = false;
            S_utils.disableProgress(ctr.channels);
          });
        }
      });

      function onChannelInfoRecieved() {
        if (ctr.completePostsCount === ctr.postingCount) {
          if (ctr.errorPostCount) {
            ctr.postingInProgress = false;
          } else {
            ctr.allPostsComplete = true;
            ctr.postingInProgress = false;
            if (ctr.closeAfterSuccess) {
              $timeout(function() {
                S_eventer.sayToFrame('close');
              }, 0);
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
      return ctr.channelsIsLoaded && ctr.channels.length;
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

      ctr.postingDate = moment(moment(ctr.postingDate).format('YYYYMMDD'), 'YYYYMMDD').add(time, 'seconds').format()
    }

    ctr.canPost = function() {
      var q = _.find(ctr.channels, function(q) {
        return q.disabled !== true;
      });
      if (!q) {
        return false;
      }
      return (ctr.postingNow || (+moment(ctr.postingDate).format('X') > +moment().format('X')));
    }

    ctr.viewTable = function() {
      S_utils.showTablePopup(ctr.selectedSet.id).then(function(newDate) {
        skipPostingNowChange = true;
        ctr.postingDate = newDate.toDate();
        ctr.postingNow = false;
      });
    }

    ctr.return = function() {
      ctr.allPostsComplete = false;
      S_utils.disableProgress(ctr.channels);
    }

    return ctr;
  }]
);

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
      text: "=",
      image: "=",
      postChannelAgain: "&"
    },
    templateUrl: 'templates/directives/channel.html',
    controller: 'CD_channel as channel_ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 
angular.module('App').directive('channelLogo', [function() {
  return {
    scope:{
      channel: "=channelLogo"
    },
    templateUrl: 'templates/directives/channelLogo.html',
    controller: 'CD_channelLogo as ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 
angular.module('App').directive('colorBox', [function() {
  return {
    scope: {
      setValue: '=',
      model: '=',
      modelBind: '='
    },
    templateUrl: 'templates/directives/colorBox.html',
    link: function($scope, $element) {

    }, 
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;
 
      ctr.value = $scope.model;

      $scope.$watch(function() {
        return ctr.value;
      }, function(q) {
        if (!q) return;
        $scope.setValue($scope.modelBind, q);
      });
    }]
  }
}]);

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
    controller: ["$timeout", "$scope", "$interpolate", "$sce", function($timeout, $scope, $interpolate, $sce) {

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
    }],
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

angular.module('App').directive("disableAnimate", ["$animate", function($animate) {
  return function(scope, element) {
    $animate.enabled(false, element);
  };
}]);

angular.module('App').directive('editImageBorderOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/border.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;
    }]
  }
}]);

angular.module('App').directive('editImageColorOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/colorOption.html',
    link: function($scope, $element) { 

    }, 
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;

      ctr.value = $scope.model;

      $scope.$watch(function() {
        return ctr.value;
      }, function(q) {
        if (!q) return;
        $scope.setValue('color', q);
      });
    }]
  }
}]);

angular.module('App').directive('editImageFilterOption', ["S_utils", function(S_utils) {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/filter.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;

      ctr.collection = S_utils.getFilters();

      ctr.onFontchange = function(point) {
        $scope.setValue('filter', point.name);
      }

      ctr.getSelectPlaceholder = function(type) {
        return _.find(ctr.collection, function(q) {
          return $scope.model === q.name;
        }).title || 'Без фильтра';
      }
    }]
  }
}]);

angular.module('App').directive('editImageFontFamilyOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/fontFamilyOption.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;

      ctr.fontsCollection = [{
        "family": "PT Sans",
        "weight": 400
      }, {
        "family": "Poiret One",
        "weight": 400
      }, {
        "family": "Ubuntu",
        "weight": 400
      }, {
        "family": "Lobster",
        "weight": 400
      }, {
        "family": "Open Sans",
        "weight": 400
      }, {
        "family": "Roboto",
        "weight": 300
      }, {
        "family": "Open Sans Condensed",
        "weight": 400
      }, {
        "family": "Ledger",
        "weight": 400
      }, {
        "family": "Cuprum",
        "weight": 400
      }];

      ctr.onFontchange = function(font) {
        $scope.setValue('fontFamily', font.family);
        $scope.setValue('fontWeight', font.weight);
      }

      ctr.getFontStyle = function(font) {
        return {
          'font-family': font.family,
          'font-weight': font.weight
        }
      }

      ctr.getSelectPlaceholder = function(type) {
        return $scope.model;
      }
    }]
  }
}]);

angular.module('App').directive('editImageFontSizeOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/fontSizeOption.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;

      ctr.fontsCollection = [{
          "size": 10
        }, { 
          "size": 14
        }, {
          "size": 18
        }, {
          "size": 24
        }, {
          "size": 32
        }, {
          "size": 48
        }, {
          "size": 60
        }, {
          "size": 72
        }, {
          "size": 90
        }, {
          "size": 100
        }, {
          "size": 112
        }, {
          "size": 132
        }, {
          "size": 160
        }, {
          "size": 200
        }, {
          "size": 240
        }
      ];

      ctr.onFontchange = function(font) {
        $scope.setValue('fontSize', font.size);
      }

      ctr.getSelectPlaceholder = function(type) {
        return $scope.model;
      }
    }]
  }
}]);

angular.module('App').directive('editImageTextShadowOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/textShadowOption.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;
    }]
  }
}]);

angular.module('App').directive('editImageValignOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/valign.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;

      ctr.collection = [{
          "type": "top",
          "text":"Сверху"
        }, {
          "type": "middle",
          "text":"По центру"
        },{
          "type": "bottom", 
          "text":"Снизу"
        }
      ];

      ctr.onFontchange = function(point) {
        $scope.setValue('valign', point.type);
      }

      ctr.getSelectPlaceholder = function(type) {
        return _.find(ctr.collection, function(q){
          return $scope.model === q.type;
        }).text;
      }
    }]
  }
}]);

angular.module('App').directive('editingCanvas', ["$timeout", "S_eventer", "S_utils", "__maxImageWidth", function($timeout, S_eventer, S_utils, __maxImageWidth) {
  return {
    scope: {
      image: '=',
      text: '=',
      options: '='
    },
    template: '<div id="photoFilter" style="display:none;position: absolute;  width: 100%;height: 100%;"></div><canvas id="exportImage" style="position: absolute;left:-500px"></canvas>',
    link: function($scope, $element) {
      var _image, _areaWidth, _scale, _imgScale;
      var paperCollection = {};

      var _paper, _filteredImage = {};

      var options = $scope.options;

      var IDS = {
        canvas: "exportImage",
        img: "photoFilter"
      }

      var DOM = {
        canvas: $element.find('#' + IDS.canvas),
        img: $element.find('#' + IDS.img)
      }

      $scope.$on('saveImageRequest', function(text) {
        var q = _paper;

        var context = _filteredImage.canvas.getContext("webgl", {
          preserveDrawingBuffer: true
        });

        var img = new Image();


        img.onload = function() {
          fabric.Image.fromURL(this.src, function(img) {
            paperCollection.image = img;
            fullLock(img);
            img.scaleX = _imgScale;
            img.scaleY = _imgScale;

            _paper.add(img);
            img.bringForward();
            placeZindex();


            _paper.renderAll();

            var url = _paper.toDataURL({
              format: 'jpeg',
              quality: 0.8
            });

            var img = new Image();
            img.src = url;
            img.onload = function() {

              var canvas = document.createElement('canvas');

              canvas.width = this.width / multiple(1);
              canvas.height = this.height / multiple(1);
              if (canvas.width > __maxImageWidth) {
                canvas.height = canvas.height / canvas.width * __maxImageWidth;
                canvas.width = __maxImageWidth;
              }
              var ctx = canvas.getContext('2d');

              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              S_eventer.sendEvent('imageDataRecieved', canvas.toDataURL('image/jpeg', 1));
            }
          });



        }
        img.src = _filteredImage.canvas.toDataURL('image/png');

      });

      $scope.$watch('text', function(text) {
        if (typeof text === 'undefined' || !_image) return;

        $timeout(function() {
          placeText(options);
        });
      });

      $scope.$watch('options', function(opt, oldOpt) {
        if (typeof opt === 'undefined' || !_image) return;


        if (opt.fontFamily !== oldOpt.fontFamily) {
          $timeout(function() {
            placeText(opt);
          }, 300);
        }


        if (opt.canvas.border.color !== oldOpt.canvas.border.color || opt.canvas.border.width !== oldOpt.canvas.border.width || opt.canvas.borderInner.color !== oldOpt.canvas.borderInner.color || opt.canvas.borderInner.width !== oldOpt.canvas.borderInner.width) {
          drawBorder(opt);
        }

        if (opt.canvas.fillColor !== oldOpt.canvas.fillColor) {
          drawFill(opt);
        }


        if (opt.filter !== oldOpt.filter) {
          drawImage(opt);
        }

        $timeout(function() {
          placeText(opt);
        });
        $timeout(function() {
          placeZindex();
        });

        options = opt;

      }, true);

      $timeout(function() {

        _areaWidth = $element[0].clientWidth;

        var img = new Image();
        img.onload = function() {
          DOM.img.attr('src', this.src).show();
          options.originalImage = this.src;
          _image = this;
          draw();
          $timeout(function() {
            placeText(options);
            drawBorder(options);
            drawFill(options);
                    placeZindex();
          });

          var canvas = fx.canvas();

          _filteredImage.canvas = canvas;
          _filteredImage.texture = canvas.texture(this)

          window.q = _filteredImage;

          var scale = multiple(1);
          if (_image.width > __maxImageWidth) {
            scale /= _image.width / __maxImageWidth;
          }

          DOM.img.html($(canvas)).find('canvas').css({
            '-webkit-transform': 'scale(' + (scale) + ')',
            '-webkit-transform-origin': '0 0'
          });

          drawImage(options);

        }
        img.src = $scope.image.src_original || $scope.image.src_big;




      });

      function placeZindex() {
        paperCollection.canvasFill.bringToFront(200);
        paperCollection.text.bringToFront(500);
        paperCollection.canvasBorder.bringToFront(1000);
        paperCollection.canvasBorderInner.bringToFront(1000);
      }

      function draw() {
        var imageWidth = originalImageWidth = options.width = multiple(_image.width);
        var imageHeight = originalImageHeight = options.height = multiple(_image.height);


        if (imageWidth > multiple(__maxImageWidth)) {
          imageHeight = options.height = imageHeight / imageWidth * multiple(__maxImageWidth);
          imageWidth = options.width = multiple(__maxImageWidth);
        }

        _scale = _areaWidth / imageWidth;
        _paper = new fabric.Canvas(IDS.canvas, {
          selection: false
        });

        DOM.canvas.attr({
          width: imageWidth,
          height: imageHeight
        });

        $element.parent().height(imageHeight * _scale);

        _paper.setWidth(imageWidth);
        _paper.setHeight(imageHeight);

        _imgScale = multiple(1) / (originalImageWidth / options.width);

        setElementScale(_scale);
      }

      function drawImage(options) {
        if (!options.filter || options.filter === 'none') {
          _filteredImage.canvas.draw(_filteredImage.texture).update();
          return;
        }

        var filter = S_utils.getFilterByName(options.filter);

        var can = _filteredImage.canvas.draw(_filteredImage.texture);
        _.forEach(filter.info, function(val, key) {
          if (typeof can[key] === 'function') {
            if (_.isArray(!val)) {
              val = [val];
            }
            can[key].apply(can, val);
          }
        });
        can.update();
      }

      function drawBorder(options) {
        if (paperCollection.canvasBorder) {
          paperCollection.canvasBorder.remove();
        }
        var bopt = options.canvas.border;
        paperCollection.canvasBorder = new fabric.Rect({
          fill: 'transparent',
          stroke: bopt.color,
          strokeWidth: multiple(bopt.width),
          width: options.width - multiple(bopt.width),
          height: options.height - multiple(bopt.width)
        });
        fullLock(paperCollection.canvasBorder);
        _paper.add(paperCollection.canvasBorder);

        if (paperCollection.canvasBorderInner) {
          paperCollection.canvasBorderInner.remove();
        }
        var bopt = options.canvas.borderInner;
        var bMainoptWidth = multiple(options.canvas.border.width);
        var mWidth = multiple(bopt.width);
        paperCollection.canvasBorderInner = new fabric.Rect({
          fill: 'transparent',
          stroke: bopt.color,
          strokeWidth: mWidth,
          left: bMainoptWidth,
          top: bMainoptWidth,
          width: options.width - mWidth - bMainoptWidth * 2,
          height: options.height - mWidth - bMainoptWidth * 2
        });
        fullLock(paperCollection.canvasBorderInner);
        _paper.add(paperCollection.canvasBorderInner);

      }


      function drawFill(options) {
        if (paperCollection.canvasFill) {
          paperCollection.canvasFill.remove();
        }
        var bopt = options.canvas.border;
        paperCollection.canvasFill = new fabric.Rect({
          fill: options.canvas.fillColor,
          strokeWidth: 0,
          width: options.width,
          height: options.height
        });
        fullLock(paperCollection.canvasFill);
        _paper.add(paperCollection.canvasFill);
        _paper.renderAll();
      }

      function placeText(options) {
        if (paperCollection.text) {
          paperCollection.text.remove();
        }

        var tunePadding = multiple(options.canvas.padding);

        paperCollection.text = new fabric.Text($scope.text, {
          fontSize: multiple(options.fontSize),
          fontFamily: options.fontFamily,
          fontWeight: options.fontWeight,
          textAlign: 'center',
          fill: options.color,
          shadow: getShadowString(options),
          top: tunePadding,
          left: tunePadding,
          transparentCorners: false,
          fillRule: 'evenodd'
        });
        fullLock(paperCollection.text);


        var textWidth = options.width - tunePadding * 2;
        _paper.add(paperCollection.text);
        wrapCanvasText(paperCollection.text, _paper, textWidth);
        _paper.renderAll();
        alignText(paperCollection.text, options);
        _paper.renderAll();


        tunePosition(paperCollection.text, textWidth);
        _paper.renderAll();


      }


      function alignText(t, options) {
        var y = 0,
          textHeight = t.getBoundingRect().height;


        switch (options.valign) {
          case 'top':
            {
              y = multiple(options.canvas.padding);
              break;
            }
          case 'middle':
            {
              y = options.height / 2 - textHeight / 2;
              break
            }
          case 'bottom':
            {
              y = options.height - textHeight - multiple(options.canvas.padding);
              break
            }
        }
        t.top = y;
      }

      function getShadowString(opt, ignoreMult) {
        var ts = options.textShadow;
        ts.color = ts.color || '';
        var m = multiple(1);
        if (ignoreMult) {
          m = 1;
        }
        return ts.color + ' ' + m * ts.x + 'px ' + m * ts.y + 'px ' + m * ts.width + 'px';
      }

      function setElementScale(scale) {
        $element.css({
          '-webkit-transform': 'scale(' + scale + ')',
          'position': 'absolute'
        });

        ;
      }



      function wrapCanvasText(t, canvas, maxW, maxH, justify) {

        if (typeof maxH === "undefined") {
          maxH = 0;
        }
        var words = t.text.split(" ");
        var formatted = '';

        // This works only with monospace fonts
        justify = justify || 'left';

        // clear newlines
        var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
        // calc line height
        var lineHeight = new fabric.Text(sansBreaks, {
          fontFamily: t.fontFamily,
          fontSize: t.fontSize
        }).height;

        // adjust for vertical offset
        var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
        var context = canvas.getContext("2d");


        context.font = t.fontSize + "px " + t.fontFamily;
        var currentLine = '';
        var breakLineCount = 0;

        n = 0;
        while (n < words.length) {
          var isNewLine = currentLine == "";
          var testOverlap = currentLine + ' ' + words[n];

          // are we over width?
          var w = context.measureText(testOverlap).width;

          if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
          } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
              var wordOverlap = "";

              // test word length until its over maxW
              for (var i = 0; i < words[n].length; ++i) {

                wordOverlap += words[n].charAt(i);
                var withHypeh = wordOverlap + "-";

                if (context.measureText(withHypeh).width >= maxW) {
                  // add hyphen when splitting a word
                  withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                  // update current word with remainder
                  words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                  formatted += withHypeh; // add hypenated word
                  break;
                }
              }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
              currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
              currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
          }
          if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
          }
          n++;
        }

        if (currentLine != '') {
          while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

          while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

          formatted += currentLine + '\n';
          breakLineCount++;
          currentLine = "";
        }

        // get rid of empy newline at the end
        formatted = formatted.substr(0, formatted.length - 1);

        t.setText(formatted);
      }

      function tunePosition(t, width) {
        t.left = t.left + (width - t.currentWidth) / 2;
      }

      function fullLock(obj) {
        obj.selectable = false;
        obj.lockUniScaling = true;
        obj.lockMovementX = true;
        obj.lockMovementY = true;
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockRotation = true;
      }

      function multiple(q) {
        return q * window.devicePixelRatio;
      }


    }
  }
}]);

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

angular.module('App').directive('numberBox', [function() {
  return {
    scope: {
      setValue: '=',
      model: '=',
      modelBind: '='
    },
    templateUrl: 'templates/directives/numberBox.html',
    link: function($scope, $element) {

    }, 
    controllerAs: 'ctr',
    controller: ["$scope", function($scope) {
      var ctr = this;
 
      ctr.value = $scope.model;

      $scope.$watch(function() {
        return ctr.value;
      }, function(q) {
        if (!q) return;
        $scope.setValue($scope.modelBind, q);
      });
    }]
  }
}]);
  
angular.module('App').directive('oneChannel', [function() {
  return {
    scope:{
      channels: "=",
      pageData: "=",
      image: "=",
      postChannelAgain: "&"
    },
    templateUrl: 'templates/directives/oneChannel.html',
    controller: 'CD_oneChannel as ctr',
    link: function($scope, $element) { 
      
    }
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

angular.module('App').directive('textareaValidator',
  ["$timeout", "S_utils", function($timeout, S_utils) {
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

      service.getStart = function() {
        return $http({
          url: base + __api.paths.start,
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

      service.saveBase64Image = function(base64) {
        return $http({
          withCredentials: true,
          url: base + __api.paths.media,
          method: 'POST',
          data: {
            base64: base64
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
            media_id: resp.data.media_id,
            media_url: resp.data.media_url,
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
    ["localStorageService", "$timeout", "S_eventer", function(localStorageService, $timeout, S_eventer) {
      var service = {};

      var tour;

      var tourKeyName = 'tour.base';

      service.init = function(force) {

        var q = localStorageService.get(tourKeyName) || {};

        if (!force && q.complete) {
          return;
        }

        S_eventer.sendEvent('tourStart');

        tour = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: false
          }
        });

        tour.on('complete', function() {
          S_eventer.sendEvent('tourEnd');
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
        if ($('body').find('[data-step="image"]').length) {
          tour.addStep('step5', {
            text: 'Это изображение для записи, его можно поменять, отредактировать или написать на нем текст',
            attachTo: '[data-step="image"] top',
            buttons: [{
              text: 'Дальше',
              action: tour.next
            }]
          });
        }
        /*
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
        */
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




      service.getFilters = function() {
        return [{
          name: "none",
          title: "Без фильтра"
        }, {
          name: "bw",
          title: "ЧБ",
          info: {
            hueSaturation: [0, -1]
          }
        }, {
          name: "blur",
          title: "Blur",
          info: {
            triangleBlur: [25]
          }
        }, {
          name: "lensBlur",
          title: "Линза",
          info: {
            lensBlur: [15, 0.54, 3.141592653589793]
          }
        }, {
          name: "darkAround",
          title: "Dark Around",
          info: {
            brightnessContrast: [-0.2, -0.3],
            vignette: [0.01, 0.6]
          }
        }, {
          name: "dark",
          title: "Dark",
          info: {
            brightnessContrast: [-0.8, -0.9]
          }
        }, {
          name: "light",
          title: "Light",
          info: {
            brightnessContrast: [0.35, -0.3]
          }
        }];
      }

      service.getFilterByName = function(name) {
        return _.find(service.getFilters(), function(q) {
          return q.name === name;
        });
      }

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

      service.showInfoModal = function(title, html) {
        return $modal.open({
          templateUrl: 'templates/modals/infoModal.html',
          controller: 'CM_infoModal as ctr',
          size: 'sm',
          resolve: {
            html: function() {
              return html;
            },
            title: function() {
              return title;
            }
          }
        }).result;
      }

      service.showPaymentRequestModal = function(resp) {
        return $modal.open({
          templateUrl: 'templates/modals/paymentRequest.html',
          controller: 'CM_paymentRequest as ctr',
          size: 'sm',
          resolve: {
            resp: function() {
              return resp;
            }
          }
        }).result;
      }

      service.showEditImagePopup = function(image) {
        return $modal.open({
          templateUrl: 'templates/modals/editImage.html',
          controller: 'CM_editImage as ctr',
          size: 'lg',
          resolve: {
            image: function() {
              return image;
            }
          }
        }).result;
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

      service.configurePostInfo = function(channels, channel_ids, image) {
        var postInfo = [];
        _.forEach(channels, function(channel) {
          if (channel.disabled || channel.complete || channel.inprogress) return;

          if (!channel_ids || (channel_ids && _.indexOf(channel_ids, channel.id) !== -1)) {
            postInfo.push({
              channel_id: channel.id,
              text: channel.text,
              attachments: [image]
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
          q = _.find(channels, function(channel) {
            return channel.id === _channel.channel_id;
          });
          q.inprogress = true;
          q.error = false;
        });
      }

      service.getMaxTextLengthInChannels = function(channels, attachments, text) {
        var min = Infinity,
          q;
        _.forEach(channels, function(channel) {
          q = service.getMaxTextLength(channel.network, attachments, text);
          if (q < min) {
            min = q;
          }
        })
        return min;
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

              if (attachments || (attachments && attachments.length)) {
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

      service.attachmentsLimitReached = function(channelsLenth) {
        return channelsLenth >= 1;
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
/*
 * glfx.js
 * http://evanw.github.com/glfx.js/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */
var fx = function() {
  function q(a, d, c) {
    return Math.max(a, Math.min(d, c))
  }

  function getPixelArray() {
    var w = this._.texture.width;
    var h = this._.texture.height;
    var array = new Uint8Array(w * h * 4);
    this._.texture.drawTo(function() {
        a.readPixels(0, 0, w, h, a.RGBA, a.UNSIGNED_BYTE, array);
    });
    return array;
}

  function w(b) {
    return {
      _: b,
      loadContentsOf: function(b) {
        a = this._.gl;
        this._.loadContentsOf(b)
      },
      destroy: function() {
        a = this._.gl;
        this._.destroy()
      }
    }
  }

  function A(a) {
    return w(r.fromElement(a))
  }

  function B(b, d) {
    var c = a.UNSIGNED_BYTE;
    if (a.getExtension("OES_texture_float") && a.getExtension("OES_texture_float_linear")) {
      var e = new r(100, 100, a.RGBA, a.FLOAT);
      try {
        e.drawTo(function() {
          c = a.FLOAT
        })
      } catch (g) {}
      e.destroy()
    }
    this._.texture && this._.texture.destroy();
    this._.spareTexture && this._.spareTexture.destroy();
    this.width = b;
    this.height = d;
    this._.texture = new r(b, d, a.RGBA, c);
    this._.spareTexture = new r(b, d, a.RGBA, c);
    this._.extraTexture = this._.extraTexture || new r(0, 0, a.RGBA, c);
    this._.flippedShader = this._.flippedShader || new h(null, "uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,vec2(texCoord.x,1.0-texCoord.y));}");
    this._.isInitialized = !0
  }

  function C(a, d, c) {
    this._.isInitialized &&
      a._.width == this.width && a._.height == this.height || B.call(this, d ? d : a._.width, c ? c : a._.height);
    a._.use();
    this._.texture.drawTo(function() {
      h.getDefaultShader().drawRect()
    });
    return this
  }

  function D() {
    this._.texture.use();
    this._.flippedShader.drawRect();
    return this
  }

  function f(a, d, c, e) {
    (c || this._.texture).use();
    this._.spareTexture.drawTo(function() {
      a.uniforms(d).drawRect()
    });
    this._.spareTexture.swapWith(e || this._.texture)
  }

  function E(a) {
    a.parentNode.insertBefore(this, a);
    a.parentNode.removeChild(a);
    return this
  }

  function F() {
    var b = new r(this._.texture.width, this._.texture.height, a.RGBA, a.UNSIGNED_BYTE);
    this._.texture.use();
    b.drawTo(function() {
      h.getDefaultShader().drawRect()
    });
    return w(b)
  }

  function G() {
    var b = this._.texture.width,
      d = this._.texture.height,
      c = new Uint8Array(4 * b * d);
    this._.texture.drawTo(function() {
      a.readPixels(0, 0, b, d, a.RGBA, a.UNSIGNED_BYTE, c)
    });
    return c
  }

  function k(b) {
    return function() {
      a = this._.gl;
      return b.apply(this, arguments)
    }
  }

  function x(a, d, c, e, g, l, n, p) {
    var m = c - g,
      h = e - l,
      f = n - g,
      k = p - l;
    g = a - c + g - n;
    l =
      d - e + l - p;
    var q = m * k - f * h,
      f = (g * k - f * l) / q,
      m = (m * l - g * h) / q;
    return [c - a + f * c, e - d + f * e, f, n - a + m * n, p - d + m * p, m, a, d, 1]
  }

  function y(a) {
    var d = a[0],
      c = a[1],
      e = a[2],
      g = a[3],
      l = a[4],
      n = a[5],
      p = a[6],
      m = a[7];
    a = a[8];
    var f = d * l * a - d * n * m - c * g * a + c * n * p + e * g * m - e * l * p;
    return [(l * a - n * m) / f, (e * m - c * a) / f, (c * n - e * l) / f, (n * p - g * a) / f, (d * a - e * p) / f, (e * g - d * n) / f, (g * m - l * p) / f, (c * p - d * m) / f, (d * l - c * g) / f]
  }

  function z(a) {
    var d = a.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];
    a.sort(function(a, b) {
      return a[0] - b[0]
    });
    for (var c = 0; c < d; c++) this.xa.push(a[c][0]), this.ya.push(a[c][1]);
    this.u[0] = 0;
    this.y2[0] = 0;
    for (c = 1; c < d - 1; ++c) {
      a = this.xa[c + 1] - this.xa[c - 1];
      var e = (this.xa[c] - this.xa[c - 1]) / a,
        g = e * this.y2[c - 1] + 2;
      this.y2[c] = (e - 1) / g;
      this.u[c] = (6 * ((this.ya[c + 1] - this.ya[c]) / (this.xa[c + 1] - this.xa[c]) - (this.ya[c] - this.ya[c - 1]) / (this.xa[c] - this.xa[c - 1])) / a - e * this.u[c - 1]) / g
    }
    this.y2[d - 1] = 0;
    for (c = d - 2; 0 <= c; --c) this.y2[c] = this.y2[c] * this.y2[c + 1] + this.u[c]
  }

  function u(a, d) {
    return new h(null, a + "uniform sampler2D texture;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 coord=texCoord*texSize;" +
      d + "gl_FragColor=texture2D(texture,coord/texSize);vec2 clampedCoord=clamp(coord,vec2(0.0),texSize);if(coord!=clampedCoord){gl_FragColor.a*=max(0.0,1.0-length(coord-clampedCoord));}}")
  }

  function H(b, d) {
    a.brightnessContrast = a.brightnessContrast || new h(null, "uniform sampler2D texture;uniform float brightness;uniform float contrast;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.rgb+=brightness;if(contrast>0.0){color.rgb=(color.rgb-0.5)/(1.0-contrast)+0.5;}else{color.rgb=(color.rgb-0.5)*(1.0+contrast)+0.5;}gl_FragColor=color;}");
    f.call(this, a.brightnessContrast, {
      brightness: q(-1, b, 1),
      contrast: q(-1, d, 1)
    });
    return this
  }

  function t(a) {
    a = new z(a);
    for (var d = [], c = 0; 256 > c; c++) d.push(q(0, Math.floor(256 * a.interpolate(c / 255)), 255));
    return d
  }

  function I(b, d, c) {
    b = t(b);
    1 == arguments.length ? d = c = b : (d = t(d), c = t(c));
    for (var e = [], g = 0; 256 > g; g++) e.splice(e.length, 0, b[g], d[g], c[g], 255);
    this._.extraTexture.initFromBytes(256, 1, e);
    this._.extraTexture.use(1);
    a.curves = a.curves || new h(null, "uniform sampler2D texture;uniform sampler2D map;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.r=texture2D(map,vec2(color.r)).r;color.g=texture2D(map,vec2(color.g)).g;color.b=texture2D(map,vec2(color.b)).b;gl_FragColor=color;}");
    a.curves.textures({
      map: 1
    });
    f.call(this, a.curves, {});
    return this
  }

  function J(b) {
    a.denoise = a.denoise || new h(null, "uniform sampler2D texture;uniform float exponent;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec4 center=texture2D(texture,texCoord);vec4 color=vec4(0.0);float total=0.0;for(float x=-4.0;x<=4.0;x+=1.0){for(float y=-4.0;y<=4.0;y+=1.0){vec4 sample=texture2D(texture,texCoord+vec2(x,y)/texSize);float weight=1.0-abs(dot(sample.rgb-center.rgb,vec3(0.25)));weight=pow(weight,exponent);color+=sample*weight;total+=weight;}}gl_FragColor=color/total;}");
    for (var d = 0; 2 > d; d++) f.call(this, a.denoise, {
      exponent: Math.max(0, b),
      texSize: [this.width, this.height]
    });
    return this
  }

  function K(b, d) {
    a.hueSaturation = a.hueSaturation || new h(null, "uniform sampler2D texture;uniform float hue;uniform float saturation;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float angle=hue*3.14159265;float s=sin(angle),c=cos(angle);vec3 weights=(vec3(2.0*c,-sqrt(3.0)*s-c,sqrt(3.0)*s-c)+1.0)/3.0;float len=length(color.rgb);color.rgb=vec3(dot(color.rgb,weights.xyz),dot(color.rgb,weights.zxy),dot(color.rgb,weights.yzx));float average=(color.r+color.g+color.b)/3.0;if(saturation>0.0){color.rgb+=(average-color.rgb)*(1.0-1.0/(1.001-saturation));}else{color.rgb+=(average-color.rgb)*(-saturation);}gl_FragColor=color;}");
    f.call(this, a.hueSaturation, {
      hue: q(-1, b, 1),
      saturation: q(-1, d, 1)
    });
    return this
  }

  function L(b) {
    a.noise = a.noise || new h(null, "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 color=texture2D(texture,texCoord);float diff=(rand(texCoord)-0.5)*amount;color.r+=diff;color.g+=diff;color.b+=diff;gl_FragColor=color;}");
    f.call(this, a.noise, {
      amount: q(0, b, 1)
    });
    return this
  }

  function M(b) {
    a.sepia = a.sepia || new h(null, "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float r=color.r;float g=color.g;float b=color.b;color.r=min(1.0,(r*(1.0-(0.607*amount)))+(g*(0.769*amount))+(b*(0.189*amount)));color.g=min(1.0,(r*0.349*amount)+(g*(1.0-(0.314*amount)))+(b*0.168*amount));color.b=min(1.0,(r*0.272*amount)+(g*0.534*amount)+(b*(1.0-(0.869*amount))));gl_FragColor=color;}");
    f.call(this, a.sepia, {
      amount: q(0, b, 1)
    });
    return this
  }

  function N(b, d) {
    a.unsharpMask = a.unsharpMask || new h(null, "uniform sampler2D blurredTexture;uniform sampler2D originalTexture;uniform float strength;uniform float threshold;varying vec2 texCoord;void main(){vec4 blurred=texture2D(blurredTexture,texCoord);vec4 original=texture2D(originalTexture,texCoord);gl_FragColor=mix(blurred,original,1.0+strength);}");
    this._.extraTexture.ensureFormat(this._.texture);
    this._.texture.use();
    this._.extraTexture.drawTo(function() {
      h.getDefaultShader().drawRect()
    });
    this._.extraTexture.use(1);
    this.triangleBlur(b);
    a.unsharpMask.textures({
      originalTexture: 1
    });
    f.call(this, a.unsharpMask, {
      strength: d
    });
    this._.extraTexture.unuse(1);
    return this
  }

  function O(b) {
    a.vibrance = a.vibrance || new h(null, "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;float mx=max(color.r,max(color.g,color.b));float amt=(mx-average)*(-amount*3.0);color.rgb=mix(color.rgb,vec3(mx),amt);gl_FragColor=color;}");
    f.call(this, a.vibrance, {
      amount: q(-1, b, 1)
    });
    return this
  }

  function P(b, d) {
    a.vignette = a.vignette || new h(null, "uniform sampler2D texture;uniform float size;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float dist=distance(texCoord,vec2(0.5,0.5));color.rgb*=smoothstep(0.8,size*0.799,dist*(amount+size));gl_FragColor=color;}");
    f.call(this, a.vignette, {
      size: q(0, b, 1),
      amount: q(0, d, 1)
    });
    return this
  }

  function Q(b, d, c) {
    a.lensBlurPrePass = a.lensBlurPrePass || new h(null, "uniform sampler2D texture;uniform float power;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color=pow(color,vec4(power));gl_FragColor=vec4(color);}");
    var e = "uniform sampler2D texture0;uniform sampler2D texture1;uniform vec2 delta0;uniform vec2 delta1;uniform float power;varying vec2 texCoord;" +
      s + "vec4 sample(vec2 delta){float offset=random(vec3(delta,151.7182),0.0);vec4 color=vec4(0.0);float total=0.0;for(float t=0.0;t<=30.0;t++){float percent=(t+offset)/30.0;color+=texture2D(texture0,texCoord+delta*percent);total+=1.0;}return color/total;}";
    a.lensBlur0 = a.lensBlur0 || new h(null, e + "void main(){gl_FragColor=sample(delta0);}");
    a.lensBlur1 = a.lensBlur1 || new h(null, e + "void main(){gl_FragColor=(sample(delta0)+sample(delta1))*0.5;}");
    a.lensBlur2 = a.lensBlur2 || (new h(null, e + "void main(){vec4 color=(sample(delta0)+2.0*texture2D(texture1,texCoord))/3.0;gl_FragColor=pow(color,vec4(power));}")).textures({
      texture1: 1
    });
    for (var e = [], g = 0; 3 > g; g++) {
      var l = c + 2 * g * Math.PI / 3;
      e.push([b * Math.sin(l) / this.width, b * Math.cos(l) / this.height])
    }
    b = Math.pow(10, q(-1, d, 1));
    f.call(this, a.lensBlurPrePass, {
      power: b
    });
    this._.extraTexture.ensureFormat(this._.texture);
    f.call(this, a.lensBlur0, {
      delta0: e[0]
    }, this._.texture, this._.extraTexture);
    f.call(this, a.lensBlur1, {
      delta0: e[1],
      delta1: e[2]
    }, this._.extraTexture, this._.extraTexture);
    f.call(this, a.lensBlur0, {
      delta0: e[1]
    });
    this._.extraTexture.use(1);
    f.call(this, a.lensBlur2, {
      power: 1 / b,
      delta0: e[2]
    });
    return this
  }

  function R(b, d, c, e, g, l) {
    a.tiltShift = a.tiltShift || new h(null, "uniform sampler2D texture;uniform float blurRadius;uniform float gradientRadius;uniform vec2 start;uniform vec2 end;uniform vec2 delta;uniform vec2 texSize;varying vec2 texCoord;" + s + "void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);vec2 normal=normalize(vec2(start.y-end.y,end.x-start.x));float radius=smoothstep(0.0,1.0,abs(dot(texCoord*texSize-start,normal))/gradientRadius)*blurRadius;for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta/texSize*percent*radius);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}");
    var n = c - b,
      p = e - d,
      m = Math.sqrt(n * n + p * p);
    f.call(this, a.tiltShift, {
      blurRadius: g,
      gradientRadius: l,
      start: [b, d],
      end: [c, e],
      delta: [n / m, p / m],
      texSize: [this.width, this.height]
    });
    f.call(this, a.tiltShift, {
      blurRadius: g,
      gradientRadius: l,
      start: [b, d],
      end: [c, e],
      delta: [-p / m, n / m],
      texSize: [this.width, this.height]
    });
    return this
  }

  function S(b) {
    a.triangleBlur = a.triangleBlur || new h(null, "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" + s + "void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta*percent);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}");
    f.call(this, a.triangleBlur, {
      delta: [b / this.width, 0]
    });
    f.call(this, a.triangleBlur, {
      delta: [0, b / this.height]
    });
    return this
  }

  function T(b, d, c) {
    a.zoomBlur = a.zoomBlur || new h(null, "uniform sampler2D texture;uniform vec2 center;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;" + s + "void main(){vec4 color=vec4(0.0);float total=0.0;vec2 toCenter=center-texCoord*texSize;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=0.0;t<=40.0;t++){float percent=(t+offset)/40.0;float weight=4.0*(percent-percent*percent);vec4 sample=texture2D(texture,texCoord+toCenter*percent*strength/texSize);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}");
    f.call(this, a.zoomBlur, {
      center: [b, d],
      strength: c,
      texSize: [this.width, this.height]
    });
    return this
  }

  function U(b, d, c, e) {
    a.colorHalftone = a.colorHalftone || new h(null, "uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(float angle){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);vec3 cmy=1.0-color.rgb;float k=min(cmy.x,min(cmy.y,cmy.z));cmy=(cmy-k)/(1.0-k);cmy=clamp(cmy*10.0-3.0+vec3(pattern(angle+0.26179),pattern(angle+1.30899),pattern(angle)),0.0,1.0);k=clamp(k*10.0-5.0+pattern(angle+0.78539),0.0,1.0);gl_FragColor=vec4(1.0-cmy-k,color.a);}");
    f.call(this, a.colorHalftone, {
      center: [b, d],
      angle: c,
      scale: Math.PI / e,
      texSize: [this.width, this.height]
    });
    return this
  }

  function V(b, d, c, e) {
    a.dotScreen = a.dotScreen || new h(null, "uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;gl_FragColor=vec4(vec3(average*10.0-5.0+pattern()),color.a);}");
    f.call(this, a.dotScreen, {
      center: [b, d],
      angle: c,
      scale: Math.PI / e,
      texSize: [this.width, this.height]
    });
    return this
  }

  function W(b) {
    a.edgeWork1 = a.edgeWork1 || new h(null, "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" + s + "void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec3 sample=texture2D(texture,texCoord+delta*percent).rgb;float average=(sample.r+sample.g+sample.b)/3.0;color.x+=average*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=average*weight;total.y+=weight;}}gl_FragColor=vec4(color/total,0.0,1.0);}");
    a.edgeWork2 = a.edgeWork2 || new h(null, "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" + s + "void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec2 sample=texture2D(texture,texCoord+delta*percent).xy;color.x+=sample.x*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=sample.y*weight;total.y+=weight;}}float c=clamp(10000.0*(color.y/total.y-color.x/total.x)+0.5,0.0,1.0);gl_FragColor=vec4(c,c,c,1.0);}");
    f.call(this, a.edgeWork1, {
      delta: [b / this.width, 0]
    });
    f.call(this, a.edgeWork2, {
      delta: [0, b / this.height]
    });
    return this
  }

  function X(b, d, c) {
    a.hexagonalPixelate = a.hexagonalPixelate || new h(null, "uniform sampler2D texture;uniform vec2 center;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 tex=(texCoord*texSize-center)/scale;tex.y/=0.866025404;tex.x-=tex.y*0.5;vec2 a;if(tex.x+tex.y-floor(tex.x)-floor(tex.y)<1.0)a=vec2(floor(tex.x),floor(tex.y));else a=vec2(ceil(tex.x),ceil(tex.y));vec2 b=vec2(ceil(tex.x),floor(tex.y));vec2 c=vec2(floor(tex.x),ceil(tex.y));vec3 TEX=vec3(tex.x,tex.y,1.0-tex.x-tex.y);vec3 A=vec3(a.x,a.y,1.0-a.x-a.y);vec3 B=vec3(b.x,b.y,1.0-b.x-b.y);vec3 C=vec3(c.x,c.y,1.0-c.x-c.y);float alen=length(TEX-A);float blen=length(TEX-B);float clen=length(TEX-C);vec2 choice;if(alen<blen){if(alen<clen)choice=a;else choice=c;}else{if(blen<clen)choice=b;else choice=c;}choice.x+=choice.y*0.5;choice.y*=0.866025404;choice*=scale/texSize;gl_FragColor=texture2D(texture,choice+center/texSize);}");
    f.call(this, a.hexagonalPixelate, {
      center: [b, d],
      scale: c,
      texSize: [this.width, this.height]
    });
    return this
  }

  function Y(b) {
    a.ink = a.ink || new h(null, "uniform sampler2D texture;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 dx=vec2(1.0/texSize.x,0.0);vec2 dy=vec2(0.0,1.0/texSize.y);vec4 color=texture2D(texture,texCoord);float bigTotal=0.0;float smallTotal=0.0;vec3 bigAverage=vec3(0.0);vec3 smallAverage=vec3(0.0);for(float x=-2.0;x<=2.0;x+=1.0){for(float y=-2.0;y<=2.0;y+=1.0){vec3 sample=texture2D(texture,texCoord+dx*x+dy*y).rgb;bigAverage+=sample;bigTotal+=1.0;if(abs(x)+abs(y)<2.0){smallAverage+=sample;smallTotal+=1.0;}}}vec3 edge=max(vec3(0.0),bigAverage/bigTotal-smallAverage/smallTotal);gl_FragColor=vec4(color.rgb-dot(edge,edge)*strength*100000.0,color.a);}");
    f.call(this, a.ink, {
      strength: b * b * b * b * b,
      texSize: [this.width, this.height]
    });
    return this
  }

  function Z(b, d, c, e) {
    a.bulgePinch = a.bulgePinch || u("uniform float radius;uniform float strength;uniform vec2 center;", "coord-=center;float distance=length(coord);if(distance<radius){float percent=distance/radius;if(strength>0.0){coord*=mix(1.0,smoothstep(0.0,radius/distance,percent),strength*0.75);}else{coord*=mix(1.0,pow(percent,1.0+strength*0.75)*radius/distance,1.0-percent);}}coord+=center;");
    f.call(this, a.bulgePinch, {
      radius: c,
      strength: q(-1, e, 1),
      center: [b, d],
      texSize: [this.width, this.height]
    });
    return this
  }

  function $(b, d, c) {
    a.matrixWarp = a.matrixWarp || u("uniform mat3 matrix;uniform bool useTextureSpace;", "if(useTextureSpace)coord=coord/texSize*2.0-1.0;vec3 warp=matrix*vec3(coord,1.0);coord=warp.xy/warp.z;if(useTextureSpace)coord=(coord*0.5+0.5)*texSize;");
    b = Array.prototype.concat.apply([], b);
    if (4 == b.length) b = [b[0], b[1], 0, b[2], b[3], 0, 0, 0, 1];
    else if (9 != b.length) throw "can only warp with 2x2 or 3x3 matrix";
    f.call(this, a.matrixWarp, {
      matrix: d ? y(b) : b,
      texSize: [this.width, this.height],
      useTextureSpace: c | 0
    });
    return this
  }

  function aa(a, d) {
    var c = x.apply(null, d),
      e = x.apply(null, a),
      c = y(c);
    return this.matrixWarp([c[0] * e[0] + c[1] * e[3] + c[2] * e[6], c[0] * e[1] + c[1] * e[4] + c[2] * e[7], c[0] * e[2] + c[1] * e[5] + c[2] * e[8], c[3] * e[0] + c[4] * e[3] + c[5] * e[6], c[3] * e[1] + c[4] * e[4] + c[5] * e[7], c[3] * e[2] + c[4] * e[5] + c[5] * e[8], c[6] * e[0] + c[7] * e[3] + c[8] * e[6],
      c[6] * e[1] + c[7] * e[4] + c[8] * e[7], c[6] * e[2] + c[7] * e[5] + c[8] * e[8]
    ])
  }

  function ba(b, d, c, e) {
    a.swirl = a.swirl || u("uniform float radius;uniform float angle;uniform vec2 center;", "coord-=center;float distance=length(coord);if(distance<radius){float percent=(radius-distance)/radius;float theta=percent*percent*angle;float s=sin(theta);float c=cos(theta);coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);}coord+=center;");
    f.call(this, a.swirl, {
      radius: c,
      center: [b, d],
      angle: e,
      texSize: [this.width, this.height]
    });
    return this
  }
  var v = {};
  (function() {
    function a(b) {
      if (!b.getExtension("OES_texture_float")) return !1;
      var c = b.createFramebuffer(),
        e = b.createTexture();
      b.bindTexture(b.TEXTURE_2D, e);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, 1, 1, 0, b.RGBA, b.UNSIGNED_BYTE, null);
      b.bindFramebuffer(b.FRAMEBUFFER, c);
      b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, e, 0);
      c = b.createTexture();
      b.bindTexture(b.TEXTURE_2D, c);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texImage2D(b.TEXTURE_2D,
        0, b.RGBA, 2, 2, 0, b.RGBA, b.FLOAT, new Float32Array([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
      var e = b.createProgram(),
        d = b.createShader(b.VERTEX_SHADER),
        g = b.createShader(b.FRAGMENT_SHADER);
      b.shaderSource(d, "attribute vec2 vertex;void main(){gl_Position=vec4(vertex,0.0,1.0);}");
      b.shaderSource(g, "uniform sampler2D texture;void main(){gl_FragColor=texture2D(texture,vec2(0.5));}");
      b.compileShader(d);
      b.compileShader(g);
      b.attachShader(e, d);
      b.attachShader(e,
        g);
      b.linkProgram(e);
      d = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, d);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array([0, 0]), b.STREAM_DRAW);
      b.enableVertexAttribArray(0);
      b.vertexAttribPointer(0, 2, b.FLOAT, !1, 0, 0);
      d = new Uint8Array(4);
      b.useProgram(e);
      b.viewport(0, 0, 1, 1);
      b.bindTexture(b.TEXTURE_2D, c);
      b.drawArrays(b.POINTS, 0, 1);
      b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, d);
      return 127 === d[0] || 128 === d[0]
    }

    function d() {}

    function c(a) {
      "OES_texture_float_linear" === a ? (void 0 === this.$OES_texture_float_linear$ && Object.defineProperty(this,
        "$OES_texture_float_linear$", {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: new d
        }), a = this.$OES_texture_float_linear$) : a = n.call(this, a);
      return a
    }

    function e() {
      var a = f.call(this); - 1 === a.indexOf("OES_texture_float_linear") && a.push("OES_texture_float_linear");
      return a
    }
    try {
      var g = document.createElement("canvas").getContext("experimental-webgl")
    } catch (l) {}
    if (g && -1 === g.getSupportedExtensions().indexOf("OES_texture_float_linear") && a(g)) {
      var n = WebGLRenderingContext.prototype.getExtension,
        f = WebGLRenderingContext.prototype.getSupportedExtensions;
      WebGLRenderingContext.prototype.getExtension = c;
      WebGLRenderingContext.prototype.getSupportedExtensions = e
    }
  })();
  var a;
  v.canvas = function() {
    var b = document.createElement("canvas");
    try {
      a = b.getContext("experimental-webgl", {
        premultipliedAlpha: !1
      })
    } catch (d) {
      a = null
    }
    if (!a) throw "This browser does not support WebGL";
    b._ = {
      gl: a,
      isInitialized: !1,
      texture: null,
      spareTexture: null,
      flippedShader: null
    };

    function toDataURL(mimeType) {
      var w = this._.texture.width;
      var h = this._.texture.height;
      var array = getPixelArray.call(this);
      var canvas2d = document.createElement('canvas');
      var c = canvas2d.getContext('2d');
      canvas2d.width = w;
      canvas2d.height = h;
      var data = c.createImageData(w, h);
      for (var i = 0; i < array.length; i++) {
        data.data[i] = array[i];
      }
      c.putImageData(data, 0, 0);
      return canvas2d.toDataURL(mimeType);
    }
    b.toDataURL = k(toDataURL);
    b.texture = k(A);
    b.draw = k(C);
    b.update = k(D);
    b.replace = k(E);
    b.contents = k(F);
    b.getPixelArray = k(G);
    b.brightnessContrast = k(H);
    b.hexagonalPixelate = k(X);
    b.hueSaturation = k(K);
    b.colorHalftone = k(U);
    b.triangleBlur = k(S);
    b.unsharpMask = k(N);
    b.perspective = k(aa);
    b.matrixWarp = k($);
    b.bulgePinch = k(Z);
    b.tiltShift = k(R);
    b.dotScreen = k(V);
    b.edgeWork = k(W);
    b.lensBlur = k(Q);
    b.zoomBlur = k(T);
    b.noise = k(L);
    b.denoise = k(J);
    b.curves = k(I);
    b.swirl = k(ba);
    b.ink = k(Y);
    b.vignette = k(P);
    b.vibrance = k(O);
    b.sepia = k(M);
    return b
  };
  v.splineInterpolate = t;
  var h = function() {
    function b(b, c) {
      var e = a.createShader(b);
      a.shaderSource(e, c);
      a.compileShader(e);
      if (!a.getShaderParameter(e,
          a.COMPILE_STATUS)) throw "compile error: " + a.getShaderInfoLog(e);
      return e
    }

    function d(d, l) {
      this.texCoordAttribute = this.vertexAttribute = null;
      this.program = a.createProgram();
      d = d || c;
      l = l || e;
      l = "precision highp float;" + l;
      a.attachShader(this.program, b(a.VERTEX_SHADER, d));
      a.attachShader(this.program, b(a.FRAGMENT_SHADER, l));
      a.linkProgram(this.program);
      if (!a.getProgramParameter(this.program, a.LINK_STATUS)) throw "link error: " + a.getProgramInfoLog(this.program);
    }
    var c = "attribute vec2 vertex;attribute vec2 _texCoord;varying vec2 texCoord;void main(){texCoord=_texCoord;gl_Position=vec4(vertex*2.0-1.0,0.0,1.0);}",
      e = "uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,texCoord);}";
    d.prototype.destroy = function() {
      a.deleteProgram(this.program);
      this.program = null
    };
    d.prototype.uniforms = function(b) {
      a.useProgram(this.program);
      for (var e in b)
        if (b.hasOwnProperty(e)) {
          var c = a.getUniformLocation(this.program, e);
          if (null !== c) {
            var d = b[e];
            if ("[object Array]" == Object.prototype.toString.call(d)) switch (d.length) {
                case 1:
                  a.uniform1fv(c, new Float32Array(d));
                  break;
                case 2:
                  a.uniform2fv(c, new Float32Array(d));
                  break;
                case 3:
                  a.uniform3fv(c, new Float32Array(d));
                  break;
                case 4:
                  a.uniform4fv(c, new Float32Array(d));
                  break;
                case 9:
                  a.uniformMatrix3fv(c, !1, new Float32Array(d));
                  break;
                case 16:
                  a.uniformMatrix4fv(c, !1, new Float32Array(d));
                  break;
                default:
                  throw "dont't know how to load uniform \"" + e + '" of length ' + d.length;
              } else if ("[object Number]" == Object.prototype.toString.call(d)) a.uniform1f(c, d);
              else throw 'attempted to set uniform "' + e + '" to invalid value ' + (d || "undefined").toString();
          }
        }
      return this
    };
    d.prototype.textures = function(b) {
      a.useProgram(this.program);
      for (var c in b) b.hasOwnProperty(c) && a.uniform1i(a.getUniformLocation(this.program, c), b[c]);
      return this
    };
    d.prototype.drawRect = function(b, c, e, d) {
      var f = a.getParameter(a.VIEWPORT);
      c = void 0 !== c ? (c - f[1]) / f[3] : 0;
      b = void 0 !== b ? (b - f[0]) / f[2] : 0;
      e = void 0 !== e ? (e - f[0]) / f[2] : 1;
      d = void 0 !== d ? (d - f[1]) / f[3] : 1;
      null == a.vertexBuffer && (a.vertexBuffer = a.createBuffer());
      a.bindBuffer(a.ARRAY_BUFFER, a.vertexBuffer);
      a.bufferData(a.ARRAY_BUFFER, new Float32Array([b,
        c, b, d, e, c, e, d
      ]), a.STATIC_DRAW);
      null == a.texCoordBuffer && (a.texCoordBuffer = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, a.texCoordBuffer), a.bufferData(a.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), a.STATIC_DRAW));
      null == this.vertexAttribute && (this.vertexAttribute = a.getAttribLocation(this.program, "vertex"), a.enableVertexAttribArray(this.vertexAttribute));
      null == this.texCoordAttribute && (this.texCoordAttribute = a.getAttribLocation(this.program, "_texCoord"), a.enableVertexAttribArray(this.texCoordAttribute));
      a.useProgram(this.program);
      a.bindBuffer(a.ARRAY_BUFFER, a.vertexBuffer);
      a.vertexAttribPointer(this.vertexAttribute, 2, a.FLOAT, !1, 0, 0);
      a.bindBuffer(a.ARRAY_BUFFER, a.texCoordBuffer);
      a.vertexAttribPointer(this.texCoordAttribute, 2, a.FLOAT, !1, 0, 0);
      a.drawArrays(a.TRIANGLE_STRIP, 0, 4)
    };
    d.getDefaultShader = function() {
      a.defaultShader = a.defaultShader || new d;
      return a.defaultShader
    };
    return d
  }();
  z.prototype.interpolate = function(a) {
    for (var d = 0, c = this.ya.length - 1; 1 < c - d;) {
      var e = c + d >> 1;
      this.xa[e] > a ? c = e : d = e
    }
    var e = this.xa[c] -
      this.xa[d],
      g = (this.xa[c] - a) / e;
    a = (a - this.xa[d]) / e;
    return g * this.ya[d] + a * this.ya[c] + ((g * g * g - g) * this.y2[d] + (a * a * a - a) * this.y2[c]) * e * e / 6
  };
  var r = function() {
      function b(b, c, d, f) {
        this.gl = a;
        this.id = a.createTexture();
        this.width = b;
        this.height = c;
        this.format = d;
        this.type = f;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
        a.texParameteri(a.TEXTURE_2D,
          a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
        b && c && a.texImage2D(a.TEXTURE_2D, 0, this.format, b, c, 0, this.format, this.type, null)
      }

      function d(a) {
        null == c && (c = document.createElement("canvas"));
        c.width = a.width;
        c.height = a.height;
        a = c.getContext("2d");
        a.clearRect(0, 0, c.width, c.height);
        return a
      }
      b.fromElement = function(c) {
        var d = new b(0, 0, a.RGBA, a.UNSIGNED_BYTE);
        d.loadContentsOf(c);
        return d
      };
      b.prototype.loadContentsOf = function(b) {
        this.width = b.width || b.videoWidth;
        this.height = b.height || b.videoHeight;
        a.bindTexture(a.TEXTURE_2D,
          this.id);
        a.texImage2D(a.TEXTURE_2D, 0, this.format, this.format, this.type, b)
      };
      b.prototype.initFromBytes = function(b, c, d) {
        this.width = b;
        this.height = c;
        this.format = a.RGBA;
        this.type = a.UNSIGNED_BYTE;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, b, c, 0, a.RGBA, this.type, new Uint8Array(d))
      };
      b.prototype.destroy = function() {
        a.deleteTexture(this.id);
        this.id = null
      };
      b.prototype.use = function(b) {
        a.activeTexture(a.TEXTURE0 + (b || 0));
        a.bindTexture(a.TEXTURE_2D, this.id)
      };
      b.prototype.unuse = function(b) {
        a.activeTexture(a.TEXTURE0 +
          (b || 0));
        a.bindTexture(a.TEXTURE_2D, null)
      };
      b.prototype.ensureFormat = function(b, c, d, f) {
        if (1 == arguments.length) {
          var h = arguments[0];
          b = h.width;
          c = h.height;
          d = h.format;
          f = h.type
        }
        if (b != this.width || c != this.height || d != this.format || f != this.type) this.width = b, this.height = c, this.format = d, this.type = f, a.bindTexture(a.TEXTURE_2D, this.id), a.texImage2D(a.TEXTURE_2D, 0, this.format, b, c, 0, this.format, this.type, null)
      };
      b.prototype.drawTo = function(b) {
        a.framebuffer = a.framebuffer || a.createFramebuffer();
        a.bindFramebuffer(a.FRAMEBUFFER,
          a.framebuffer);
        a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.id, 0);
        if (a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE) throw Error("incomplete framebuffer");
        a.viewport(0, 0, this.width, this.height);
        b();
        a.bindFramebuffer(a.FRAMEBUFFER, null)
      };
      var c = null;
      b.prototype.fillUsingCanvas = function(b) {
        b(d(this));
        this.format = a.RGBA;
        this.type = a.UNSIGNED_BYTE;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, c);
        return this
      };
      b.prototype.toImage = function(b) {
        this.use();
        h.getDefaultShader().drawRect();
        var f = 4 * this.width * this.height,
          k = new Uint8Array(f),
          n = d(this),
          p = n.createImageData(this.width, this.height);
        a.readPixels(0, 0, this.width, this.height, a.RGBA, a.UNSIGNED_BYTE, k);
        for (var m = 0; m < f; m++) p.data[m] = k[m];
        n.putImageData(p, 0, 0);
        b.src = c.toDataURL()
      };
      b.prototype.swapWith = function(a) {
        var b;
        b = a.id;
        a.id = this.id;
        this.id = b;
        b = a.width;
        a.width = this.width;
        this.width = b;
        b = a.height;
        a.height = this.height;
        this.height = b;
        b = a.format;
        a.format =
          this.format;
        this.format = b
      };
      return b
    }(),
    s = "float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}";
  return v
}();

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

angular.module('App').controller('CD_channel',
  ["$scope", "$interpolate", "S_utils", "S_templater", function($scope, $interpolate, S_utils, S_templater) {
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
  }]
);

angular.module('App').controller('CD_channelLogo',
  ["$scope", "$interpolate", "S_utils", "S_templater", function($scope, $interpolate, S_utils, S_templater) {
    var ctr = this;

    ctr.toggleChannel = function(ch) {
      ch.disabled = !ch.disabled;
    }


    return ctr;
  }]
);
 
angular.module('App').controller('CD_oneChannel',
  ["$scope", "$interpolate", "$timeout", "S_utils", "S_templater", "S_selfapi", function($scope, $interpolate, $timeout, S_utils, S_templater, S_selfapi) {
    var ctr = this;

    ctr.attachments = [];

    ctr.selectedAttachments = [];
    ctr.uploadingAttaches = [];
    ctr.processingAttachments = [];
    ctr.pageAttachments = [];

    $scope.$on('loadedDataFromArea', function(event, data) {
      if (!data) return;
      parseData(data);
    });

    $scope.$on('trigger:templateChanged', function() {
      parseData(ctr.data);
    });

    $scope.$on('emptyChannels', function() {
      ctr.text = '';
      ctr.removeImage();
    });


    if ($scope.pageData) {
      parseData($scope.pageData);
    }

    function parseData(data) {
      ctr.data = data;

      if (data.imageSrc && data.imageSrc !== '') {
        data.images.unshift({
          src: data.imageSrc,
          src_big: data.imageSrc
        });
      }

      var images = _.map(data.images, function(q) {
        q.type = 'image';
        q.id = S_utils.getRandomString(16);
        return q;
      });
      if (images.length) {
        ctr.pageAttachments = ctr.attachments.concat(images);
        ctr.attachments.length = 0;
        $scope.image = angular.extend($scope.image, images[0]);
      }

      ctr.text = $interpolate(S_templater.getTemplate())(ctr.data);
    }


    ctr.attachImage = function() {
      S_utils.callAttachPhotoDialog(ctr.pageAttachments, {
        before: ctr.pushUploadingAttach,
        after: ctr.afterImageUploaded
      }).then(function(resp) {
        $scope.image = angular.extend($scope.image, resp[0]);
      });
    }

    ctr.pushUploadingAttach = function() {

    }

    ctr.afterImageUploaded = function(resp, id) {
      $timeout(function() {
        $scope.image = angular.extend($scope.image, {
          src_big: resp.data.media_url,
          src_original: resp.data.media_url,
          options: undefined,
          media_id: resp.data.media_id
        });
      });

    }

    ctr.editImage = function() {
      S_utils.showEditImagePopup($scope.image).then(function(resper) {
        S_selfapi.saveBase64Image(resper.url).then(function(resp, id) {
          $timeout(function() {
            $scope.image = angular.extend($scope.image, {
              src_big: resp.data.media_url,
              src_original: $scope.image.src_original || $scope.image.src_big,
              options: resper.options,
              media_id: resp.data.media_id
            });
          })

        })
      })
    }

    ctr.attachmentsLimitReached = function() {
      return S_utils.attachmentsLimitReached(ctr.attachments.length);
    }

    ctr.showActions = function(channel) {
      return !channel.inprogress && !channel.error && !channel.complete;
    }

    ctr.showProgress = function(channel) {
      return channel.inprogress;
    }

    ctr.removeImage = function() {
      $scope.image.src_big = undefined;
    }

    ctr.getMaxTextLength = function() {
      $timeout(function() {
        //ctr.showChannels = ctr.text.length > S_utils.getMaxTextLengthInChannels($scope.channels, $scope.image, ctr.text);
      });
    }

    ctr.postChannelAgain = function(channel_id){
      $scope.postChannelAgain({
        channel_id: channel_id
      });
    }

    ctr.showDesc = function() {
      var q = _.find($scope.channels, function(q) {
        return q.separately === true;
      });

      if (q) {
        return true;
      }
      return false;
    }

    return ctr;
  }]
);

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
 
angular.module('App').controller('CM_attachPhoto', 
  ["$scope", "S_selfapi", "S_chrome", "$modalInstance", "pageAttachments", "uploadCallbacks", function($scope, S_selfapi, S_chrome, $modalInstance, pageAttachments, uploadCallbacks) {
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
  }]
);

angular.module('App').controller('CM_editImage',
  ["$scope", "S_selfapi", "S_chrome", "S_eventer", "$modalInstance", "image", function($scope, S_selfapi, S_chrome, S_eventer, $modalInstance, image) {
    var ctr = this;

    ctr.image = image;


    ctr.options = image.options || {
      textShadow: {
        width: 3,
        color: 'rgba(0,0,0,0.8)',
        x: 0,
        y: 1
      },
      color: '#fff',
      fontFamily: "Ubuntu",
      fontWeight: 300,
      fontSize: 32,
      valign: 'middle',
      filter: 'none',
      canvas: {
        fillColor: 'rgba(111,111,111,0.5)',
        padding: 20,
        border: {
          color: 'rgba(111,111,111,0.5)',
          width: 10
        },
        borderInner: {
          color: 'rgba(0,0,0,0.5)',
          width: 2
        }
      }
    };

    ctr.text = 'Ваш текст здесь';


    ctr.setValue = function(key, value) {
      var q = key.split('.');
      if (q.length === 2) {
        ctr.options[q[0]][q[1]] = value;
      } else {
        ctr.options[key] = value;
      }
    }


    ctr.saveImage = function() {
      S_eventer.sendEvent('saveImageRequest');
    }

    $scope.$on('imageDataRecieved', function(e, url) {
      console.log(url);
      $modalInstance.close({
        url: url,
        options: ctr.options
      });
    });



    return ctr;
  }]
);

angular.module('App').controller('CM_infoModal', 
  ["$scope", "S_selfapi", "S_chrome", "$modalInstance", "html", "title", function($scope, S_selfapi, S_chrome, $modalInstance, html, title) {
    var ctr = this;

    ctr.title = title;
    ctr.html = html;

    return ctr;
  }]
);



angular.module('App').controller('CM_paymentRequest', 
  ["$scope", "S_selfapi", "S_chrome", "$modalInstance", "resp", function($scope, S_selfapi, S_chrome, $modalInstance, resp) {
    var ctr = this;

    ctr.resp = resp;

    return ctr;
  }]
);
angular.module('App').controller('CM_table',
  ["$scope", "$compile", "$timeout", "$modalInstance", "S_selfapi", "setId", function($scope, $compile, $timeout, $modalInstance, S_selfapi, setId) {
    var ctr = this;


    $scope.eventSources = [];

    $scope.eventMouseover = function(date, jsEvent, view) {

    };

    $scope.eventRender = function(event, element, view) {
      event.title = event.replace('\n', ' ').replace('<br>', ' ');
      element.attr({
        'tooltip': event.title,
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
          callback(resp.data.table);
        });
      })
      $(window).trigger('resize');
    });

    return ctr;
  }]
);
