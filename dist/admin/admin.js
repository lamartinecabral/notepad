var admin = {
	/** @type {() => void} */
	killOnAuthStateChanged: null,

	initApp: function () {
		console.log("initAdmin");
		admin.killOnAuthStateChanged = auth.onAuthStateChanged(function (user) {
			if (user) {
				console.log("Logged user", user);
				if (user.uid != "U23CfQYMJaRhLeiZsIQRAT9LPSC3") {
					console.log("User is not admin. Signing Out.");
					logout();
				} else {
					console.log("Done.");
				}
			} else {
				console.log("No user.");
			}
		});
	},

	getUser: function () {
		return auth.currentUser;
	},

	login: function () {
		const [email, password] = [prompt("email"), prompt("password")];
		console.log("Logging in...");
		return auth.signInWithEmailAndPassword(email, password).catch((err) => {
			console.log("Could not log in.");
			console.error(err);
		});
	},

	logout: function () {
		console.log("Logging out...");
		return auth.signOut().catch((err) => {
			console.log("Could not log out.");
			console.error(err);
		});
	},

	/**
	 * @typedef {Object} Doc
	 * @property {string} text
	 * @property {string} protected
	 * @property {boolean} public
	 */

	/** @returns {Promise<{[id: string]: Doc}>} */
	listDocs: function () {
		console.log("Listing docs...");
		/** @type {Promise<{docs: any[]}>} */
		const get = collection.get();
		return get
			.then((res) => {
				/** @type {{[id: string]: Doc}} */
				let docs = {};
				res.docs.forEach((doc) => (docs[doc.id] = doc.data()));
				console.log("docs", docs);
				return docs;
			})
			.catch((err) => {
				console.log("Could not list docs.");
				console.error(err);
			});
	},

	/** @returns {Promise<Doc>} */
	getDoc: function (docId) {
		console.log("Getting doc...", docId);
		/** @type {Promise<any>} */
		const get = collection.doc(docId).get();
		return get
			.then((res) => {
				let data = res.data();
				console.log(data);
				return data;
			})
			.catch((err) => {
				console.log("Could not get doc");
				console.error(err);
			});
	},

	removeDoc: function (docId) {
		console.log("Deleting " + docId);
		return collection
			.doc(docId)
			.delete()
			.then(() => console.log("Document deleted."))
			.catch((err) => {
				console.log("Could not delete the document.");
				console.error(err);
			});
	},

	changePassword: function (password) {
		if (!auth.currentUser) return console.log("You must log in first.");
		console.log("Updating password...", auth.currentUser.email);
		return auth.currentUser
			.updatePassword(password)
			.then(() => console.log("Password updated."))
			.catch((err) => {
				console.log("Could not update the password.");
				console.error(err);
			});
	},

	/** @param {(doc: Doc) => boolean} func */
	clearDocs: function (func) {
		if (!func) func = (doc) => !doc.text.length;
		let counter = 0;
		let ans = prompt(
			"Warning. This operation can't be undone. "+
			"Are you sure this function are correct to "+
			"evaluate a doc to be deleted? Answer with "+
			"'yes' to confirm.\n" + func
		);
		if (ans === "yes")
			collection.get().then((res) => {
				for (let doc of res.docs) {
					if (func(doc.data())) {
						counter++;
						console.log(doc.data());
						removeDoc(doc.id).then(() => {
							counter--;
							if (counter === 0) console.log("Collection cleared.");
						});
					}
				}
				if (counter === 0) console.log("No doc deleted");
			});
	},

	initEruda: function () {
		var script = document.createElement("script");
		script.src = "../assets/eruda@2.4.1/eruda.js";
		document.body.appendChild(script);
		script.onload = function () {
			eruda.init();
			eruda.show();
			document.getElementById("eruda-btn").hidden = true;
		};
	},

	help: function () {
		console.log(
			`interface Doc{
	text: string;
}

Variaveis disponiveis:
auth = firebase.auth()
firestore = firebase.firestore()
collection = firebase.firestore().collection('docs')

Funções disponíveis:
admin.killOnAuthStateChanged(): void;
admin.getUser():                firebase.User;
admin.login(email,password):    Promise<void>;
admin.logout():                 Promise<void>;
admin.listDocs():               Promise<Record<string,Doc>>;
admin.getDoc(docId):            Promise<Doc>;
admin.removeDoc(docId):         Promise<void>;
admin.changePassword(password): Promise<void>;

/* Deletes all docs which func returns true */
admin.clearDocs(func: (doc: Doc)=>boolean): void`
		);
	},
};
