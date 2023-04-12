// @ts-check
import { marked } from "marked";
import Prism from "./prism"
import { auth, db } from "./firebase";
import { State } from "./state";

/** @type {import('../firebase')['default']} */
// @ts-ignore
const firebase = window.firebase

const { onAuthStateChanged } = firebase.auth;
const { doc, onSnapshot } = firebase.firestore;

var markdown = {
  /** @type {(id: string) => HTMLElement} */
  // @ts-ignore
  elem: (id)=>document.getElementById(id),
  content: ()=>markdown.elem("content"),

	initApp: function () {
		console.log("initMarkdown");
		markdown.setMarkedOptions();
		if (!State.docId)
			markdown.setContent("# Marked in browser\n\nRendered by **marked**.");
		else {
			markdown.liveContent(State.docId);
			markdown.liveAuth();
		}
	},

	/** @param {string} text */
	setContent: function (text) {
    
		markdown.content().innerHTML = marked.parse(text);
	},

	liveAuth: function () {
		onAuthStateChanged(auth, function (user) {
			if (user) {
				// @ts-ignore
				if (user.email.split("@")[0] === State.docId) {
					console.log("Logged");
				} else {
					console.log("Not logged");
				}
			} else {
				console.log("No user.");
			}
		});
	},

	/** @type {() => void} */
	// @ts-ignore
	killLiveContent: null,
	liveContent: function (docId, col = "docs") {
		markdown.killLiveContent = onSnapshot(
			doc(db, col, docId),
			(res) => {
				if (res.metadata.hasPendingWrites) return;
				markdown.setContent(res.exists() ? res.data().text : "");
				if (State.hash) markdown.scrollToHash();
			},
			(err) => {
				console.error(err);
				markdown.setContent(err.message);
			}
		);
	},

	scrollToHash: function () {
		setTimeout(() => {
			const y = markdown.elem(State.hash).offsetTop;
			document.body.scrollTop = y;
			State.hash = "";
		}, 50);
	},

	setMarkedOptions: function () {
		marked.setOptions({
			breaks: true,
			highlight: function (code) {
				return Prism.highlight(code, Prism.languages.javascript, "javascript");
			},
		});
	},
};

markdown.initApp();
