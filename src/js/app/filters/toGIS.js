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
