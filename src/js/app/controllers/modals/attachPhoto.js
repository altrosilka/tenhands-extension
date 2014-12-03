angular.module('App').controller('CM_attachPhoto', [
  '$scope',
  'S_vk',
  'S_selfapi',
  'S_chrome',
  '$modalInstance',
  function($scope, S_vk, S_selfapi, S_chrome, $modalInstance) {
    var ctr = this;

    ctr.selectedAttachments = [];

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

    return ctr;
  }
]);
