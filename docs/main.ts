declare const firebase;
var docId;
var isHidden = true;

function initApp(){
	console.log('initApp');
	docId = document.URL.split('?')[1];
	if(!docId)
		return location.replace('?'+randomString());
	else docId = docId.toLowerCase();
	liveContent(docId);
}

var timeoutID: number;
function save(ev){
	clearTimeout(timeoutID);
	timeoutID = setTimeout(() => {
		console.log("atualizando...");
		document.getElementById('status').hidden = false;
		setContent(getTextArea(),docId).then(()=>{
			document.getElementById('status').hidden = true;
			console.log("atualizado");
		});
	}, 500);
}

var killLiveContent: ()=>void = undefined;
function liveContent(doc, col = 'docs'){
	killLiveContent = firebase
	.firestore()
	.collection(col)
	.doc(doc)
	.onSnapshot((res) => {
		if(res.metadata.hasPendingWrites) return;
		if(isHidden){
			isHidden = false;
			(document.getElementById('textarea') as HTMLTextAreaElement).classList.toggle('hidden');
			(document.getElementById('status') as HTMLDivElement).hidden = true;
			(document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Atualizando...";
		}
		setTextArea(res.data() ? res.data().text : '');
	});
}

function setContent(text: string, doc = undefined, col = 'docs'){
	if(!doc) return;
	const docRef = firebase.firestore().collection(col).doc(doc)
	return (docRef.update({text}) as Promise<any>)
	.then(res=>res).catch((err)=>{
		if(err.message === "Requested entity was not found.")
			return (docRef.set({text}) as Promise<any>)
			.then(res=>res)
		else throw err;
	});
}

function setTextArea(text: string){
	let elem = document.getElementById('textarea') as HTMLTextAreaElement;
	const selectionStart = elem.selectionStart;
	const selectionEnd = elem.selectionEnd;
	elem.value = text;
	elem.selectionStart = selectionStart;
	elem.selectionEnd = selectionEnd;
}


function getTextArea(): string{
	return (document.getElementById('textarea') as HTMLTextAreaElement).value;
}

function tabinput(ev: KeyboardEvent){
	if(ev.keyCode !== 9 && ev.key !== "Tab") return;
	if(ev.ctrlKey || ev.shiftKey || ev.altKey) return;
	ev.preventDefault();
	document.execCommand('insertText',false,'\t');
}

function randomString(x = undefined){
	// let str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let str = "0123456789abcdefghijklmnopqrstuvwxyz";
	// if(x === undefined) x = Math.floor(Math.random()*1073741824);
	let maxrand = str.length**5;
	if(x === undefined) x = Math.floor(Math.random()*maxrand);
	if(isNaN(x) || x !== Math.floor(x) || x < 0){
		console.error("invalid number for random string");
		return "";
	}
	let res = "";
	while(x){
		res = str[x%str.length] + res;
		x = Math.floor(x/str.length);
	}
	while(res.length < 5) res = '0'+res;
	return res;
}

class notepade{
	static login(password: string){
		let email = docId+'@notepade.web.app';
		firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
			console.log("User signed in");
			if(killLiveContent) killLiveContent();
			liveContent(docId);
		}).catch(()=>{
			firebase.auth().createUserWithEmailAndPassword(email,password).then(()=>{
				console.log("User created");
				if(killLiveContent) killLiveContent();
				liveContent(docId);
			})
		})
	}
	static logout(){
		firebase.auth().signOut();
	}
	static currentUser(){
		return firebase.auth().currentUser;
	}
	static _update(obj,msg){
		return firebase.firestore().collection('docs').doc(docId).update(obj).then(()=>{
			console.log(msg)
		}).catch(err=>{
			console.error(err);
			throw err;
		})
	}
	static protect(flag = true){
		if(flag){
			this._update({protected: (firebase.auth().currentUser?.uid || '')},"This doc is now protected");
		} else {
			this._update({public: firebase.firestore.FieldValue.delete()},"'public' attribute removed").then(()=>{
				this._update({protected: firebase.firestore.FieldValue.delete()},"This doc is not protected anymore").then(()=>{
					// firebase.auth().currentUser.delete().then(()=>{
					// 	console.log("User deleted");
					// })
				});
			});
		}
	}
	static public(flag = true){
		if(flag){
			this._update({public: true},"This doc is now public");
		} else {
			this._update({public: firebase.firestore.FieldValue.delete()},"'public' attribute removed");
		}
	}
	static unprotect(){ return this.protect(false); }
	static unpublic(){ return this.public(false); }
	constructor(){ throw Error("This can't be instantiated"); }
}
Object.defineProperty(notepade,'_update',{enumerable:false});