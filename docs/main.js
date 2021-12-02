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
    // let str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var str = "0123456789abcdefghijklmnopqrstuvwxyz";
    // if(x === undefined) x = Math.floor(Math.random()*1073741824);
    var maxrand = Math.pow(str.length, 6);
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
    while (res.length < 6)
        res = '0' + res;
    return res;
}
function passwordAction() {
    if (state.login)
        notepade.logout();
    else {
        passwordModal().then(function (pwd) {
            notepade.login(pwd)["catch"](function (err) { return alert(err.message); });
        });
        // notepade.login(prompt("Password:")).catch(err=>alert(err.message));
    }
}
function protectAction() {
    if (state.protected)
        notepade.unprotect();
    else
        notepade.protect();
}
function publicAction() {
    if (state.public)
        notepade.unpublic();
    else
        notepade.public();
}
function updateButtons() {
    if (state.login) {
        document.getElementById('login').innerHTML = 'logout';
        document.getElementById('protect').classList.remove('nodisplay');
        if (state.protected) {
            document.getElementById('protect').innerHTML = 'unprotect';
            document.getElementById('public').classList.remove('nodisplay');
        }
        else {
            document.getElementById('protect').innerHTML = 'protect';
            document.getElementById('public').classList.add('nodisplay');
        }
        if (state.public) {
            document.getElementById('public').innerHTML = 'unpublic';
        }
        else {
            document.getElementById('public').innerHTML = 'public';
        }
    }
    else {
        document.getElementById('login').innerHTML = 'password';
        document.getElementById('protect').classList.add('nodisplay');
        document.getElementById('public').classList.add('nodisplay');
    }
}
var notepade = /** @class */ (function () {
    function notepade() {
        throw Error("This can't be instantiated");
    }
    notepade.login = function (password) {
        return new Promise(function (resolve, reject) {
            var email = docId + '@notepade.web.app';
            firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
                console.log("User signed in");
                if (killLiveContent)
                    killLiveContent();
                liveContent(docId);
                resolve('');
            })["catch"](function (err) {
                firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
                    console.log("User created");
                    if (killLiveContent)
                        killLiveContent();
                    liveContent(docId);
                    resolve('');
                })["catch"](function () {
                    console.error(err);
                    reject(err);
                });
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
function passwordModal() {
    return new Promise(function (resolve, reject) {
        var div = document.createElement('div');
        Object.assign(div.style, {
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            background: "#0009"
        });
        div.addEventListener("click", function () {
            div.remove();
            reject("backdrop click");
        });
        div.addEventListener("keyup", function (ev) {
            if (ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27) {
                reject("esc pressed");
                div.remove();
            }
        });
        // document.getElementById('textarea').insertBefore(div);
        document.body.insertBefore(div, document.getElementById('textarea'));
        var div2 = document.createElement('div');
        Object.assign(div2.style, {
            background: "white", padding: "2em",
            position: "absolute", bottom: "50%", right: "50%",
            transform: "translate(50%, 50%)"
        });
        div2.addEventListener("click", function (ev) { ev.stopPropagation(); });
        div.append(div2);
        var form = document.createElement('form');
        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            div.remove();
            resolve(ev.target[0].value);
        });
        div2.append(form);
        var label = document.createElement('label');
        label.innerHTML = "Password: ";
        label.htmlFor = "pwd";
        form.append(label);
        var input = document.createElement('input');
        input.type = "password";
        input.name = "pwd";
        setTimeout(function (i) { return i.select(); }, 0, input);
        form.append(input);
        var send = document.createElement('input');
        send.type = "submit";
        form.append(send);
    });
}
