var docId;
var isHidden = true;
function initApp() {
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if (!docId)
        return location.replace('?' + randomString());
    else
        docId = docId.toLowerCase();
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
    if (!doc)
        return;
    var docRef = firebase.firestore().collection(col).doc(doc);
    return docRef.update({ text: text })
        .then(function (res) { return res; })["catch"](function (err) {
        if (err.message === "Requested entity was not found.")
            return docRef.set({ text: text })
                .then(function (res) { return res; });
        else
            throw err;
    });
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
    var str = "0123456789abcdefghijklmnopqrstuvwxyz";
    var maxrand = Math.pow(str.length, 5);
    if (x === undefined)
        x = Math.floor(Math.random() * maxrand);
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
var notepade = /** @class */ (function () {
    function notepade() {
        throw Error("This can't be instantiated");
    }
    notepade.login = function (password) {
        var email = docId + '@notepade.web.app';
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            console.log("User signed in");
            if (killLiveContent)
                killLiveContent();
            liveContent(docId);
        })["catch"](function () {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
                console.log("User created");
                if (killLiveContent)
                    killLiveContent();
                liveContent(docId);
            });
        });
    };
    notepade.logout = function () {
        firebase.auth().signOut();
    };
    notepade.currentUser = function () {
        return firebase.auth().currentUser;
    };
    notepade._update = function (obj, msg) {
        return firebase.firestore().collection('docs').doc(docId).update(obj).then(function () {
            console.log(msg);
        })["catch"](function (err) {
            console.error(err);
            throw err;
        });
    };
    notepade.protect = function (flag) {
        var _this = this;
        var _a;
        if (flag === void 0) { flag = true; }
        if (flag) {
            this._update({ protected: (((_a = firebase.auth().currentUser) === null || _a === void 0 ? void 0 : _a.uid) || '') }, "This doc is now protected");
        }
        else {
            this._update({ public: firebase.firestore.FieldValue["delete"]() }, "'public' attribute removed").then(function () {
                _this._update({ protected: firebase.firestore.FieldValue["delete"]() }, "This doc is not protected anymore").then(function () {
                    // firebase.auth().currentUser.delete().then(()=>{
                    // 	console.log("User deleted");
                    // })
                });
            });
        }
    };
    notepade.public = function (flag) {
        if (flag === void 0) { flag = true; }
        if (flag) {
            this._update({ public: true }, "This doc is now public");
        }
        else {
            this._update({ public: firebase.firestore.FieldValue["delete"]() }, "'public' attribute removed");
        }
    };
    notepade.unprotect = function () { return this.protect(false); };
    notepade.unpublic = function () { return this.public(false); };
    return notepade;
}());
Object.defineProperty(notepade, '_update', { enumerable: false });
