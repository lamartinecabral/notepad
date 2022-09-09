var docId;
var hash;

var markdown = {
	initApp: function () {
		console.log("initMarkdown");
		markdown.setMarkedOptions();
		[docId, hash] = (document.URL.split("?")[1] || "").split("#");
		if (!docId)
			markdown.setContent("# Marked in browser\n\nRendered by **marked**.");
		else {
			docId = docId.toLowerCase();
			markdown.liveContent(docId);
			markdown.liveAuth();
		}
	},

	/** @param {string} text */
	setContent: function (text) {
		document.getElementById("content").innerHTML = marked.parse(text);
	},

	liveAuth: function () {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				if (user.email.split("@")[0] === docId) {
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
	killLiveContent: null,
	liveContent: function (doc, col = "docs") {
		markdown.killLiveContent = collection.doc(doc).onSnapshot(
			(res) => {
				if (res.metadata.hasPendingWrites) return;
				markdown.setContent(res.exists ? res.data().text : "");
				if (hash) markdown.scrollToHash();
			},
			(err) => {
				console.error(err);
				markdown.setContent(err.message);
			}
		);
	},

	scrollToHash: function () {
		setTimeout(() => {
			const y = document.getElementById(hash).offsetTop;
			document.body.scrollTop = y;
			hash = "";
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
