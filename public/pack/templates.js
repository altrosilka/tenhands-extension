angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/directives/attachPoll.html","<div class=\"attachPoll\">\n  <h3>\n  	<span class=\"relative\">\n  		<span class=\"pollIcon\">\n  			<i class=\"fa fa-bar-chart\"></i>\n  		</span>\n  		Тема опроса\n  		<span class=\"removeIcon\" ng-click=\"ctr.removePoll()\">\n  			<i class=\"fa fa-times\"></i>\n  		</span>\n		</span>\n	</h3>\n	<input type=\"text\" class=\"form-control\" ng-model=\"ctr.poll.question\">\n\n  <h3>Варианты ответа</h3>\n  <div class=\"variants\">\n    <div class=\"variant\" ng-repeat=\"variant in ctr.poll.variants\">\n      <input type=\"text\" class=\"form-control\" ng-focus=\"ctr.createNewVariant($index)\" ng-model=\"ctr.poll.variants[$index].text\">\n      <span class=\"remove\" ng-show=\"ctr.removeIsEnabled($index)\" ng-click=\"ctr.removeVariant(variant)\">\n      	<i class=\"fa fa-times\"></i>\n      </span>\n    </div>\n  </div>\n  <div class=\"checkboxList controls-list\">\n    <label>\n      <input type=\"checkbox\" ng-model=\"ctr.poll.is_anonymous\">\n      <span>Анонимное голосование</span>\n    </label>\n  </div>\n</div>\n");
$templateCache.put("templates/directives/dateButton.html","<div class=\"dateButton\" ng-click=\"ctr.toggle($event)\">\n  <i class=\"fa fa-calendar\"></i>\n  <div class=\"form-control\" ng-bind=\"viewModel\"></div>\n\n  <input type=\"text\" class=\"hidden-input\" close-text=\"Закрыть\" is-open=\"ctr.isOpen\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"model\" show-button-bar=\"false\" min-date=\"minDate\" max-date=\"maxDate\" datepicker-options=\"{ showWeeks: false,  maxMode: \'day\', startingDay: 1, showButtonBar: false, formatDay: \'d\'}\">\n</div>\n");
$templateCache.put("templates/directives/imageUploadArea.html","<input id=\"fileupload\" class=\"btn btn-primary\" type=\"file\" name=\"file\" multiple>  \n\n");
$templateCache.put("templates/directives/jcropArea.html","<div class=\"modal-header\">\n  <h3>Редактирование фотографии</h3>\n</div>\n<div class=\"modal-body\">\n  <div class=\"jcropArea\">\n    <div class=\"image\">\n      <img id=\"cropImage\" ng-src=\"{{ctr.image}}\" ng-style=\"{\'maxHeight\':ctr.maxHeight}\">\n    </div>\n\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <span class=\"btn btn-primary\" ng-click=\"ctr.applyCrop(ctr.coords)\">сохранить</span>\n  <button class=\"btn btn-link pull-right fixRight\" ng-click=\"ctr.cancelCrop()\">отмена</button>\n</div>\n");
$templateCache.put("templates/directives/photobankSearch.html","<div class=\"text-center photobankSearch\">\n  <form class=\"mb10\" ng-submit=\"pbctr.search(pbctr.q)\">\n    <div class=\"relative fsSearchBlock\">\n      <i class=\"fa fa-search\"></i>\n      <input autofocus=\"autofocus\" class=\"form-control search\" type=\"text\" ng-model=\"pbctr.q\" placeholder=\"spa или борщ\">\n      <div class=\"btn btn-link pointer info\" popover-placement=\"left\" popover-trigger=\"click\" popover-html-unsafe=\"{{pbctr.aboutSearchText}}\" popover-append-to-body=\"true\">что это?</div>\n      <!--<div class=\"input-group-addon btn btn-default\" ng-click=\"pbctr.search(pbctr.q)\">поиск</div>-->\n    </div>\n    <input type=\"submit\" class=\"gogoleft\">\n  </form>\n\n  <div select-area selected-attachments=\"ctr.selectedAttachments\" attachments=\"pbctr.attachments\" on-attach-click=\"ctr.sendAttach(attach)\"></div>\n</div>\n");
$templateCache.put("templates/directives/popoverHtmlUnsafePopup.html","<div class=\"popover {{placement}}\" data-ng-class=\"{ in: isOpen, fade: animation() }\" data-ng-click=\"isOpen = false\">\n  <div class=\"arrow\"></div>\n\n  <div class=\"popover-inner\">\n    <h3 class=\"popover-title\" data-ng-bind=\"title\" data-ng-show=\"title\"></h3>\n    <div class=\"popover-content\" data-bind-html-unsafe=\"content\"></div>\n  </div>\n</div> ");
$templateCache.put("templates/directives/postsTimeline.html","<div class=\"postsTimeline\">\n  <div class=\"refresh\" ng-class=\"{\'active\':loading}\">\n    <i class=\"fa fa-refresh fa-spin\"></i>\n  </div>\n  <div class=\"chart\"></div>\n</div>\n ");
$templateCache.put("templates/directives/selectArea.html","<div class=\"attaches clearfix\">\n  <div class=\"attach\" ng-repeat=\"attach in attachments\" ng-class=\"{selected: ctr.attachIsSelected(attach)}\">\n    <div class=\"process\">\n      <i class=\"fa fa-circle-o-notch fa-spin\"></i>\n    </div>\n    <div class=\"image\" ng-click=\"ctr.onAttachClick(attach)\" ng-style=\"{\'background-image\':\'url(\'+attach.src+\')\'}\">\n    </div>\n    <div class=\"lower\" ng-click=\"ctr.remove(attach)\"></div>\n    <div class=\"actions\">\n      <div class=\"check lay\" ng-click=\"ctr.toggle(attach)\">\n        <i class=\"fa fa-check\"></i>\n      </div>\n    </div>\n\n    <div class=\"info\">\n      <span tooltip-placement=\"left\" tooltip=\"Видимый размер изображения\">\n              {{attach.clientWidth}}x{{attach.clientHeight}} \n            </span>\n      <span class=\"gray\" ng-if=\"ctr.showRealImageSize(attach)\" tooltip-placement=\"left\" tooltip=\"Оригинальный резмер изображения\">\n              ({{attach.width}}x{{attach.height}})\n            </span>\n    </div>\n  </div>\n\n  <div class=\"noResults\" ng-bind=\"ctr.noAttachesText\" ng-show=\"!attachments.length\"></div>\n</div>\n");
$templateCache.put("templates/directives/selectCropArea.html","<div class=\"attaches clearfix\">\n  <div class=\"attach\" ng-repeat=\"attach in attachments\" ng-class=\"{\'processing\':ctr.attachIsProcessing(attach), selected: ctr.attachIsSelected(attach)}\" data-type=\"{{attach.type}}\">\n    <section ng-if=\"attach.type ===\'image\'\">\n      <div class=\"process\">\n        <i class=\"fa fa-circle-o-notch fa-spin\"></i>\n      </div>\n      <div class=\"image\" ng-click=\"ctr.edit(attach)\" ng-style=\"{\'background-image\':\'url(\'+attach.src+\')\'}\">\n      </div>\n      <div class=\"actions\">\n        <div class=\"check lay\" ng-click=\"ctr.remove(attach)\">\n          <i class=\"fa fa-remove\"></i>\n        </div>\n      </div>\n \n      <div class=\"info\" ng-show=\"attach.clientWidth || attach.width\">\n        <span tooltip-placement=\"left\" tooltip=\"Видимый размер изображения\">\n              {{attach.clientWidth}}x{{attach.clientHeight}} \n            </span>\n        <span class=\"gray\" ng-if=\"ctr.showRealImageSize(attach)\" tooltip-placement=\"left\" tooltip=\"Оригинальный резмер изображения\">\n              ({{attach.width}}x{{attach.height}})\n            </span>\n      </div>\n    </section>\n    <section ng-if=\"attach.type ===\'video\'\">\n      <div class=\"playButton\" ng-click=\"ctr.openVideo(attach)\">\n        <i class=\"fa fa-play-circle\"></i>\n      </div>\n      <div class=\"image\" ng-click=\"ctr.openVideo(attach)\" ng-style=\"{\'background-image\':\'url(\'+attach.src+\')\'}\"></div>\n      <div class=\"actions\">\n        <div class=\"check lay\" ng-click=\"ctr.remove(attach)\">\n          <i class=\"fa fa-remove\"></i>\n        </div>\n      </div>\n      <div class=\"info\">\n        <span ng-bind=\"attach.duration | toGIS\"></span>\n      </div>\n    </section>\n    <section ng-if=\"attach.type ===\'poll\'\" attach-poll=\"attach\" destroy=\"ctr.remove(attach)\">\n\n    </section>\n  </div>\n</div>\n");
$templateCache.put("templates/directives/selectDate.html","<div class=\"date-selector\">\n  <div class=\"inputs\" ng-hide=\"hideInputs\">\n    <input onclick=\"this.select()\" class=\"day\" type=\"text\" placeholder=\"11\" data-ng-model=\"editdate.day\">\n    <input onclick=\"this.select()\" class=\"month\" type=\"text\" placeholder=\"08\" data-ng-model=\"editdate.month\">\n    <input onclick=\"this.select()\" class=\"year\" type=\"text\" placeholder=\"2014\" data-ng-model=\"editdate.year\">\n  </div>\n\n  <input type=\"text\" class=\"hidden-input\" close-text=\"Закрыть\" is-open=\"isOpen\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"model\" show-button-bar=\"false\" min-date=\"minDate\"  max-date=\"maxDate\" datepicker-options=\"{ showWeeks: false,  maxMode: \'day\', startingDay: 1, showButtonBar: false, formatDay: \'d\'}\" ng-required=\"true\">\n</div>\n");
$templateCache.put("templates/directives/timeSelect.html","<span class=\"timeSelect\">\n	<span class=\"selectWrapper\">\n		<select ng-model=\"ctr.hour\" class=\"form-control\" ng-options=\"ctr.getView(option) for option in ctr.hours\" ng-change=\"ctr.updateTime()\"></select>\n	</span>\n	<span class=\"sep\">:</span>\n	<span class=\"selectWrapper\">\n		<select ng-model=\"ctr.minute\" class=\"form-control\" ng-options=\"ctr.getView(option) for option in ctr.minutes\" ng-change=\"ctr.updateTime()\"></select>\n	</span>\n</span>\n");
$templateCache.put("templates/directives/videoCover.html","<div class=\"videoCover\" ng-class=\"{\'odd\':$odd}\">\n  <div class=\"image\" ng-style=\"{\'background-image\':\'url(\'+video.photo_320+\')\'}\"></div>\n  <div class=\"info\">\n    <span class=\"duration\" ng-bind=\"video.duration | toGIS\"></span>\n    <div class=\"title\" ng-bind=\"video.title\"></div>\n  </div>\n</div>");
$templateCache.put("templates/modals/attachPhoto.html","<section class=\"attachPhoto\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title\">Прикрепление фотографии</h3>\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"up-level-tabs\">\n      <tabset>\n        <tab heading=\"со страницы\" active=\"true\">\n\n          <div class=\"bodyWithTabs\">\n            <div select-area selected-attachments=\"ctr.selectedAttachments\" attachments=\"ctr.pageAttachments\" on-attach-click=\"ctr.sendAttach(attach)\" no-attaches-text=\"Нет подходящих изображений\"></div>\n          </div>\n        </tab>\n        <tab heading=\"из фотобанка\">\n          <div class=\"bodyWithTabs\">\n            <div photobank-search></div>\n          </div>\n        </tab>\n\n        <label class=\"uploadImage\">\n          <span>загрузить с компьютера</span>\n          <div class=\"gogoleft\" image-upload-area on-upload-start=\"ctr.beforeUploading\" after-image-uploaded=\"ctr.afterUploading\"></div>\n        </label>\n      </tabset>\n\n    </div>\n\n  </div>\n  <div class=\"modal-footer fixed-footer\">\n    <button class=\"btn btn-primary\" ng-click=\"ctr.closeDialog()\">прикрепить\n      <span ng-pluralize count=\"ctr.selectedAttachments.length\" when=\"ctr.imagesPlurals\">\n      </span>\n    </button>\n    <button class=\"btn btn-link pull-right fixRight\" ng-click=\"$dismiss()\">отмена</button>\n  </div>\n</section>\n");
$templateCache.put("templates/modals/attachVideo.html","<section class=\"attachVideo\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title\">Прикрепление видеозаписи</h3>\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"up-level-tabs\">\n      <tabset>\n        <tab heading=\"поиск\" active=\"true\">\n          <div class=\"bodyWithTabs\">\n            <form class=\"mb10\" ng-submit=\"ctr.search()\">\n              <div class=\"relative fsSearchBlock\">\n                <i class=\"fa fa-search\"></i>\n                <input autofocus=\"autofocus\" class=\"form-control search\" type=\"text\" ng-model=\"ctr.q\" placeholder=\"котики или тест-драйв\">\n                <div class=\"filters\">\n                  <div class=\"checkboxList controls-list\">\n                    <label>\n                      <input type=\"checkbox\" ng-model=\"ctr.hd\" ng-change=\"ctr.search()\">\n                      <span>HD</span>\n                    </label>\n                    <label tooltip=\"фильтровать взрослый контент\">\n                      <input type=\"checkbox\" ng-model=\"ctr.adult\" ng-change=\"ctr.search()\">\n                      <span>Фильтр</span>\n                    </label>\n                  </div>\n                  <span class=\"selectWrapper\">\n                  <select ng-model=\"ctr.sort\" class=\"form-control\" ng-change=\"ctr.search()\">\n                    <option value=\"2\" selected=\"\">по релевантности</option>\n                    <option value=\"0\">по дате добавления</option>\n                    <option value=\"1\">по длительности</option>\n                  </select>\n                </span>\n                </div>\n              </div>\n              <input type=\"submit\" class=\"gogoleft\">\n\n\n            </form>\n            <div class=\"relative\">\n              <div class=\"lineLoader\" ng-class=\"{\'active\':ctr.searchInProgress}\">\n                <i class=\"fa fa-spin fa-circle-o-notch\"></i>\n              </div>\n            </div>\n            <div class=\"videoList clearfix\" ng-hide=\"ctr.searchInProgress\">\n              <div video-cover ng-click=\"ctr.selectVideo(video)\" ng-repeat=\"video in ctr.searchedVideos\"></div>\n            </div>\n          </div>\n        </tab>\n        <tab heading=\"видео сообщества\" ng-click=\"ctr.loadGroupVideos()\">\n          <div class=\"bodyWithTabs\">\n            <div class=\"relative\">\n              <div class=\"lineLoader\" ng-class=\"{\'active\':ctr.loadGroupVideosInProgress}\">\n                <i class=\"fa fa-spin fa-circle-o-notch\"></i>\n              </div>\n            </div>\n            <div class=\"videoList clearfix\" ng-hide=\"ctr.loadGroupVideosInProgress\">\n              <div video-cover ng-click=\"ctr.selectVideo(video)\" ng-repeat=\"video in ctr.groupVideos\"></div>\n            </div>\n            <div class=\"noResults\" ng-show=\"ctr.groupSearchError\" ng-bind=\"ctr.groupSearchError\"></div>\n            <div class=\"noResults\" ng-show=\"ctr.groupVideos.length === 0\">Нет ни одной видеозаписи</div>\n          </div>\n        </tab>\n        <tab heading=\"мои видео\" ng-click=\"ctr.loadUserVideos()\">\n          <div class=\"bodyWithTabs\">\n            <div class=\"relative\">\n              <div class=\"lineLoader\" ng-class=\"{\'active\':ctr.loadUserVideosInProgress}\">\n                <i class=\"fa fa-spin fa-circle-o-notch\"></i>\n              </div>\n            </div>\n            <div class=\"videoList clearfix\" ng-hide=\"ctr.loadUserVideosInProgress\">\n              <div video-cover ng-click=\"ctr.selectVideo(video)\" ng-repeat=\"video in ctr.userVideos\"></div>\n            </div>\n            <div class=\"noResults\" ng-show=\"ctr.userSearchError\" ng-bind=\"ctr.userSearchError\"></div>\n            <div class=\"noResults\" ng-show=\"ctr.userVideos.length === 0\">Нет ни одной видеозаписи</div>\n          </div>\n        </tab>\n      </tabset>\n    </div>\n\n  </div>\n  <div class=\"modal-footer fixed-footer ng-hide\">\n    <button class=\"btn btn-primary\" ng-click=\"ctr.closeDialog()\">прикрепить\n      <span ng-pluralize count=\"ctr.selectedAttachments.length\" when=\"ctr.imagesPlurals\">\n      </span>\n    </button>\n    <button class=\"btn btn-link pull-right fixRight\" ng-click=\"$dismiss()\">отмена</button>\n  </div>\n</section>\n");
$templateCache.put("templates/modals/videoPlayer.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\"><div class=\"ellipsis\" ng-bind=\"ctr.title\"></div></h3>\n</div>\n<iframe ng-src=\"{{ctr.videoSrc}}\" width=\"598\" height=\"400\" frameborder=\"0\" style=\"float: left;margin-top: -1px;\"></iframe>\n<div class=\"clearfix\"></div>\n<div class=\"modal-footer fixed-footer clearfix\" style=\"height: 64px;\">\n  <button class=\"btn btn-link pull-right fixRight\" ng-click=\"$dismiss()\">закрыть</button>\n</div>\n");}]);