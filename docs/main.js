var docId = '';
var isHidden = true;
var emailComplement = '@lamart-notepad.com';
var killAuthStateChanged = undefined;
function initApp() {
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if (!docId)
        return location.replace(document.URL.split('?')[0] + '?default');
    else
        docId = docId.toLowerCase();
    console.log({ docId: docId });
    killAuthStateChanged = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.email !== docId + emailComplement) {
                console.log('logged as another user. Sign out...', user.email, { user: user });
                if (typeof (killLiveContent) == 'function')
                    killLiveContent();
                firebase.auth().signOut();
            }
            else {
                console.log('logged in', user.email, { user: user });
                liveContent(docId);
            }
        }
        else {
            console.log('signing in...');
            firebaseauth();
        }
    });
}
function firebaseauth() {
    var email = docId + emailComplement;
    var password = docId + emailComplement;
    return firebase.auth().signInWithEmailAndPassword(email, password);
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
        if (isHidden) {
            document.getElementById('textarea').classList.toggle('hidden');
            document.getElementById('status').hidden = true;
            document.getElementById('status').children[0].innerText = "Atualizando...";
            isHidden = false;
        }
        setTextArea(res.data().text);
    });
}
function getContent(doc, col) {
    if (col === void 0) { col = 'docs'; }
    return firebase
        .firestore()
        .collection(col)
        .doc(doc)
        .get()
        .then(function (res) { return res.data(); });
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
    else
        return firebase
            .firestore()
            .collection(col)
            .add({ text: text })
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
