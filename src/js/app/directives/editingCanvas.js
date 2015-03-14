angular.module('App').directive('editingCanvas', function($timeout, S_eventer, S_utils, __maxImageWidth) {
  return {
    scope: {
      image: '=',
      text: '=',
      options: '='
    },
    template: '<div id="photoFilter" style="display:none;position: absolute;  width: 100%;height: 100%;"></div><canvas id="exportImage" style="position: absolute;left:-500px"></canvas>',
    link: function($scope, $element) {
      var _image, _areaWidth, _scale, _imgScale;
      var paperCollection = {};

      var _paper, _filteredImage = {};

      var options = $scope.options;

      var IDS = {
        canvas: "exportImage",
        img: "photoFilter"
      }

      var DOM = {
        canvas: $element.find('#' + IDS.canvas),
        img: $element.find('#' + IDS.img)
      }

      $scope.$on('saveImageRequest', function(text) {
        var q = _paper;

        var context = _filteredImage.canvas.getContext("webgl", {
          preserveDrawingBuffer: true
        });

        var img = new Image();


        img.onload = function() {
          fabric.Image.fromURL(this.src, function(img) {
            paperCollection.image = img;
            fullLock(img);
            img.scaleX = _imgScale;
            img.scaleY = _imgScale;

            _paper.add(img);
            img.bringForward();
            placeZindex();


            _paper.renderAll();

            var url = _paper.toDataURL({
              format: 'jpeg',
              quality: 0.8
            });

            var img = new Image();
            img.src = url;
            img.onload = function() {

              var canvas = document.createElement('canvas');

              canvas.width = this.width / multiple(1);
              canvas.height = this.height / multiple(1);
              if (canvas.width > __maxImageWidth) {
                canvas.height = canvas.height / canvas.width * __maxImageWidth;
                canvas.width = __maxImageWidth;
              }
              var ctx = canvas.getContext('2d');

              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              S_eventer.sendEvent('imageDataRecieved', canvas.toDataURL('image/jpeg', 1));
            }
          });



        }
        img.src = _filteredImage.canvas.toDataURL('image/png');

      });

      $scope.$watch('text', function(text) {
        if (typeof text === 'undefined' || !_image) return;

        $timeout(function() {
          placeText(options);
        });
      });

      $scope.$watch('options', function(opt, oldOpt) {
        if (typeof opt === 'undefined' || !_image) return;


        if (opt.fontFamily !== oldOpt.fontFamily) {
          $timeout(function() {
            placeText(opt);
          }, 300);
        }


        if (opt.canvas.border.color !== oldOpt.canvas.border.color || opt.canvas.border.width !== oldOpt.canvas.border.width || opt.canvas.borderInner.color !== oldOpt.canvas.borderInner.color || opt.canvas.borderInner.width !== oldOpt.canvas.borderInner.width) {
          drawBorder(opt);
        }

        if (opt.canvas.fillColor !== oldOpt.canvas.fillColor) {
          drawFill(opt);
        }


        if (opt.filter !== oldOpt.filter) {
          drawImage(opt);
        }

        $timeout(function() {
          placeText(opt);
        });
        $timeout(function() {
          placeZindex();
        });

        options = opt;

      }, true);

      $timeout(function() {

        _areaWidth = $element[0].clientWidth;

        var img = new Image();
        img.onload = function() {
          DOM.img.attr('src', this.src).show();
          options.originalImage = this.src;
          _image = this;
          draw();
          $timeout(function() {
            placeText(options);
            drawBorder(options);
            drawFill(options);
                    placeZindex();
          });

          var canvas = fx.canvas();

          _filteredImage.canvas = canvas;
          _filteredImage.texture = canvas.texture(this)

          window.q = _filteredImage;

          var scale = multiple(1);
          if (_image.width > __maxImageWidth) {
            scale /= _image.width / __maxImageWidth;
          }

          DOM.img.html($(canvas)).find('canvas').css({
            '-webkit-transform': 'scale(' + (scale) + ')',
            '-webkit-transform-origin': '0 0'
          });

          drawImage(options);

        }
        img.src = $scope.image.src_original || $scope.image.src_big;




      });

      function placeZindex() {
        paperCollection.canvasFill.bringToFront(200);
        paperCollection.text.bringToFront(500);
        paperCollection.canvasBorder.bringToFront(1000);
        paperCollection.canvasBorderInner.bringToFront(1000);
      }

      function draw() {
        var imageWidth = originalImageWidth = options.width = multiple(_image.width);
        var imageHeight = originalImageHeight = options.height = multiple(_image.height);


        if (imageWidth > multiple(__maxImageWidth)) {
          imageHeight = options.height = imageHeight / imageWidth * multiple(__maxImageWidth);
          imageWidth = options.width = multiple(__maxImageWidth);
        }

        _scale = _areaWidth / imageWidth;
        _paper = new fabric.Canvas(IDS.canvas, {
          selection: false
        });

        DOM.canvas.attr({
          width: imageWidth,
          height: imageHeight
        });

        $element.parent().height(imageHeight * _scale);

        _paper.setWidth(imageWidth);
        _paper.setHeight(imageHeight);

        _imgScale = multiple(1) / (originalImageWidth / options.width);

        setElementScale(_scale);
      }

      function drawImage(options) {
        if (!options.filter || options.filter === 'none') {
          _filteredImage.canvas.draw(_filteredImage.texture).update();
          return;
        }

        var filter = S_utils.getFilterByName(options.filter);

        var can = _filteredImage.canvas.draw(_filteredImage.texture);
        _.forEach(filter.info, function(val, key) {
          if (typeof can[key] === 'function') {
            if (_.isArray(!val)) {
              val = [val];
            }
            can[key].apply(can, val);
          }
        });
        can.update();
      }

      function drawBorder(options) {
        if (paperCollection.canvasBorder) {
          paperCollection.canvasBorder.remove();
        }
        var bopt = options.canvas.border;
        paperCollection.canvasBorder = new fabric.Rect({
          fill: 'transparent',
          stroke: bopt.color,
          strokeWidth: multiple(bopt.width),
          width: options.width - multiple(bopt.width),
          height: options.height - multiple(bopt.width)
        });
        fullLock(paperCollection.canvasBorder);
        _paper.add(paperCollection.canvasBorder);

        if (paperCollection.canvasBorderInner) {
          paperCollection.canvasBorderInner.remove();
        }
        var bopt = options.canvas.borderInner;
        var bMainoptWidth = multiple(options.canvas.border.width);
        var mWidth = multiple(bopt.width);
        paperCollection.canvasBorderInner = new fabric.Rect({
          fill: 'transparent',
          stroke: bopt.color,
          strokeWidth: mWidth,
          left: bMainoptWidth,
          top: bMainoptWidth,
          width: options.width - mWidth - bMainoptWidth * 2,
          height: options.height - mWidth - bMainoptWidth * 2
        });
        fullLock(paperCollection.canvasBorderInner);
        _paper.add(paperCollection.canvasBorderInner);

      }


      function drawFill(options) {
        if (paperCollection.canvasFill) {
          paperCollection.canvasFill.remove();
        }
        var bopt = options.canvas.border;
        paperCollection.canvasFill = new fabric.Rect({
          fill: options.canvas.fillColor,
          strokeWidth: 0,
          width: options.width,
          height: options.height
        });
        fullLock(paperCollection.canvasFill);
        _paper.add(paperCollection.canvasFill);
        _paper.renderAll();
      }

      function placeText(options) {
        if (paperCollection.text) {
          paperCollection.text.remove();
        }

        var tunePadding = multiple(options.canvas.padding);

        paperCollection.text = new fabric.Text($scope.text, {
          fontSize: multiple(options.fontSize),
          fontFamily: options.fontFamily,
          fontWeight: options.fontWeight,
          textAlign: 'center',
          fill: options.color,
          shadow: getShadowString(options),
          top: tunePadding,
          left: tunePadding,
          transparentCorners: false,
          fillRule: 'evenodd'
        });
        fullLock(paperCollection.text);


        var textWidth = options.width - tunePadding * 2;
        _paper.add(paperCollection.text);
        wrapCanvasText(paperCollection.text, _paper, textWidth);
        _paper.renderAll();
        alignText(paperCollection.text, options);
        _paper.renderAll();


        tunePosition(paperCollection.text, textWidth);
        _paper.renderAll();


      }


      function alignText(t, options) {
        var y = 0,
          textHeight = t.getBoundingRect().height;


        switch (options.valign) {
          case 'top':
            {
              y = multiple(options.canvas.padding);
              break;
            }
          case 'middle':
            {
              y = options.height / 2 - textHeight / 2;
              break
            }
          case 'bottom':
            {
              y = options.height - textHeight - multiple(options.canvas.padding);
              break
            }
        }
        t.top = y;
      }

      function getShadowString(opt, ignoreMult) {
        var ts = options.textShadow;
        ts.color = ts.color || '';
        var m = multiple(1);
        if (ignoreMult) {
          m = 1;
        }
        return ts.color + ' ' + m * ts.x + 'px ' + m * ts.y + 'px ' + m * ts.width + 'px';
      }

      function setElementScale(scale) {
        $element.css({
          '-webkit-transform': 'scale(' + scale + ')',
          'position': 'absolute'
        });

        ;
      }



      function wrapCanvasText(t, canvas, maxW, maxH, justify) {

        if (typeof maxH === "undefined") {
          maxH = 0;
        }
        var words = t.text.split(" ");
        var formatted = '';

        // This works only with monospace fonts
        justify = justify || 'left';

        // clear newlines
        var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
        // calc line height
        var lineHeight = new fabric.Text(sansBreaks, {
          fontFamily: t.fontFamily,
          fontSize: t.fontSize
        }).height;

        // adjust for vertical offset
        var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
        var context = canvas.getContext("2d");


        context.font = t.fontSize + "px " + t.fontFamily;
        var currentLine = '';
        var breakLineCount = 0;

        n = 0;
        while (n < words.length) {
          var isNewLine = currentLine == "";
          var testOverlap = currentLine + ' ' + words[n];

          // are we over width?
          var w = context.measureText(testOverlap).width;

          if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
          } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
              var wordOverlap = "";

              // test word length until its over maxW
              for (var i = 0; i < words[n].length; ++i) {

                wordOverlap += words[n].charAt(i);
                var withHypeh = wordOverlap + "-";

                if (context.measureText(withHypeh).width >= maxW) {
                  // add hyphen when splitting a word
                  withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                  // update current word with remainder
                  words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                  formatted += withHypeh; // add hypenated word
                  break;
                }
              }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
              currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
              currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
          }
          if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
          }
          n++;
        }

        if (currentLine != '') {
          while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

          while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

          formatted += currentLine + '\n';
          breakLineCount++;
          currentLine = "";
        }

        // get rid of empy newline at the end
        formatted = formatted.substr(0, formatted.length - 1);

        t.setText(formatted);
      }

      function tunePosition(t, width) {
        t.left = t.left + (width - t.currentWidth) / 2;
      }

      function fullLock(obj) {
        obj.selectable = false;
        obj.lockUniScaling = true;
        obj.lockMovementX = true;
        obj.lockMovementY = true;
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockRotation = true;
      }

      function multiple(q) {
        return q * window.devicePixelRatio;
      }


    }
  }
});
