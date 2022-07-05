//@ts-ignore
declare const auth;
//@ts-ignore
declare const firestore;
//@ts-ignore
declare const collection;
declare const marked;
declare const Prism;
var docId;
var hash;

namespace markdown{
	export function initMarkdown(){
		console.log('initMarkdown');
		setMarkedOptions();
		[docId,hash] = (document.URL.split('?')[1] || '').split('#');
		if(!docId) setContent('# Marked in browser\n\nRendered by **marked**.');
		else {
			docId = docId.toLowerCase();
			liveContent(docId);
			liveAuth();
		}
	}
	
	function setContent(text: string){
		document.getElementById('content').innerHTML = marked.parse(text);
	}
	
	function liveAuth(){
		auth.onAuthStateChanged(function(user) {
			if (user) {
				if(user.email.split('@')[0] === docId){
					console.log('Logged');
				} else {
					console.log('Not logged')
				}
			} else {
				console.log("No user.");
			}
		});
	}
	
	var killLiveContent: ()=>void = undefined;
	function liveContent(doc, col = 'docs'){
		killLiveContent = collection.doc(doc)
		.onSnapshot((res) => {
			if(res.metadata.hasPendingWrites) return;
			setContent(res.exists ? res.data().text : '');
			if(hash) scrollToHash();
		}, err=>{
			console.error(err);
			setContent(err.message);
		});
	}

	function scrollToHash(){
		setTimeout(() => {
			const y = document.getElementById(hash).offsetTop;
			document.body.scrollTop = y as any;
			hash = '';
		}, 50);
	}

	function setMarkedOptions(){
		marked.setOptions({
			breaks: true,
			highlight: function (code) {
				return Prism.highlight(code, Prism.languages.javascript, 'javascript');
			}
		});
	}
}