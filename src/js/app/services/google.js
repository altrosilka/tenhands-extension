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
