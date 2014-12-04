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
      0: '{} фотогрфий',
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
