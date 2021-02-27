var killOnAuthStateChanged = undefined;
function initAdmin() {
    console.log("initAdmin");
    killOnAuthStateChanged = auth.onAuthStateChanged(function (user) {
        if (user) {
            console.log("Logged user", user);
            if (user.uid != "U23CfQYMJaRhLeiZsIQRAT9LPSC3") {
                console.log("User is not admin. Signing Out.");
                logout();
            }
            else {
                console.log("Done.");
            }
        }
        else {
            console.log("No user.");
        }
    });
}
function getUser() {
    return auth.currentUser;
}
function login(email, password) {
    console.log("Logging in...");
    return auth.signInWithEmailAndPassword(email, password)["catch"](function (err) {
        console.log("Could not log in.");
        console.error(err);
    });
}
function logout() {
    console.log("Logging out...");
    return auth.signOut()["catch"](function (err) {
        console.log("Could not log out.");
        console.error(err);
    });
}
function listDocs() {
    console.log("Listing docs...");
    return collection.get()
        .then(function (res) {
        var docs = {};
        res.docs
            .forEach(function (doc) { return docs[doc.id] = doc.data(); });
        console.log("docs", docs);
        return docs;
    })["catch"](function (err) {
        console.log("Could not list docs.");
        console.error(err);
    });
}
function getDoc(docId) {
    console.log("Getting doc...", docId);
    return collection.doc(docId).get()
        .then(function (res) {
        var data = res.data();
        console.log(data);
        return data;
    })["catch"](function (err) {
        console.log("Could not get doc");
        console.error(err);
    });
}
function removeDoc(docId) {
    console.log("Deleting " + docId);
    return collection.doc(docId)["delete"]()
        .then(function () { return console.log("Document deleted."); })["catch"](function (err) {
        console.log("Could not delete the document.");
        console.error(err);
    });
}
function changePassword(password) {
    if (!auth.currentUser)
        return console.log("You must log in first.");
    console.log("Updating password...", auth.currentUser.email);
    return auth.currentUser.updatePassword(password)
        .then(function () { return console.log("Password updated."); })["catch"](function (err) {
        console.log("Could not update the password.");
        console.error(err);
    });
}
function clearDocs(func) {
    if (!func)
        func = function (doc) { return !doc.text.length; };
    var counter = 0;
    var ans = prompt("Warning. This operation can't be undone. Are you sure this function are correct to evaluate a doc to be deleted? Answer with 'yes' to confirm.\n" + func);
    if (ans === "yes")
        collection.get().then(function (res) {
            for (var _i = 0, _a = res.docs; _i < _a.length; _i++) {
                var doc = _a[_i];
                if (func(doc.data())) {
                    counter++;
                    console.log(doc);
                    removeDoc(doc.id).then(function () {
                        counter--;
                        if (counter === 0)
                            console.log("Collection cleared.");
                    });
                }
            }
            if (counter === 0)
                console.log("No doc deleted");
        });
}
function initEruda() {
    var script = document.createElement('script');
    script.src = "./assets/eruda@2.4.1/eruda.js";
    document.body.appendChild(script);
    script.onload = function () {
        eruda.init();
        eruda.show();
        document.getElementById('eruda-btn').hidden = true;
    };
}
function help() {
    console.log("interface Doc{\n\ttext: string;\n}\n\nVariaveis disponiveis:\nauth = firebase.auth()\nfirestore = firebase.firestore()\ncollection = firebase.firestore().collection('docs')\n\nFun\u00E7\u00F5es dispon\u00EDveis:\nkillOnAuthStateChanged(): void;\ngetUser():                firebase.User;\nlogin(email,password):    Promise<void>;\nlogout():                 Promise<void>;\nlistDocs():               Promise<Record<string,Doc>>;\ngetDoc(docId):            Promise<Doc>;\nremoveDoc(docId):         Promise<void>;\nchangePassword(password): Promise<void>;\n\n/* Deletes all docs which func returns true */\nclearDocs(func: (doc: Doc)=>boolean): void\n");
}
