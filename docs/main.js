var docId = '';
var emailComplement = '@lamart-notepad.com';
function initApp() {
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if (!docId)
        docId = "teste";
    else
        docId = docId.toLowerCase();
    console.log({ docId: docId });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.email !== docId + emailComplement) {
                console.log('logged as another user. Sign out...', user.email, { user: user });
                firebase.auth().signOut();
            }
            else {
                console.log('logged in', user.email, { user: user });
                getContent(docId).then(function (data) {
                    setTextArea(data.text);
                });
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
    document.getElementById('textarea').className = "updating";
    timeoutID = setTimeout(function () {
        console.log("atualizando...");
        setContent(getTextArea(), docId).then(function () {
            document.getElementById('textarea').className = "";
            console.log("atualizado");
        });
    }, 800);
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
    document.getElementById('textarea').value = text;
}
function getTextArea() {
    return document.getElementById('textarea').value;
}
function tabinput(ev) {
    if (ev.keyCode !== 9)
        return;
    ev.preventDefault();
    document.execCommand('insertText', false, '\t');
}
