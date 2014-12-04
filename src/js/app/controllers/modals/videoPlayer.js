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
