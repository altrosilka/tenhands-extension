angular.module('App').directive('postsTimeline', [
  '$q',
  'S_vk',
  'S_utils',
  '__timelinePeriods',
  function($q, S_vk, S_utils, __timelinePeriods) {
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
              start_time: $scope.time + __timelinePeriods.minOffset,
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

            var min = S_utils.roundToHour($scope.time + __timelinePeriods.minOffset);
            var max = S_utils.roundToHour($scope.time + __timelinePeriods.maxOffset);

            if (resp.old.response) {
              items = items.concat(resp.old.response.items);
            }
            if (resp.new.response) {
              items = items.concat(resp.new.response.items);
            }

            items = S_utils.itemsInInterval(items, min, max);

            if (items.length === 0) {
              $element.find('.chart').html('<div class="empty">Нет данных за выбранный период<span>Это значит, что в интервале с '+S_utils.unixTo($scope.time + __timelinePeriods.minOffset,'HH:mm / D.MM')+' по '+S_utils.unixTo($scope.time + __timelinePeriods.maxOffset,'HH:mm / D.MM')+' мы не нашли опубликованных или отложенных записей</span></div>');
              $scope.loading = false;
              return;
            } else {
              $element.find('.chart').html();
            }






            var seriesInfo = S_utils.remapForTimeline(items, min, max);

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
                startOnTick: true,
                endOnTick: true,
                minPadding: 0,
                minPadding: 0,
                "type": "datetime",
                "minTickInterval": 1000 * 60 * 60,
                "tickInterval": 1000 * 60 * 60,
                min: min * 1000,
                max: max * 1000,
                labels: {
                  style: {
                    fontSize: '8px'
                  }
                },
                dateTimeLabelFormats: {
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
              tooltip: {
                shared: true,
                backgroundColor: '#fff',
                formatter: function() {
                  return S_utils.formatterTimelineTooltip(this.x, seriesInfo.groupped);
                },
                useHTML: true,
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                borderRadius: 0,
                shadow: false
              },
              "credits": {
                "enabled": false
              },
              "plotOptions": {
                "column": {
                  pointWidth: 11,
                  animation: false,
                  states: {
                    hover: {
                      color: '#990000'
                    }
                  }
                }
              },
              "chart": {
                "defaultSeriesType": "column",
                "borderRadius": 0,
                backgroundColor: 'transparent',
                height: 22 * seriesInfo.max + 50,
                events: {
                  load: function() {
                    var ren = this.renderer,
                      color = 'rgba(255,0,0,0.2)';

                    var offset = this.xAxis[0].left + 5 + ($scope.time * 1000 - this.xAxis[0].min) / (this.xAxis[0].max - this.xAxis[0].min) * this.xAxis[0].width;

                    ren.path(['M', offset, 0, 'L', offset, 185])
                      .attr({
                        'stroke-width': 2,
                        stroke: color
                      })
                      .add();
                  }
                }
              },
              "subtitle": {},
              "colors": ["#2B587A"],
              "series": seriesInfo.series
            });
            $scope.loading = false;
          });
        }
      }
    }
  }
])
