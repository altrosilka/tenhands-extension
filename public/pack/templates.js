angular.module("templates",[]).run(["$templateCache",function(n){n.put("templates/directives/channel.html",'<div class="channel socialBg" data-network="{{channel_ctr.network}}" ng-class="{\'complete\': channel_ctr.isComplete(), \'fail\': channel_ctr.isFail(), \'inprogress\':channel_ctr.showProgress(channel)}" ng-ifs="channel.separately || channel_ctr.textOverflow()">\n  <div class="workArea">\n\n    <div class="inner" ng-class="{\'disabledChannel\':channel.disabled}">\n      <div class="avatar" ng-class="{\'not\':!channel.img}" ng-click="channel_ctr.toggleChannel()">\n        <div class="photoavatar" ng-class="{\'background-size\':\'url(\'+channel.img+\')\'}"></div>\n        <div class="bulka social_bg deep" data-network="{{channel.network}}">\n          <span class="vk" ng-if="channel.network === \'vk\'"><i class="fa fa-vk"></i></span>\n          <span class="fb" ng-if="channel.network === \'fb\'"><i class="fa fa-facebook"></i></span>\n          <span class="tw" ng-if="channel.network === \'tw\'"><i class="fa fa-twitter"></i></span>\n          <span class="gp" ng-if="channel.network === \'gp\'"><i class="fa fa-google-plus"></i></span>\n          <span class="ok" ng-if="channel.network === \'ok\'"><i class="fa fa-ok"></i></span>\n        </div>\n        <div class="title" ng-bind="channel.screen_name">\n        </div>\n      </div>\n      <div class="fakeOverlay" ng-if="channel.inprogress">\n        <i class="ion-radio-waves fa-spin"></i>\n      </div>\n\n      <!-- FACEBOOK -->\n      <div ng-if="channel.network === \'fb\'">\n        <textarea class="form-control" autosize-textarea ng-model="channel.text"></textarea>\n      </div>\n\n      <!-- OK -->\n      <div ng-if="channel.network === \'ok\'">\n        <textarea class="form-control" autosize-textarea ng-model="channel.text"></textarea>\n      </div>\n\n      <!-- VK -->\n      <div ng-if="channel.network === \'vk\'">\n        <textarea class="form-control" autosize-textarea ng-model="channel.text"></textarea>\n      </div>\n\n      <!-- TWITTER -->\n      <div ng-if="channel.network === \'tw\'">\n        <div textarea-validator image="image" channel-info="channel" show-counter="true"></div>\n      </div>\n\n    </div>\n  </div>\n  <div class="completeArea">\n    Публикация в <strong ng-bind="channel.screen_name"></strong> завершена.\n    <br>\n    <br><small>Ссылка для просмотра:<br>\n    <a target="_blank" class="link" ng-href="{{channel.post_url}}" ng-bind="channel.post_url"></a>&nbsp;<i class="fa fa-external-link"></i>\n    </small>\n  </div>\n  <div class="failArea">\n    Публикация в <strong ng-bind="channel.screen_name"></strong> не удалась.\n\n    <br>Причина:&nbsp;<strong ng-bind="channel_ctr.getFailDescription()"></strong>\n    <div class="buttons">\n      <button class="btn btn-primary" ng-click="channel_ctr.postInChannelAgain()">Попробовать еще раз</button>\n      <button class="btn btn-default" ng-click="channel_ctr.editPost()">Изменить запись</button>\n    </div>\n  </div>\n</div>\n'),n.put("templates/directives/channelLogo.html",'<div class="channelLogo" ng-class="{\'not\':!channel.img, \'disabled\':channel.disabled}" tooltip="{{channel.screen_name}}" tooltip-animation="false" tooltip-placement="top" tooltip-append-to-body="true" tooltip-trigger="mouseenter" ng-click="ctr.toggleChannel(channel)">\n  <div class="photoavatar" ng-class="{\'background-size\':\'url(\'+channel.img+\')\'}"></div>\n  <div class="bulka social_bg deep" data-network="{{channel.network}}">\n    <span class="vk" ng-if="channel.network === \'vk\'"><i class="fa fa-vk"></i></span>\n    <span class="fb" ng-if="channel.network === \'fb\'"><i class="fa fa-facebook"></i></span>\n    <span class="tw" ng-if="channel.network === \'tw\'"><i class="fa fa-twitter"></i></span>\n    <span class="gp" ng-if="channel.network === \'gp\'"><i class="fa fa-google-plus"></i></span>\n    <span class="ok" ng-if="channel.network === \'ok\'"><i class="fa fa-ok"></i></span>\n  </div>\n</div>\n'),n.put("templates/directives/customSelect.html",'<div class="custom_select" ng-class="{\'opened\':cSCtr.opened}">\n  <section ng-click="cSCtr.open()" ng-bind-html="section"></section>\n  <menu ng-show="customContent" data-role="custom-content"></menu>\n  <menu ng-show="!customContent">\n    <button class="option" ng-repeat="option in options" ng-click="cSCtr.selectOption($event, option)" ng-disabled="cSCtr.isDisabled(option)" ng-class="{\'active\':cSCtr.isActive(option)}">\n      <span compile="optionFormat"></span>\n    </button>\n  </menu>\n</div> \n '),n.put("templates/directives/dateButton.html",'<div class="dateButton" ng-click="ctr.toggle($event)">\n  <i class="ion-android-calendar cal"></i>\n  <div class="form-control" ng-bind="viewModel"></div>\n\n  <input type="text" class="hidden-input" close-text="Закрыть" is-open="ctr.isOpen" datepicker-popup="dd.MM.yyyy" ng-model="model" show-button-bar="false" min-date="minDate" max-date="maxDate" datepicker-options="{ showWeeks: false,  maxMode: \'day\', startingDay: 1, showButtonBar: false, formatDay: \'d\'}" >\n</div>\n'),n.put("templates/directives/imageUploadArea.html",'<input id="fileupload" class="btn btn-primary" type="file" name="file" multiple>  \n\n'),n.put("templates/directives/jcropArea.html",'<div class="modal-header">\n  <h3>Редактирование фотографии</h3>\n</div>\n<div class="modal-body">\n  <div class="jcropArea">\n    <div class="image">\n      <img id="cropImage" ng-src="{{ctr.image}}" ng-style="{\'maxHeight\':ctr.maxHeight}">\n    </div>\n\n  </div>\n</div>\n<div class="modal-footer">\n  <span class="btn btn-primary" ng-click="ctr.applyCrop(ctr.coords)">сохранить</span>\n  <button class="btn btn-link pull-right fixRight" ng-click="ctr.cancelCrop()">отмена</button>\n</div>\n'),n.put("templates/directives/oneChannel.html",'<div class="oneChannel">\n\n\n\n  <div class="clearfix">\n    <div class="area pull-left">\n\n      <div class="ng-hide clearfix">\n        <span channel-logo="channel" ng-repeat="channel in channels" ng-if="!channel.separately"></span>\n      </div>\n\n      <textarea class="ng-hide form-control" autosize-textarea ng-model="ctr.text" ng-keyup="ctr.getMaxTextLength()" ng-keydown="ctr.getMaxTextLength()"></textarea>\n\n      <div class="ng-hide notOneChannel" ng-if="ctr.showDesc()">\n        Отредактируйте текст в каналах ниже:\n      </div>\n\n      <div class="channelsList">\n        <div channel="channel" class="tourFader" data-step="channel" ng-repeat="channel in channels" text="ctr.text" image="image" post-channel-again="ctr.postChannelAgain(channel.id)"></div>\n      </div>\n    </div>\n    <div class="image pull-left tourFader" data-step="image">\n      <div class="addWrap" ng-if="!image.src_big">\n        <div class="addImage" ng-click="ctr.attachImage()">\n          <i class="ion-camera"></i>\n          <span>Добавить изображение</span>\n        </div>\n      </div>\n      <div class="realImage" ng-if="image.src_big">\n        <div class="imageArea">\n          <div class="removeImage ion-close-round" ng-click="ctr.removeImage()"></div>\n          <div class="imgWrap" ng-click="ctr.editImage()">\n            <img ng-src="{{image.src_big}}">\n          </div>\n        </div>\n        <div class="text-center">\n          <div class="edit ib" ng-click="ctr.editImage()">\n            <i class="ion-paintbrush"></i>\n            <span>редактировать</span>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n</div>'),n.put("templates/directives/photobankSearch.html",'<div class="text-center photobankSearch">\n  <form class="mb10" ng-submit="pbctr.search(pbctr.q)">\n    <div class="relative fsSearchBlock">\n      <i class="fa fa-search"></i>\n      <input autofocus="autofocus" class="form-control search" type="text" ng-model="pbctr.q" placeholder="spa или борщ">\n      <div class="btn btn-link pointer info" popover-placement="left" popover-trigger="click" popover-html-unsafe="{{pbctr.aboutSearchText}}" popover-append-to-body="true">что это?</div>\n      <!--<div class="input-group-addon btn btn-default" ng-click="pbctr.search(pbctr.q)">поиск</div>-->\n    </div>\n    <input type="submit" class="gogoleft">\n  </form>\n\n  <div select-area selected-attachments="ctr.selectedAttachments" attachments="pbctr.attachments" on-attach-click="ctr.sendAttach(attach)"></div>\n</div>\n'),n.put("templates/directives/popoverHtmlUnsafePopup.html",'<div class="popover {{placement}}" data-ng-class="{ in: isOpen, fade: animation() }" data-ng-click="isOpen = false">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n    <h3 class="popover-title" data-ng-bind="title" data-ng-show="title"></h3>\n    <div class="popover-content" data-bind-html-unsafe="content"></div>\n  </div>\n</div> '),n.put("templates/directives/selectArea.html",'<div class="attaches clearfix">\n  <div class="attach" ng-repeat="attach in attachments" ng-class="{selected: ctr.attachIsSelected(attach)}">\n    <div class="process">\n      <i class="ion-load-c fa-spin"></i>\n    </div>\n    <div class="image" ng-click="ctr.onAttachClick(attach)" ng-style="{\'background-image\':\'url(\'+attach.src+\')\'}">\n    </div>\n    <div class="lower" ng-click="ctr.remove(attach)"></div>\n    <div class="actions">\n      <div class="check lay" ng-click="ctr.toggle(attach)">\n        <i class="ion-checkmark-round"></i>\n      </div>\n    </div>\n\n    <div class="info" ng-hide="!attach.width || attach.clientWidth">\n      <span tooltip-placement="left" tooltip="Видимый размер изображения">\n              {{attach.clientWidth}}x{{attach.clientHeight}} \n            </span>\n      <span class="gray" ng-if="ctr.showRealImageSize(attach)" tooltip-placement="left" tooltip="Оригинальный резмер изображения">\n              ({{attach.width}}x{{attach.height}})\n            </span>\n    </div>\n  </div>\n\n  <div class="noResults" ng-bind="ctr.noAttachesText" ng-show="!attachments.length"></div>\n</div>\n'),n.put("templates/directives/selectCropArea.html",'<div class="attaches clearfix" ng-hide="!attachments.length">\n  <div class="attach" ng-repeat="attach in attachments" ng-class="{\'processing\':ctr.attachIsProcessing(attach), selected: ctr.attachIsSelected(attach)}" data-type="{{attach.type}}">\n    <section ng-if="attach.type ===\'image\'">\n      <div class="process">\n        <i class="ion-load-c fa-spin"></i>\n      </div>\n      <div class="image" ng-click="_ctr.edit(attach)" ng-style="{\'background-image\':\'url(\'+attach.src+\')\'}">\n      </div>\n      <div class="actions">\n        <div class="check lay" ng-click="ctr.remove(attach)">\n          <i class="ion-android-close"></i>\n        </div>\n      </div>\n \n      <div class="info" ng-show="attach.clientWidth || attach.width">\n        <span tooltip-placement="left" tooltip="Видимый размер изображения">\n              {{attach.clientWidth}}x{{attach.clientHeight}} \n            </span>\n        <span class="gray" ng-if="ctr.showRealImageSize(attach)" tooltip-placement="left" tooltip="Оригинальный резмер изображения">\n              ({{attach.width}}x{{attach.height}})\n            </span>\n      </div>\n    </section>\n    <section ng-if="attach.type ===\'video\'">\n      <div class="playButton" ng-click="ctr.openVideo(attach)">\n        <i class="fa fa-play-circle"></i>\n      </div>\n      <div class="image" ng-click="ctr.openVideo(attach)" ng-style="{\'background-image\':\'url(\'+attach.src+\')\'}"></div>\n      <div class="actions">\n        <div class="check lay" ng-click="ctr.remove(attach)">\n          <i class="ion-android-close"></i>\n        </div>\n      </div>\n      <div class="info">\n        <span ng-bind="attach.duration | toGIS"></span>\n      </div>\n    </section>\n    <section ng-if="attach.type ===\'poll\'" attach-poll="attach" destroy="ctr.remove(attach)">\n\n    </section>\n  </div>\n</div>\n'),n.put("templates/directives/selectDate.html",'<div class="date-selector">\n  <div class="inputs" ng-hide="hideInputs">\n    <input onclick="this.select()" class="day" type="text" placeholder="11" data-ng-model="editdate.day">\n    <input onclick="this.select()" class="month" type="text" placeholder="08" data-ng-model="editdate.month">\n    <input onclick="this.select()" class="year" type="text" placeholder="2014" data-ng-model="editdate.year">\n  </div>\n\n  <input type="text" class="hidden-input" close-text="Закрыть" is-open="isOpen" datepicker-popup="dd.MM.yyyy" ng-model="model" show-button-bar="false" min-date="minDate"  max-date="maxDate" datepicker-options="{ showWeeks: false,  maxMode: \'day\', startingDay: 1, showButtonBar: false, formatDay: \'d\'}" ng-required="true">\n</div>\n'),n.put("templates/directives/socialTemplateEditor.html",'<div class="socialTemplateEditor">\n  <h3>Редактор шаблона</h3>\n  <p>Укажите в поле ниже какую именно информацию с сайта нужно использовать и в каком порядке</p>\n  <textarea class="form-control" ng-model="ctr.template" ng-blur="ctr.setTemplate()"></textarea>\n  Можно использовать как простой текст, так и переменные. Переменные выделяются двойными фигурными скобками, например <code ng-non-bindable>{{title}}</code>\n  <p>Доступны следующие переменные:</p>\n  <ul>\n    <li><code ng-non-bindable>{{title}}</code> - заголовок страницы\n    </li>\n    <li><code ng-non-bindable>{{description}}</code> - содержимое метатега description\n    </li>\n    <li><code ng-non-bindable>{{url}}</code> - ссылка на сайт</li>\n    <li><code ng-non-bindable>{{h1}}</code><code ng-non-bindable>{{h2}}</code><code ng-non-bindable>{{h3}}</code> - текст из первых тегов <b>h1</b>, <b>h2</b> или <b>h3</b>\n    </li>\n    <li class="hide"><code ng-non-bindable>{{url_clear_hash}}</code> - ссылка на сайт без якоря (текст после символа <code>#</code>)\n    </li>\n    <li class="hide"><code ng-non-bindable>{{url_clear_search}}</code> - ссылка на сайт без текста после символа <code>?</code>\n    </li>\n  </ul> \n\n  <div class="vars">\n    <p><b>Значения переменных</b> на текущей странице (для примера):</p>\n    <div class="var">\n      <h4>title</h4>\n      <div class="val" ng-bind="ctr.getVar(\'title\')"></div>\n    </div>\n    <div class="var">\n      <h4>description</h4>\n      <div class="val" ng-bind="ctr.getVar(\'description\')"></div>\n    </div>\n    <div class="var">\n      <h4>url</h4>\n      <div class="val" ng-bind="ctr.getVar(\'url\')"></div>\n    </div>\n    <div class="var">\n      <h4>h1</h4>\n      <div class="val" ng-bind="ctr.getVar(\'h1\')"></div>\n    </div>\n    <div class="var">\n      <h4>h2</h4>\n      <div class="val" ng-bind="ctr.getVar(\'h2\')"></div>\n    </div>\n    <div class="var">\n      <h4>h3</h4>\n      <div class="val" ng-bind="ctr.getVar(\'h3\')"></div>\n    </div>\n  </div>\n</div>\n'),n.put("templates/directives/textareaValidator.html",'<div class="textareaValidator">\n  <textarea class="textarea"></textarea> \n  <section class="invis">\n    <section class="ng-hide urls"></section>\n    <section class="text"></section>\n    <section class="counter"><span></span></section>\n  </section>\n</div> '),n.put("templates/directives/timeSelect.html",'<span class="timeSelect">\n	<span class="selectWrapper">\n		<select ng-model="ctr.hour" class="form-control" ng-options="ctr.getView(option) for option in ctr.hours" ng-change="ctr.updateTime()"></select>\n	</span>\n	<span class="sep">:</span>\n	<span class="selectWrapper">\n		<select ng-model="ctr.minute" class="form-control" ng-options="ctr.getView(option) for option in ctr.minutes" ng-change="ctr.updateTime()"></select>\n	</span>\n</span>\n'),n.put("templates/modals/attachPhoto.html",'<section class="attachPhoto">\n  <div class="modal-header">\n    <h3 class="modal-title">Прикрепление фотографии</h3>\n  </div>\n  <div class="modal-body">\n    <div class="up-level-tabs">\n      <tabset>\n        <tab heading="со страницы" active="true">\n\n          <div class="bodyWithTabs">\n            <div select-area selected-attachments="ctr.selectedAttachments" attachments="ctr.pageAttachments" on-attach-click="ctr.sendAttach(attach)" no-attaches-text="Нет подходящих изображений"></div>\n          </div>\n        </tab>\n        <tab heading="из фотобанка">\n          <div class="bodyWithTabs">\n            <div photobank-search></div>\n          </div>\n        </tab>\n\n        <label class="uploadImage">\n          <span>загрузить с компьютера</span>\n          <div class="gogoleft" image-upload-area on-upload-start="ctr.beforeUploading" after-image-uploaded="ctr.afterUploading"></div>\n        </label>\n      </tabset>\n\n    </div>\n\n  </div>\n</section>\n'),n.put("templates/modals/editImage.html",'<link href=\'http://fonts.googleapis.com/css?family=PT+Sans|Ubuntu|Lobster|Open+Sans|Roboto:300|Open+Sans+Condensed:300|Ledger|Cuprum&subset=latin,cyrillic\' rel=\'stylesheet\' type=\'text/css\'>\n<script src="/js/fabric.min.js"></script>\n<section class="vm_editImage"> \n  <div class="modal-header">\n    <h3 class="modal-title">Редактирование изображения</h3>\n  </div>\n  <div class="modal-body">\n    <div class="clearfix">\n      <div class="image pull-left" style="width:600px">\n        <div editing-canvas image="ctr.image" text="ctr.text" options="ctr.options" style="-webkit-transform-origin: 0 0;"></div>\n      </div>\n      <div class="editWindow pull-left">\n        <div class="textOpt">\n          <textarea class="text form-control" ng-model="ctr.text"></textarea>\n\n\n          <div edit-image-valign-option model="ctr.options.valign" set-value="ctr.setValue" class="valign"></div>\n\n        </div>\n        <div class="opt font clearfix">\n          <h3>Шрифт</h3>\n\n          <div edit-image-font-family-option model="ctr.options.fontFamily" set-value="ctr.setValue" class="family pull-left"></div>\n          <div edit-image-font-size-option model="ctr.options.fontSize" set-value="ctr.setValue" class="size pull-left"></div>\n          <div edit-image-color-option model="ctr.options.color" set-value="ctr.setValue" class="pull-left colorwrap"></div>\n\n        </div>\n\n        <div class="opt textShadow">\n          <h3>Тень шрифта</h3>\n          <div edit-image-text-shadow-option model="ctr.options.textShadow" set-value="ctr.setValue"></div>\n        </div>\n\n\n        <!--<div class="opt image">\n          <h3>Изображение</h3>\n          <div edit-image-filter-option model="ctr.options.filter" set-value="ctr.setValue"></div>\n        </div>-->\n        <div class="">\n          <button class="btn btn-primary" ng-click="ctr.saveImage()">сохранить</button>\n          <button class="btn btn-default" ng-click="$dismiss()">отмена</button>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</section>\n'),n.put("templates/modals/table.html",'<section class="vm_table">\n  <div class="modal-header">\n    <h3 class="modal-title">Расписание записей</h3>\n  </div>\n  <div class="modal-body"> \n    <div ui-calendar="uiConfig.calendar" ng-model="eventSources" calendar="calendar"></div>\n\n  </div>\n</section>\n'),n.put("templates/modals/videoPlayer.html",'<div class="modal-header">\n  <h3 class="modal-title"><div class="ellipsis" ng-bind="ctr.title"></div></h3>\n</div>\n<iframe ng-src="{{ctr.videoSrc}}" width="598" height="400" frameborder="0" style="float: left;margin-top: -1px;"></iframe>\n<div class="clearfix"></div>\n<div class="modal-footer fixed-footer clearfix" style="height: 64px;">\n  <button class="btn btn-link pull-right fixRight" ng-click="$dismiss()">закрыть</button>\n</div>\n'),n.put("templates/other/timeLinePostTooltip.html",'<div class="timeLinePostTooltip">\n  <div class="post clearfix" ng-repeat="post in posts">\n    <section>\n      <div class="left" vk-post-attachments="getAttachments(post)" first="true"></div>\n      <div class="right">\n        <div class="text" ng-bind-html="getText(post) | substring : 200 | parseVkText : true"></div>\n        <span class="date gray" ng-bind="post.date * 1000 | date : \'HH:mm\'"></span>\n      </div>\n    </section>\n  </div>\n</div>\n'),n.put("templates/views/login.html",'<section class="v_login"  ng-controller="C_login as login_ctr">\n  <form class="text-center" ng-class="{\'error\':login_ctr.error}" ng-submit="login_ctr.auth(login_ctr.email, login_ctr.password)">\n    <div>\n      <div class="wrapInput"> \n        <span class="input input--juro" ng-class="{\'input--filled\': login_ctr.email != \'\'}">\n	    <input class="input__field input__field--juro" type="text" id="input-1" ng-model="login_ctr.email" />\n	    <label class="input__label input__label--juro" for="input-1">\n	        <span class="input__label-content input__label-content--juro">Адрес электронной почты</span>\n        </label>\n        </span>\n      </div>\n      <div class="wrapInput">\n        <span class="input input--juro" ng-class="{\'input--filled\': login_ctr.password != \'\'}">\n	    <input class="input__field input__field--juro" type="password" id="input-2" ng-model="login_ctr.password" />\n	    <label class="input__label input__label--juro" for="input-2">\n	        <span class="input__label-content input__label-content--juro">Пароль</span>\n        </label>\n        </span>\n      </div>\n    </div>\n    <div>\n      <button class="btn btn-primary introButton">\n      	<span>Войти</span>\n      </button>\n    </div>\n    <input type="submit" class="gogoleft">\n  </form>\n</section>\n'),n.put("templates/directives/editImage/colorOption.html",'<div>\n  <label class="color"><input ng-model="ctr.value" colorpicker="rgba" colorpicker-position="top"></label>\n</div>\n  '),n.put("templates/directives/editImage/filter.html",'<div custom-select section-format="ctr.getSelectPlaceholder()" custom-content="true">\n  <button class="option" ng-repeat="point in ctr.collection" ng-click="ctr.onFontchange(point);$close();">\n    {{point.title}}\n  </button>\n</div>\n'),n.put("templates/directives/editImage/fontFamilyOption.html",'<div custom-select section-format="ctr.getSelectPlaceholder()" custom-content="true">\n  <button class="option" ng-repeat="font in ctr.fontsCollection" ng-click="ctr.onFontchange(font);$close();" ng-style="ctr.getFontStyle(font)">\n    {{font.family}} ({{font.weight}})\n  </button>\n</div>\n'),n.put("templates/directives/editImage/fontSizeOption.html",'<div custom-select section-format="ctr.getSelectPlaceholder()" custom-content="true">\n  <button class="option" ng-repeat="font in ctr.fontsCollection" ng-click="ctr.onFontchange(font);$close();">\n    {{font.size}}\n  </button>\n</div>\n '),n.put("templates/directives/editImage/textShadowOption.html",'<div>\n  <span class="dx" tooltip="Расстояние по оси X" tooltip-animation="false" tooltip-trigger="mouseenter" tooltip-append-to-body="true" tooltip-placement="top"><input type="number" ng-model="model.x"></span>\n  <span class="dy" tooltip="Расстояние по оси Y" tooltip-animation="false" tooltip-trigger="mouseenter" tooltip-append-to-body="true" tooltip-placement="top"><input type="number" ng-model="model.y"></span>\n  <span class="width" tooltip="Ширина тени" tooltip-animation="false" tooltip-trigger="mouseenter" tooltip-append-to-body="true" tooltip-placement="top"><input type="number" ng-model="model.width"></span>\n  <label ng-style="{\'background-color\':model.color}" class="color"><input ng-model="model.color" colorpicker="rgba" colorpicker-position="top"></label>\n</div>\n'),n.put("templates/directives/editImage/valign.html",'<div custom-select section-format="ctr.getSelectPlaceholder()" custom-content="true">\n  <button class="option" ng-repeat="point in ctr.collection" ng-click="ctr.onFontchange(point);$close();">\n    {{point.text}}\n  </button>\n</div>\n')}]);