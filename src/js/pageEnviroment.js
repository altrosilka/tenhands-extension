(function(w, d) {

  var oldEvent;

  var id = 'smm-layout-ekniERgebe39EWee';
  var layout = d.getElementById(id);
  if (layout === null) {
    layout = d.createElement("div");
    layout.setAttribute("id", id);
    layout.setAttribute("style", "background-color: rgba(0,0,0,0.5); border-top: 1px solid #666;width: 100%; height: 100%; position: fixed; bottom: 0px; left: 0px;transition:0.4s; z-index: 99999899999898988899;");
    var mover = d.createElement("div");
    mover.setAttribute("style", "cursor:pointer;width:20px;height:20px;position:absolute;z-index:3;background-color:#ff0;right:36px;top:10px;");
    layout.appendChild(mover);
    var closer = d.createElement("div");
    closer.setAttribute("style", "cursor:pointer;width:20px;height:20px;position:absolute;z-index:3;background-color:#f00;right:10px;top:10px;");
    layout.appendChild(closer);
    var iframe = d.createElement("iframe");
    iframe.src = chrome.extension.getURL("pages/createPost.html");
    iframe.setAttribute("style", "width:100%;height:100%;z-index:1;position:relative;");
    iframe.setAttribute("id", "smm-transport-ekniERgebe39EWee");
    iframe.setAttribute("frameborder", "0");
    layout.appendChild(iframe);
    d.body.appendChild(layout);

    var selectHelper = d.createElement("div");
    selectHelper.setAttribute("style", "position:fixed; z-index: 99999999999898988899;margin:10px;");

    var button_add_1 = createButton('addParagraph', 'Новый параграф');
    var button_add_2 = createButton('addString', 'Новая строка');
    var button_add_3 = createButton('addInstead', 'Вместо текста');
    var button_add_4 = createButton('addTo', 'Добавить к тексту');

    selectHelper.appendChild(button_add_1);
    selectHelper.appendChild(button_add_2);
    selectHelper.appendChild(button_add_3);
    selectHelper.appendChild(button_add_4);

    layout.appendChild(selectHelper);


    mover.addEventListener('click', function() {
      var q = layout.getAttribute('data-small-view');
      if (q === null) {
        layout.setAttribute('data-small-view', 'true');
        layout.style.height = "50%";
      } else {
        layout.removeAttribute('data-small-view');
        layout.style.height = "100%";
      }
    });

    closer.addEventListener('click', function() {
      layout.style.transform = 'scale(0.9)';
      layout.style.opacity = '0';
      layout.style.visibility = 'hidden';
    });

    document.body.addEventListener("mousedown", function(e) {
      oldEvent = e;
    });
    document.body.addEventListener("mouseup", function(e) {



      var selection = window.getSelection();
      if (selection && selection.type !== 'None') {
        var range = selection.getRangeAt(0);
        if (range) {
          var div = document.createElement('div');
          div.appendChild(range.cloneContents());
          var text = div.innerHTML;
          if (text && text !== '') {
            var dir = getDirection(e, oldEvent);

            var ww = window.innerWidth;
            var wh = window.innerHeight;
            /*
            if (dir.x === 1) {
              selectHelper.style.left = e.clientX + 'px';
              selectHelper.style.right = 'auto';
            } else {
              selectHelper.style.right = (ww - e.clientX) + 'px';
              selectHelper.style.left = 'auto';
            }

            if (dir.y === 1) {
              selectHelper.style.top = e.clientY + 'px';
              selectHelper.style.bottom = 'auto';
            } else {
              selectHelper.style.bottom = (wh - e.clientY) + 'px';
              selectHelper.style.top = 'auto';
            }
            */
          }
        }
      }
      if (e.clientX === oldEvent.clientX && e.clientY === oldEvent.clientY) {
        selectHelper.style.left = '-9999px';
      }

    });
  } else {
    if (w.getComputedStyle(layout).visibility === 'hidden') {
      layout.style.transform = 'scale(1)';
      layout.style.opacity = '1';
      layout.style.visibility = 'visible';
    }
  }

  function createButton(mode, text) {
    var elem = d.createElement("div");
    elem.innerHTML = text;
    elem.setAttribute('style', "background-color: #EEE; display: inline-block; margin: 0 5px; padding: 3px 6px; border: 1px solid #AAA; cursor: pointer;"); elem.addEventListener("click", function(e) {
      debugger
    });
    return elem;
  }

  function getDirection(e, oe) {
    return {
      x: (e.clientX > oe.clientX) ? 1 : -1,
      y: (e.clientY > oe.clientY) ? 1 : -1
    }
  }
})(window, document);