//@ts-check
import { auth, db } from "./firebase";
import { State } from "./state";

/** @type {import('../firebase')['default']} */
// @ts-ignore
const firebase = window.firebase

const { onAuthStateChanged } = firebase.auth;
const { doc, onSnapshot } = firebase.firestore;

var html = {
	initApp: function () {
		// console.log("initHTML");
		if (!State.docId)
			html.setContent("<h1>HTML IFrame</h1>");
		else {
			html.liveContent(State.docId);
			html.liveAuth();
		}
	},

	/** @param {string} text */
	setContent: function (text) {
		var el = document.getElementById('iframe');
		if(el) el.remove();
		/** @type {HTMLIFrameElement} */
		var iframe = document.createElement('iframe');
		iframe.id = 'iframe';
		iframe.src = 'data:text/html;charset=utf-8,'+encodeURIComponent(text);
		document.body.append(iframe);
	},

	liveAuth: function () {
		onAuthStateChanged(auth, function (user) {
			if (user) {
				// @ts-ignore
				if (user.email.split("@")[0] === State.docId) {
					console.log("Logged");
				} else {
					// console.log("Not logged");
				}
			} else {
				// console.log("No user.");
			}
		});
	},

	/** @type {() => void} */
	// @ts-ignore
	killLiveContent: null,
	liveContent: function (docId, col = "docs") {
		html.killLiveContent = onSnapshot(
			doc(db, col, docId),
			(res) => {
				if (res.metadata.hasPendingWrites) return;
				html.setContent(res.exists() ? res.data().text : "");
			},
			(err) => {
				console.error(err);
				html.setContent(err.message);
			}
		);
	},
};

html.initApp();
