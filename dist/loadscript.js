!(function () {
  var urls = [];
  var idle = true;
  function addScripts(i) {
    var index = i || 0;
    if (index === urls.length) {
      idle = true;
      urls = [];
      return;
    }
    idle = false;
    var script = document.createElement("script");
    var url = urls[index][0];
    var props = urls[index][1];
    script.src = url;
    if (props) for (var prop in props) script[prop] = props[prop];
    script.addEventListener("load", function () {
      addScripts(index + 1);
    });
    script.addEventListener("error", function () {
      addScripts(index + 1);
    });
    document.head.appendChild(script);
  }

  window.loadscript = function (url, props) {
    urls.push([url, props]);
    if (idle) addScripts();
  };
})();
