var App = angular.module('App', [
  'config',
  'vkTools',
  'chromeTools',
  'ngSanitize',
  'utilsTools',
  'ui.bootstrap',
  'ui.select',
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
  
angular.module('config',[])
  .constant('__vkAppId', 4639658)
  .constant('__api', {
    baseUrl: 'http://api.smm.dev/',
    paths: {
      saveExtensionToken: 'user/saveExtensionToken',
      getAssignKey: 'user/getAssignKey',
      uploadPhoto: 'posts/uploadImage',
      sendPost: 'posts/create'
    }
  })


  
App.run([
  '__vkAppId',
  'S_chrome',
  'S_vk',
  'S_google',
  function(__vkAppId, S_chrome, S_vk, S_google) {
    S_chrome.pageDataWatch();

    S_google.init();

    S_chrome.getVkToken().then(function(token) {

      S_vk.setToken(token);
      S_vk.testRequest(function() {
        console.log(1);
      }, function() {
        console.log(2);
      });
    }, function() {
      chrome.runtime.sendMessage({
        vk_auth: true
      }, function(response) {
        console.log(response.farewell);
      });
    })
  }
]);

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
        url: __api.baseUrl + __api.paths.uploadPhoto,
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
 
angular.module('App').directive('postsTimeline', [function() {
  return {
    scope: {
      data: '=postsTimeline'
    },
    link: function($scope, $element, $attrs) {
      var chart, $canvas;

      var _color = '#090';

      $scope.$watch('data', function(data) {
        if (!data) return;
        
        chart = $element.highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: null
          },
          xAxis: {
            categories: data.categories
          },
          yAxis: {
            min: 0,
            lineWidth: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            lineColor: 'transparent',
            title: {
              text: null
            },
            labels: {
              enabled: false
            },
            minorTickLength: 0,
            tickLength: 0,
            stackLabels: {
              enabled: true,
              style: {
                fontSize: '22px',
                bottom: '10px',
                color: (Highcharts.theme && Highcharts.theme.textColor) || '#000'
              }
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            enabled: false,
            formatter: function() {
              return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              animation: false,
              dataLabels: {
                enabled: false
              }
            },
            series: {
              states: {
                hover: {
                  enabled: false
                }
              }
            }
          },
          series: series
        });
        chart.find('text:contains("Highcharts.com")').remove();
      });
    }
  }
}])
angular.module('App').directive('selectArea', [
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
        mainMode: '='
      },
      templateUrl: 'templates/directives/selectArea.html',
      controller: ['$scope', function($scope) {
        var ctr = this;

        var _fanciedImage;

        ctr.mainMode = $scope.mainMode;

        ctr.add = function(attach) {
          var i = _.remove($scope.postAttachments, function(q) {
            return q.id === attach.id;
          });
          $scope.postAttachments.push(attach);
        }

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

        ctr.removeFromPost = function(attach){
          _.remove($scope.postAttachments,function(q){
            return attach.id === q.id;
          });
        }

        ctr.removeAttach = function(attach){
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

        ctr.openFullImage = function(image) {
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

angular.module('App').controller('C_afterAuth', ['$scope', 'S_vk', 'S_selfapi', 'S_chrome', function($scope, S_vk, S_selfapi, S_chrome) {
  var ctr = this;


  S_chrome.getVkToken().then(function(token) {
    if (token) {
      S_selfapi.sendExtensionToken(token);
    } else {
      //TODO: обработчик
    }
  })


  return ctr;
}]);

angular.module('App').controller('C_afterInstall', ['$scope', 'S_vk', function($scope, S_vk) {
  var ctr = this;

  ctr.singIn = function() {
    var currentTab;

    chrome.tabs.getCurrent(function(tab) {
      currentTab = tab;

      S_vk.callAuthPopup().then(function(tab) {


        chrome.tabs.remove(tab.id, function() {});
        

        chrome.tabs.update( 
          currentTab.id, {
            'url': '/pages/afterAuth.html',
            'active': true
          },
          function(tab) {
          }
        );
      })
    })

  }

  return ctr;
}]);

angular.module('App').controller('C_main', [
  '$scope',
  '$compile',
  '$timeout',
  'S_utils',
  'S_selfapi',
  'S_vk',
  function($scope, $compile, $timeout, S_utils, S_selfapi, S_vk) {
    var ctr = this;

    ctr.minDate = new Date();
    ctr.postingDate = new Date();
    ctr.maxDate = moment(ctr.minDate).add(45, 'days').toDate();

    ctr.datepickerOptions = {};

    ctr.openDatepicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      ctr.openedDatepickerPopup = !ctr.openedDatepickerPopup;
    };


    ctr.attachments = [];

    ctr.processingAttachments = [];
    ctr.uploadingAttaches = [];



    S_vk.request('groups.get', {
      extended: 1,
      filter: 'admin,editor',
      fields: 'members_count'
    }).then(function(resp) {

      //$scope.$apply(function() {
      ctr.groups = resp.response.items;

      ctr.selectedGroup = ctr.groups[0];
    });



    $scope.$on('loadedDataFromTab', function(event, data) {
      $scope.$apply(function() {
        ctr.data = data;
        var images = _.map(data.images, function(q) {
          q.type = 'image';
          q.id = S_utils.getRandomString(16);
          return q;
        });
        ctr.pageAttachments = ctr.attachments.concat(images);
        ctr.attachments.push(images[0]);

        if (!ctr.text || ctr.text === '') {
          ctr.text = S_utils.decodeEntities(data.selection || data.title);
        }
      });

    });

    ctr.dataIsLoaded = true;
    ctr.getRemainingAttachesCount = function() {
      return 9 - ctr.attachments.length;
    }

    ctr.pushUploadingAttach = function() {
      var obj = {
        src: '/images/nophoto.jpg',
        type: 'image',
        processing: true,
        id: S_utils.getRandomString(16)
      };
      $scope.$apply(function() {
        ctr.attachments.push(obj);
        ctr.uploadingAttaches.push(obj);
        ctr.processingAttachments.push(obj);
      });
      return obj;
    }

    ctr.afterImageUploaded = function(resp, id) {
      var attach = ctr.uploadingAttaches.shift();
      var image = S_utils.convertUploadedPhotoToAttach(resp.response[0]);
      $scope.$apply(function() {
        _.extend(attach, image);
        ctr.processingAttachments.shift();
      });
    }

    S_selfapi.getAssignKey().then(function(resp) {
      if (resp.data.keyInfo === null) {
        ctr.paidIsEnd = true;
      } else {
        ctr.paidIsEnd = false;
      }
    });


    $scope.$watch(function() {
      return ctr.postingDate;
    }, function(q) {
      if (!q) return;
      ctr.onTimeChanged();
    });

    $scope.$watch(function() {
      return ctr.postingTime;
    }, function(q) {
      if (!q) return;
      ctr.onTimeChanged();
    });


    ctr.onTimeChanged = function() {
      if (!ctr.postingTime || !ctr.postingDate) return;

      var dateUnix = +moment(moment(ctr.postingDate).format('DD.MM.YY'), 'DD.MM.YY').format('X');
      var startDate = +moment(moment(ctr.postingTime).format('DD.MM.YY HH:mm:00'), 'DD.MM.YY HH:mm:ss').format('X') - +moment(moment(ctr.postingTime).format('DD.MM.YY 00:00:00'), 'DD.MM.YY HH:mm:ss').format('X');

      ctr.postingUnixTime = dateUnix + startDate;

      ctr.loadTimeline(ctr.postingUnixTime);
    }

    ctr.loadTimeline = function(unix) {
      return;
      S_vk.request('newsfeed.get', {
        filters: 'post',
        return_banned: 1,
        start_time: unix - 5 * 3600,
        source_ids: ctr.groupId,
        count: 100
      }, function(resp) {
        console.log(resp);
      });
    }

    ctr.publicPost = function() {

      if (ctr.processingAttachments.length > 0) {
        return;
      }

      var postInfo = _.map(ctr.attachments, function() {
        return '';
      });

      _.forEach(ctr.attachments, function(q, i) {
        switch (q.type) {
          case "image":
            {
              if (q.photo) {
                postInfo[i] = q.photo;
              } else {
                ctr.processingAttachments.push(q);
                S_selfapi.uploadImageToVk(q.src_big).then(function(resp) {
                  var photo = resp.photo;
                  _.remove(ctr.processingAttachments, function(qz) {
                    return qz.id === q.id;
                  })[0];

                  postInfo[i] = _.extend({
                    type: 'image'
                  }, photo);

                  if (ctr.processingAttachments.length === 0) {
                    console.log('out');
                    console.log(postInfo, ctr.attachments);
                    out(postInfo);
                  }
                });
              }
              break;
            }
        }
      });

      function out(attachments) {
        S_selfapi.sendPost('-'+ctr.selectedGroup.id, ctr.text, attachments, ctr.postingUnixTime, 0).then(function(resp) {
          console.log(resp.data);
        });
      }
    }

    return ctr;
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

angular.module('chromeTools', [])
  .service('S_chrome', ['$q', 'S_eventer', function($q, S_eventer) {
    var service = {};

    service.pageDataWatch = function() {
 
      window.addEventListener('message', function(e) {
        S_eventer.sendEvent('loadedDataFromTab', e.data);
      });

      
      setTimeout(function() {
        S_eventer.sendEvent('loadedDataFromTab', {
          "images": [{
            "alt": "Грелка ",
            "clientHeight": 450,
            "clientWidth": 600,
            "width": 600,
            "height": 450,
            "title": "Грелка ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/grelka-_1416265291.jpg"
          }, {
            "alt": "Любовь - великая сила ",
            "clientHeight": 571,
            "clientWidth": 600,
            "width": 600,
            "height": 571,
            "title": "Любовь - великая сила ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/lyubov-velikaya-sila-_1416314178.jpg"
          }, {
            "alt": "Скоро праздники ",
            "clientHeight": 600,
            "clientWidth": 600,
            "width": 600,
            "height": 600,
            "title": "Скоро праздники ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/skoro-prazdniki-_1416214236.jpg"
          }, {
            "alt": "Фигулька ",
            "clientHeight": 778,
            "clientWidth": 600,
            "width": 600,
            "height": 778,
            "title": "Фигулька ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/figulka-_1415910890.jpg"
          }, {
            "alt": "Коварная чугунная поня ",
            "clientHeight": 449,
            "clientWidth": 600,
            "width": 600,
            "height": 449,
            "title": "Коварная чугунная поня ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/kovarnaya-chugunnaya-ponya-_1416233562.jpg"
          }, {
            "alt": "Таблетки для смеха",
            "clientHeight": 488,
            "clientWidth": 600,
            "width": 600,
            "height": 488,
            "title": "Таблетки для смеха",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/tabletki-dlya-smeha-_1415531344.jpg"
          }, {
            "alt": "Разбуженный грабитель ",
            "clientHeight": 399,
            "clientWidth": 600,
            "width": 600,
            "height": 399,
            "title": "Разбуженный грабитель ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/razbuzhennyy-grabitel-_1416233761.jpg"
          }, {
            "alt": "Нам бы карася  ",
            "clientHeight": 429,
            "clientWidth": 600,
            "width": 600,
            "height": 429,
            "title": "Нам бы карася  ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/nam-by-karasya-_1416233413.jpg"
          }, {
            "alt": "Нычкарик по призванию ",
            "clientHeight": 450,
            "clientWidth": 600,
            "width": 600,
            "height": 450,
            "title": "Нычкарик по призванию ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/nychkarik-po-prizvaniyu-_1416232762.jpg"
          }, {
            "alt": "Еда с гавкающим названием ",
            "clientHeight": 800,
            "clientWidth": 600,
            "width": 600,
            "height": 800,
            "title": "Еда с гавкающим названием ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/yeda-s-gavkayuschim-nazvaniyem-_1416203979.jpg"
          }, {
            "alt": "",
            "clientHeight": 250,
            "clientWidth": 250,
            "width": 250,
            "height": 250,
            "title": "",
            "src": "http://static.lolkot.ru/images/usermatrix1416326402.jpg"
          }, {
            "alt": "",
            "clientHeight": 15,
            "clientWidth": 88,
            "width": 88,
            "height": 15,
            "title": "",
            "src": "http://counter.yadro.ru/hit?t26.16;rhttp%3A//yandex.ru/clck/jsredir%3Ffrom%…c%3D2.584962500721156;s1280*800*24;uhttp%3A//lolkot.ru/;0.5310913703870028"
          }],
          "title": "Смешные картинки кошек с надписями",
          "url": "http://lolkot.ru/",
          "imageSrc": "http://0.gravatar.com/avatar/d2e9e4a8e24a1daf5d3985172ee47078?s=210"
        })
      }, 10000000000);
    }


    service.getVkToken = function() {
      var defer = $q.defer();
      chrome.storage.local.get({
        'vkaccess_token': {}
      }, function(items) {
        if (items.vkaccess_token.length !== undefined) {
          defer.resolve(items.vkaccess_token);
        } else {
          defer.reject();
        }
      });
      return defer.promise;
    }


    service.showExtensionPopup = function(tab, info) {
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
    function($rootScope) {
      var service = {};

      service.sendEvent = function(name, arguments) {
        $rootScope.$broadcast(name, arguments);
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
          url: base + __api.paths.saveExtensionToken,
          method: 'POST',
          data: {
            token: token
          }
        });
      }

      service.sendPost = function(owner_id, message, attachments, publish_date, signed) {
        return $http({
          url: base + __api.paths.sendPost,
          method: 'POST',
          data: {
            owner_id: owner_id,
            message: message,
            attachments: attachments,
            publish_date: publish_date,
            signed: signed
          }
        });
      }

      service.getAssignKey = function(token) {
        return $http({
          url: base + __api.paths.getAssignKey,
          method: 'GET'
        });
      }

      var _uploadImageToVkStack = [];
      service.uploadImageToVk = function(url, c, w, h, id) {
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

        _uploadImageToVkStack.push({
          obj: obj,
          defer: defer
        });

        if (_uploadImageToVkStack.length === 1) {
          uploadImageToVkCall();
        }

        return defer.promise;
      }

      function uploadImageToVkCall() {
        var q = _uploadImageToVkStack[0];
        $http({
          url: base + __api.paths.uploadPhoto,
          method: 'POST',
          data: q.obj
        }).then(function(resp) {
          _uploadImageToVkStack.shift();
          q.defer.resolve({
            photo: resp.data.response[0],
            id: q.obj.id
          });

          if (_uploadImageToVkStack.length > 0) {
            uploadImageToVkCall();
          }
        });
      }

      return service;
    }
  ]);

angular.module('utilsTools', [])
  .service('S_utils', ['$modal','$q', function($modal,$q) {
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

    service.convertUploadedPhotoToAttach = function(photo) {
      return {
        photo: photo,
        width: photo.width,
        clientWidth: photo.width,
        height: photo.height,
        clientHeight: photo.height,
        src: photo.photo_130,
        src_big: photo.photo_807 || photo.photo_604,
        type: 'image'
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
        src: image.tbUrl,
        src_big: image.url,
        type: 'image'
      }
    }

    return service;
  }]);

angular.module('vkTools', [])
  .service('S_vk', [
    '$q',
    '$http',
    'S_utils',
    '__vkAppId',
    function($q, $http, S_utils, __vkAppId) {
      var service = {};

      service.default = {
        version: '5.26',
        language: 'ru'
      };

      var _requestStack = [];

      function listenerHandler(authenticationTabId, afterAuth) {
        "use strict";

        return function tabUpdateListener(tabId, changeInfo) {
          var vkAccessToken,
            vkAccessTokenExpiredFlag;

          if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {

            if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
              authenticationTabId = null;
              chrome.tabs.onUpdated.removeListener(tabUpdateListener);

              vkAccessToken = S_utils.getUrlParameterValue(changeInfo.url, 'access_token');

              if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
                displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
                return;
              }

              vkAccessTokenExpiredFlag = Number(S_utils.getUrlParameterValue(changeInfo.url, 'expires_in'));

              if (vkAccessTokenExpiredFlag !== 0) {
                displayeAnError('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
                return;
              }
              service.setToken(vkAccessToken);
              chrome.storage.local.set({
                'vkaccess_token': vkAccessToken
              }, function() {
                afterAuth();
              });
            }
          }
        };
      }


      service.request = function(_method, _params, _response) {
        var defer = $q.defer();

        service.getToken().then(function(token) {

          var path = '/method/' + _method + '?' + 'access_token=' + service.token;
          _params['v'] = _params['v'] || service.default.version;
          _params['lang'] = _params['lang'] || service.default.language;

          for (var key in _params) {
            if (key === "message") {
              path += ('&' + key + '=' + encodeURIComponent(_params[key]));
            } else {
              path += ('&' + key + '=' + _params[key]);
            }
          }


          $http.get('https://api.vk.com' + path).then(function(res) {
            if (typeof _response === 'function') {
              _response(res.data);
            } else {
              defer.resolve(res.data);
            }
          });
        });

        return defer.promise;
      };

      service.setToken = function(token) {
        service.token = token;
        if (_requestStack.length > 0) {
          angular.forEach(_requestStack, function(request) {
            request.resolve(token);
          });
        }
      };

      service.testRequest = function() {
        var defer = $q.defer();
        service.request('users.get', {}, function(resp) {
          if (resp.success) {
            defer.resolve();
          } else {
            defer.reject();
          }
        })
        return defer.promise;
      }

      service.callAuthPopup = function() {
        var defer = $q.defer();
        var vkAuthenticationUrl = 'https://oauth.vk.com/authorize?client_id=' + __vkAppId + '&scope=' + 'groups,photos,friends,video,audio,wall,offline,email,docs,stats' + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

        chrome.tabs.create({
          url: vkAuthenticationUrl,
          selected: true
        }, function(tab) {

          chrome.tabs.onUpdated.addListener(listenerHandler(tab.id, function() {
            defer.resolve(tab);
          }));
        });

        return defer.promise;
      }



      service.getToken = function() {
        var defer = $q.defer();

        if (service.token) {
          defer.resolve(service.token);
        } else {
          _requestStack.push(defer);
        }

        return defer.promise;
      };

      return service;
    }
  ]);

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
        console.log(images);
      });
    }

    return ctr;
  }
]);
