window.addScripts = function () {
  var scripts = arguments[0];
  var index = arguments[1] || 0;
  if (index >= scripts.length) return;
  var url = scripts[index].url;
  var test = scripts[index].test;
  if (!test || test()) {
    const script = document.createElement("script");
    script.src = url;
    script.onload = function () {
      addScripts(scripts, index + 1);
    };
    document.body.appendChild(script);
  } else addScripts(scripts, index + 1);
};
