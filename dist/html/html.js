var docId;
var hash;

var html = {
	initApp: function () {
		console.log("initHTML");
		[docId, hash] = (document.URL.split("?")[1] || "").split("#");
		if (!docId)
			html.setContent("<h1>HTML IFrame</h1>");
		else {
			docId = docId.toLowerCase();
			html.liveContent(docId);
			html.liveAuth();
		}
	},

	/** @param {string} text */
	setContent: function (text) {
		var el = document.getElementsByTagName('iframe')[0];
		if(el) document.body.remove(el);
		/** @type {HTMLIFrameElement} */
		var iframe = document.createElement('iframe');
		iframe.id = 'iframe';
		iframe.src = 'data:text/html;charset=utf-8,'+encodeURI(text);
		document.body.append(iframe);
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
		html.killLiveContent = collection.doc(doc).onSnapshot(
			(res) => {
				if (res.metadata.hasPendingWrites) return;
				html.setContent(res.exists ? res.data().text : "");
				html.killLiveContent();
			},
			(err) => {
				console.error(err);
				html.setContent(err.message);
			}
		);
	},
};
