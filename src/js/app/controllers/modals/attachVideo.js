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
