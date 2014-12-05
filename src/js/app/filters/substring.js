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
 