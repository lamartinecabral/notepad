var docId;
var isHidden = true;
function initApp() {
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if (!docId)
        return location.replace('?' + randomString());
    liveContent(docId);
}
var timeoutID;
function save(ev) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(function () {
        console.log("atualizando...");
        document.getElementById('status').hidden = false;
        setContent(getTextArea(), docId).then(function () {
            document.getElementById('status').hidden = true;
            console.log("atualizado");
        });
    }, 500);
}
var killLiveContent = undefined;
function liveContent(doc, col) {
    if (col === void 0) { col = 'docs'; }
    killLiveContent = firebase
        .firestore()
        .collection(col)
        .doc(doc)
        .onSnapshot(function (res) {
        if (res.metadata.hasPendingWrites)
            return;
        if (isHidden) {
            isHidden = false;
            document.getElementById('textarea').classList.toggle('hidden');
            document.getElementById('status').hidden = true;
            document.getElementById('status').children[0].innerText = "Atualizando...";
        }
        setTextArea(res.data() ? res.data().text : '');
    });
}
function setContent(text, doc, col) {
    if (doc === void 0) { doc = undefined; }
    if (col === void 0) { col = 'docs'; }
    if (doc)
        return firebase
            .firestore()
            .collection(col)
            .doc(doc)
            .set({ text: text })
            .then(function (res) { return res; });
}
function setTextArea(text) {
    var elem = document.getElementById('textarea');
    var selectionStart = elem.selectionStart;
    var selectionEnd = elem.selectionEnd;
    elem.value = text;
    elem.selectionStart = selectionStart;
    elem.selectionEnd = selectionEnd;
}
function getTextArea() {
    return document.getElementById('textarea').value;
}
function tabinput(ev) {
    if (ev.keyCode !== 9 && ev.key !== "Tab")
        return;
    if (ev.ctrlKey || ev.shiftKey || ev.altKey)
        return;
    ev.preventDefault();
    document.execCommand('insertText', false, '\t');
}
function randomString(x) {
    if (x === void 0) { x = undefined; }
    var str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (x === undefined)
        x = Math.floor(Math.random() * 1073741824);
    if (isNaN(x) || x !== Math.floor(x) || x < 0) {
        console.error("invalid number for random string");
        return "";
    }
    var res = "";
    while (x) {
        res = str[x % str.length] + res;
        x = Math.floor(x / str.length);
    }
    while (res.length < 5)
        res = '0' + res;
    return res;
}
