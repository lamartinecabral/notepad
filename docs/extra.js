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
function passwordModal() {
    return new Promise(function (resolve, reject) {
        var div = backdrop(resolve, reject);
        document.body.insertBefore(div, document.getElementById('textarea'));
        var div2 = whitebox(resolve, reject);
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
function optionsModal() {
    return new Promise(function (resolve, reject) {
        var intervalId = 0;
        var div = backdrop(resolve, function (msg) { clearInterval(intervalId); reject(msg); });
        document.body.insertBefore(div, document.getElementById('textarea'));
        var div2 = whitebox(resolve, reject);
        div.append(div2);
        var protect = document.createElement('div');
        div2.append(protect);
        var input1 = document.createElement('input');
        input1.type = "checkbox";
        input1.name = "protect";
        input1.addEventListener('change', function () { protectAction(); });
        protect.append(input1);
        var label1 = document.createElement('label');
        label1.innerHTML = "Protected";
        label1.htmlFor = "protect";
        protect.append(label1);
        var public = document.createElement('div');
        div2.append(public);
        Object.assign(public.style, { 'margin': '0.5em 0 1em 0' });
        var input2 = document.createElement('input');
        input2.type = "checkbox";
        input2.name = "public";
        input2.addEventListener('change', function () { publicAction(); });
        public.append(input2);
        var label2 = document.createElement('label');
        label2.innerHTML = "Public";
        label2.htmlFor = "public";
        public.append(label2);
        var logout = document.createElement('div');
        div2.append(logout);
        Object.assign(logout.style, { 'margin-top': '1em', 'text-align': 'center' });
        var button = document.createElement('button');
        button.innerText = 'Logout';
        button.addEventListener('click', function () { clearInterval(intervalId); notepade.logout(); div.remove(); });
        logout.append(button);
        var prot, publ;
        intervalId = setInterval(function () {
            if (prot === state.protected && publ === state.public)
                return;
            prot = state.protected;
            publ = state.public;
            if (state.protected) {
                input1.checked = true;
                input2.disabled = false;
            }
            else {
                input1.checked = false;
                input2.disabled = true;
            }
            if (state.public) {
                input2.checked = true;
            }
            else {
                input2.checked = false;
            }
        }, 100);
    });
}
function backdrop(resolve, reject) {
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
    var eventListener = function (ev) {
        if (ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27) {
            reject("esc pressed");
            div.remove();
            document.removeEventListener('keyup', eventListener);
        }
    };
    document.addEventListener("keyup", eventListener);
    return div;
}
function whitebox(resolve, reject) {
    var div2 = document.createElement('div');
    Object.assign(div2.style, {
        background: "white", padding: "2em",
        position: "absolute", bottom: "50%", right: "50%",
        transform: "translate(50%, 50%)"
    });
    div2.addEventListener("click", function (ev) { ev.stopPropagation(); });
    return div2;
}
