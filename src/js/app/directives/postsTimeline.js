angular.module('App').directive('postsTimeline', [
  '$q',
  'S_vk',
  'S_utils',
  function($q, S_vk, S_utils) {
    return {
      scope: {
        time: '=',
        groupId: '='
      },
      templateUrl: 'templates/directives/postsTimeline.html',
      link: function($scope, $element, $attrs) {
        var chart, $canvas;

        var _color = '#090';

        $scope.$watch('time', function(time) {
          if (!time || !$scope.groupId) return;

          refresh();
        });

        $scope.$watch('groupId', function(groupId) {
          if (!groupId || !$scope.time) return;

          refresh();
        });

        function refresh() {
          $scope.loading = true;
          $q.all({
            old: S_vk.request('newsfeed.get', {
              filters: 'post',
              return_banned: 1,
              start_time: $scope.time - 5 * 3600,
              source_ids: '-' + $scope.groupId,
              count: 100
            }),
            new: S_vk.request('wall.get', {
              owner_id: '-80384539', //'-' + $scope.groupId,
              count: 100,
              filter: 'postponed'
            })
          }).then(function(resp) {
            var items = [];

            if (resp.old.response) {
              items = items.concat(resp.old.response.items);
            }
            if (resp.new.response) {
              items = items.concat(resp.new.response.items);
            }

            if (items.length === 0){
              $element.find('.chart').html('<div class="empty">Нет данных за выбранный период<span>Это значит, что последние 5 часов в группе не было записей и мы не нашли отложенных постов</span></div>');
              $scope.loading = false;
              return;
            } else {
              $element.find('.chart').html();
            }

            var seriesInfo = S_utils.remapForTimeline(items);

            chart = $element.find('.chart').highcharts({
              "title": {
                "text": null
              },
              "legend": {
                "layout": "vertical",
                "style": {},
                "enabled": false
              },
              "xAxis": {
                startOnTick: false,
                endOnTick: false,

                "type": "datetime",
                "minTickInterval": 1000 * 60 * 60,
                "tickInterval": 1000 * 60 * 60,
                min: ($scope.time - 5 * 3600) * 1000,
                max: ($scope.time + 24 * 3600) * 1000,
                labels: {
                  style: {
                    fontSize: '8px'
                  }
                }, 
                dateTimeLabelFormats:{
                  day: '%e %b'
                }
              },
              "yAxis": {
                lineWidth: 0,
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                lineColor: 'transparent',
                allowDecimals: false,
                "stackLabels": {
                  "enabled": false
                },
                "title": {
                  "text": null
                },
                labels: {
                  "enabled": false
                }
              },
              "tooltip": {
                "enabled": true
              },
              "credits": {
                "enabled": false
              },
              "plotOptions": {
                "column": {
                  stacking: "normal",
                  pointWidth: 11,
                  animation: false
                }
              },
              "chart": {
                "defaultSeriesType": "column",
                "borderRadius": 0,
                backgroundColor: 'transparent',
                height: 22 * seriesInfo.max + 50
              },
              "subtitle": {},
              "colors": ["#2B587A"],
              "series": seriesInfo.series
            });
            //chart.find('text:contains("Highcharts.com")').remove();
            $scope.loading = false;
          });
        }


      }
    }
  }
])
