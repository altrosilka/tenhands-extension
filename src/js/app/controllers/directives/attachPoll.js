angular.module('App').controller('CD_attachPoll', [
  '$scope',
  'S_vk',
  'S_selfapi',
  'S_chrome',
  '__maxPollVariants',
  function($scope, S_vk, S_selfapi, S_chrome, __maxPollVariants) {
    var ctr = this;

    ctr.poll = $scope.poll;

    ctr.poll.variants = [{
      index: 0,
      text: ''
    }, {
      index: 1,
      text: ''
    }];

    ctr.createNewVariant = function(index) {
      if (index === ctr.poll.variants.length - 1 && index < __maxPollVariants - 2) {
        ctr.poll.variants.push({
          index: index+1,
          text: ''
        });
      }
    }

    ctr.removeVariant = function(variant){
      _.remove(ctr.poll.variants,variant);
    }

    ctr.removeIsEnabled = function(index){
      return (index > 2 || ctr.poll.variants.length > 2);
    }

    ctr.removePoll = function(){
      $scope.destroy({
        attach: $scope.poll
      });
    }

    return ctr;
  }
]);
