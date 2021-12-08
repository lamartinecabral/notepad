var docId;
var isHidden = true;
var state = {};
var aux_state = {};
function diffState() {
    for (var i in state)
        if (state[i] !== aux_state[i])
            return aux_state = Object.assign({}, state), true;
    return false;
}
function initApp() {
    console.log('initApp');
    docId = document.URL.split('?')[1].split('#')[0];
    if (!docId)
        return location.replace('?' + randomString());
    else
        docId = docId.toLowerCase();
    liveContent(docId);
    liveAuth();
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
function liveAuth() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.email.split('@')[0] === docId) {
                console.log('Logged');
                state.login = true;
            }
            else {
                console.log('Not logged');
                state.login = false;
            }
        }
        else {
            console.log("No user.");
            state.login = false;
        }
        if (diffState())
            updateButtons();
    });
}
var killLiveContent = undefined;
function liveContent(doc, col) {
    if (col === void 0) { col = 'docs'; }
    killLiveContent = firebase
        .firestore()
        .collection(col)
        .doc(doc)
        .onSnapshot(function (res) {
        if (res.exists) {
            state.protected = res.data().protected !== undefined;
            state.public = res.data().public !== undefined;
        }
        else {
            state.protected = false;
            state.public = false;
        }
        if (diffState())
            updateButtons();
        if (res.metadata.hasPendingWrites)
            return;
        if (isHidden) {
            isHidden = false;
            document.getElementById('textarea').classList.toggle('hidden');
            document.getElementById('status').hidden = true;
            document.getElementById('status').children[0].innerText = "Atualizando...";
        }
        setTextArea(res.exists ? res.data().text : '');
    });
}
function setContent(text, doc, col) {
    if (doc === void 0) { doc = undefined; }
    if (col === void 0) { col = 'docs'; }
    if (!doc)
        return;
    var docRef = firebase.firestore().collection(col).doc(doc);
    return docRef.update({ text: text })["catch"](function () { return docRef.set({ text: text }); })
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
    if (x)
        return x.toString(36);
    var str = Math.floor(Math.random() * (Math.pow(36, 6))).toString(36);
    while (str.length < 6)
        str = '0' + str;
    return str;
}
function updateButtons() {
    if (state.login) {
        document.getElementById('login').classList.add('nodisplay');
        document.getElementById('options').classList.remove('nodisplay');
    }
    else {
        document.getElementById('login').classList.remove('nodisplay');
        document.getElementById('options').classList.add('nodisplay');
    }
}
function showOptions() {
    optionsModal();
}
function passwordAction() {
    if (state.login)
        notepade.logout();
    else
        passwordModal().then(function (pwd) {
            notepade.login(pwd)["catch"](function (err) { return alert(err.message); });
        });
}
