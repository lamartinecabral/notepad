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
    script.src = urls[index];
    script.onload = function () {
      addScripts(index + 1);
    };
    document.body.appendChild(script);
  }

  window.loadscript = function (url) {
    urls.push(url);
    if (idle) addScripts();
  };
})();
