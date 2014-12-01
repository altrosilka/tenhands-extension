angular.module('App').controller('CD_photobankSearch', [
  '$scope',
  'S_google',
  'S_utils',
  function($scope, S_google, S_utils) {
    var ctr = this;

    var _fanciedImage, _fancyBoxObject;
    ctr.attachments = [];
    ctr.selectedAttachments = [];
    ctr.processingImages = []; 

    ctr.aboutSearchText = '<div style="width:300px">Например, ты хочешь найти <b>борщ</b>. Какие запросы ты можешь задать: <b>борщ</b>, <b>украинский борщ</b>, <b>борщ с бараниной</b>, <b>розовый борщ</b>, <b>шутка про борщ</b>, <b>борщ на природе</b>, <b>борщ с пампушками</b>. И все эти запросы приведут тебя к разным изображениям.<br><br>Формируй запросы правильно и все будет хорошо!</div>';

    ctr.page = 0;

    ctr.search = function(q) {
      if (q === '') {
        return
      }

      S_google.loadImages(q).then(function(resp) {
        var images = _.map(resp.results, function(q) {
          return S_utils.convertGoogleImageToAttach(q);
        });
        ctr.attachments = images;
        console.log(images);
      });
    }

    return ctr;
  }
]);
