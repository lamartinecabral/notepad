function initApp() {
	console.log("initApp");
	docId = (document.URL.split("?")[1] || "").split("#")[0];
	if (!docId) return location.replace("?" + randomString());
	else docId = docId.toLowerCase();
	document.body.hidden = false;
	Server.liveContent(docId);
	Server.liveAuth();
	View.Action.theme();
}

var Server = {
	/** @type {() => void} */
	killLiveContent: null,
	liveContent: function (doc, col = "docs") {
		killLiveContent = firebase
			.firestore()
			.collection(col)
			.doc(doc)
			.onSnapshot(
				(res) => {
					if (res.exists) {
						State.obj.protected = res.data().protected !== undefined;
						State.obj.public = res.data().public !== undefined;
					} else {
						State.obj.protected = false;
						State.obj.public = false;
					}
					if (State.diff()) View.updateButtons();

					if (res.metadata.hasPendingWrites) return;
					if (View.isHidden) {
						View.isHidden = false;
						View.textArea.elem().hidden = View.isHidden;
						View.status.elem().hidden = true;
						View.status.span().innerText = "Saving...";
					}
					View.textArea.set(res.exists ? res.data().text : "");
				},
				(err) => {
					console.error(err);
					View.isHidden = true;
					View.textArea.elem().hidden = View.isHidden;
					View.status.elem().hidden = false;
					View.status.span().innerText = "Protected";
				}
			);
	},

	liveAuth: function () {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				if (user.email.split("@")[0] === docId) {
					console.log("Logged");
					State.obj.login = true;
				} else {
					console.log("Not logged");
					State.obj.login = false;
				}
			} else {
				console.log("No user.");
				State.obj.login = false;
			}
			if (State.diff()) View.updateButtons();
		});
	},

	/**
	 * @param {string} text
	 * @param {string} doc
	 * @param {string} col
	 */
	setContent: function (text, doc, col = "docs") {
		if (!doc) return;
		/** @type {{update: (obj: any) => Promise<any>, set: (obj: any) => Promise<any>}} */
		const docRef = firebase.firestore().collection(col).doc(doc);
		return docRef
			.update({ text })
			.catch(() => docRef.set({ text }))
			.then((res) => console.log(res));
	},

	/** @param {string} password */
	login: function (password /* : string */) {
		return new Promise((resolve, reject) => {
			let email = docId + "@notepade.web.app";
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then(() => {
					console.log("User signed in");
					if (Server.killLiveContent) Server.killLiveContent();
					Server.liveContent(docId);
					resolve("");
				})
				.catch((err) => {
					firebase
						.auth()
						.createUserWithEmailAndPassword(email, password)
						.then(() => {
							console.log("User created");
							if (killLiveContent) Server.killLiveContent();
							Server.liveContent(docId);
							resolve("");
						})
						.catch(() => {
							console.error(err);
							reject(err);
						});
				});
		});
	},

	logout: function () {
		firebase.auth().signOut();
	},

	currentUser: function () {
		return firebase.auth().currentUser;
	},

	_update: function (obj, msg) {
		return firebase
			.firestore()
			.collection("docs")
			.doc(docId)
			.update(obj)
			.then(() => {
				console.log(msg);
			})
			.catch((err) => {
				console.error(err);
				throw err;
			});
	},

	protect: function (flag = true) {
		if (flag) {
			Server._update(
				{ protected: firebase.auth().currentUser?.uid || "" },
				"This doc is now protected"
			);
		} else {
			Server._update(
				{ public: firebase.firestore.FieldValue.delete() },
				"'public' attribute removed"
			).then(() => {
				Server._update(
					{ protected: firebase.firestore.FieldValue.delete() },
					"This doc is not protected anymore"
				).then(() => {
					// firebase.auth().currentUser.delete().then(()=>{
					// 	console.log("User deleted");
					// })
				});
			});
		}
	},

	public: function (flag = true) {
		if (flag) {
			Server._update({ public: true }, "This doc is now public");
		} else {
			Server._update(
				{ public: firebase.firestore.FieldValue.delete() },
				"'public' attribute removed"
			);
		}
	},

	unprotect: function () {
		return Server.protect(false);
	},

	unpublic: function () {
		return Server.public(false);
	},
};

var State = {
	/** @type {{public: boolean, protected: boolean, login: boolean}} */
	obj: {},
	aux: {},

	diff: function () {
		for (let i in State.obj)
			if (State.obj[i] !== State.aux[i])
				return (State.aux = Object.assign({}, State.obj)), true;
		return false;
	},
};

var View = {
	status: {
		elem: () => document.getElementById("status"),
		/** @type {() => HTMLSpanElement} */
		span: () => View.status.elem().children[0],
	},

	textArea: {
		/** @type {() => HTMLTextAreaElement} */
		elem: () => document.getElementById("textarea"),

		/** @param {string} text */
		set: function (text) {
			const selectionStart = View.textArea.elem().selectionStart;
			const selectionEnd = View.textArea.elem().selectionEnd;
			View.textArea.elem().value = text;
			View.textArea.elem().selectionStart = selectionStart;
			View.textArea.elem().selectionEnd = selectionEnd;
		},

		/** @returns {string} */
		get: function () {
			return View.textArea.elem().value;
		},

		/** @param {KeyboardEvent} ev */
		tabinput: function (ev) {
			if (ev.keyCode !== 9 && ev.key !== "Tab") return;
			if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
			ev.preventDefault();
			document.execCommand("insertText", false, "\t");
		},
	},

	updateButtons: function () {
		if (State.obj.login) {
			document.getElementById("login").hidden = true;
			document.getElementById("options").hidden = false;
		} else {
			document.getElementById("login").hidden = false;
			document.getElementById("options").hidden = true;
		}
	},

	Action: {
		saveTimeoutID: null,
		save: function (ev) {
			clearTimeout(View.Action.saveTimeoutID);
			View.Action.saveTimeoutID = setTimeout(() => {
				console.log("updating...");
				View.status.elem().hidden = false;
				View.status.span().innerText = "Saving...";
				Server.setContent(View.textArea.get(), docId)
					.then(() => {
						document.getElementById("status").hidden = true;
						console.log("updated");
					})
					.catch((err) => {
						console.error(err);
						View.status.span().innerText = "Protected";
					});
			}, 500);
		},

		theme: function (toggle = false) {
			if (localStorage && localStorage.getItem("nightMode") !== null)
				View.nightMode = localStorage.getItem("nightMode") === "true";
			if (toggle) View.nightMode = !View.nightMode;
			document.body.style.cssText =
				`--background: var(--${View.nightMode ? "dark" : "light"}); ` +
				`--color: var(--${!View.nightMode ? "dark" : "light"});`;
			document.getElementById("theme").innerText = View.nightMode
				? "light"
				: "dark";
			if (localStorage) localStorage.setItem("nightMode", "" + View.nightMode);
		},

		password: function () {
			if (State.obj.login) Server.logout();
			else
				Modal.password().then((pwd) => {
					Server.login(pwd).catch((err) => alert(err.message));
				});
		},

		options: function () {
			Modal.options();
		},
	},

	isHidden: true,
	nightMode: false,
};

function randomString(x = undefined) {
	if (x) return x.toString(36);
	let str = Math.floor(Math.random() * 36 ** 6).toString(36);
	while (str.length < 6) str = "0" + str;
	return str;
}
