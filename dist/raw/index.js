// @ts-check

var docId = location.search.slice(1);

if (docId) {
  var baseUrl =
    "https://firestore.googleapis.com/v1/projects/lamart-notepad/databases/(default)/documents/docs/";
  fetchcb(baseUrl + docId, function (res) {
    const body = JSON.parse(res);
    if (body.error) return setContent(body.error.message);
    return setContent(body.fields.text.stringValue);
  });
}

function fetchcb() {
  var url, options, callback;
  url = arguments[0];
  if (typeof arguments[1] === "function") {
    callback = arguments[1];
  } else {
    options = arguments[1];
    callback = arguments[2];
  }
  if (!options) options = {};
  var req = new XMLHttpRequest();
  req.open((options.method || "GET").toUpperCase(), url);
  for (var i in options.headers) req.setRequestHeader(i, options.headers[i]);
  req.onload = function () {
    callback && callback(req.response);
  };
  req.send(options.body);
}

function setContent(text) {
  document.getElementsByTagName("pre")[0].innerText = text;
}
