declare const firebase;
var docId;
var isHidden = true;
var state: {public: boolean, protected: boolean, login: boolean} = {} as any
var aux_state = {};

function diffState(){
	for(let i in state) if(state[i] !== aux_state[i])
		return aux_state = Object.assign({},state), true;
	return false;
}

function initApp(){
	console.log('initApp');
	docId = document.URL.split('?')[1].split('#')[0];
	if(!docId)
		return location.replace('?'+randomString());
	else docId = docId.toLowerCase();
	liveContent(docId);
	liveAuth();
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

function liveAuth(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			if(user.email.split('@')[0] === docId){
				console.log('Logged');
				state.login = true;
			} else {
				console.log('Not logged')
				state.login = false;
			}
		} else {
			console.log("No user.");
			state.login = false;
		}
		if(diffState()) updateButtons();
	});
}

var killLiveContent: ()=>void = undefined;
function liveContent(doc, col = 'docs'){
	killLiveContent = firebase
	.firestore()
	.collection(col)
	.doc(doc)
	.onSnapshot((res) => {
		
		if(res.exists){
			state.protected = res.data().protected !== undefined;
			state.public = res.data().public !== undefined;
		} else {
			state.protected = false; state.public = false;
		}
		if(diffState()) updateButtons();

		if(res.metadata.hasPendingWrites) return;
		if(isHidden){
			isHidden = false;
			(document.getElementById('textarea') as HTMLTextAreaElement).classList.toggle('hidden');
			(document.getElementById('status') as HTMLDivElement).hidden = true;
			(document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Atualizando...";
		}
		setTextArea(res.exists ? res.data().text : '');
	});
}

function setContent(text: string, doc = undefined, col = 'docs'){
	if(!doc) return;
	const docRef = firebase.firestore().collection(col).doc(doc)
	return (docRef.update({text}) as Promise<any>)
		.catch(()=>docRef.set({text}))
		.then(res=>res);
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
	if(x) return x.toString(36);
	let str = Math.floor(Math.random()*(36**6)).toString(36);
	while(str.length < 6) str = '0'+str;
	return str;
}

function passwordAction(){
	if(state.login) notepade.logout();
	else{
		passwordModal().then(pwd=>{
			notepade.login(pwd).catch(err=>alert(err.message));
		});
	}
}

function protectAction(){
	if(state.protected) notepade.unprotect();
	else notepade.protect();
}

function publicAction(){
	if(state.public) notepade.unpublic();
	else notepade.public();
}

function updateButtons(){
	if(state.login){
		document.getElementById('login').innerHTML = 'logout';
		document.getElementById('protect').classList.remove('nodisplay');
		if(state.protected){
			document.getElementById('protect').innerHTML = 'unprotect';
			document.getElementById('public').classList.remove('nodisplay');
		} else {
			document.getElementById('protect').innerHTML = 'protect';
			document.getElementById('public').classList.add('nodisplay');
		}
		if(state.public){
			document.getElementById('public').innerHTML = 'unpublic';
		} else {
			document.getElementById('public').innerHTML = 'public';
		}
	} else {
		document.getElementById('login').innerHTML = 'password';
		document.getElementById('protect').classList.add('nodisplay');
		document.getElementById('public').classList.add('nodisplay');
	}
}

class notepade{
	static login(password: string){
		return new Promise((resolve,reject)=>{
			let email = docId+'@notepade.web.app';
			firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
				console.log("User signed in");
				if(killLiveContent) killLiveContent();
				liveContent(docId);
				resolve('');
			}).catch((err)=>{
				firebase.auth().createUserWithEmailAndPassword(email,password).then(()=>{
					console.log("User created");
					if(killLiveContent) killLiveContent();
					liveContent(docId);
					resolve('');
				}).catch(()=>{
					console.error(err);
					reject(err)
				});
			})
		});
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

function passwordModal(): Promise<string>{
	return new Promise((resolve,reject)=>{
		let div = document.createElement('div') as HTMLDivElement;
		Object.assign(div.style,{
			position: "fixed", top: 0, left: 0,
			width: "100%", height: "100%",
			background: "#0009",
		})
		div.addEventListener("click",()=>{
			div.remove();
			reject("backdrop click");
		});
		div.addEventListener("keyup",ev=>{
			if(ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27){
				reject("esc pressed");
				div.remove();
			}
		});
		document.body.insertBefore(div,document.getElementById('textarea'));
	
		let div2 = document.createElement('div') as HTMLDivElement;
		Object.assign(div2.style,{
			background: "white", padding: "2em",
			position: "absolute", bottom: "50%", right: "50%",
			transform: "translate(50%, 50%)",
		})
		div2.addEventListener("click",(ev)=>{ev.stopPropagation();});
		div.append(div2);
	
		let form = document.createElement('form') as HTMLFormElement;
		form.addEventListener("submit",(ev)=>{
			ev.preventDefault();
			div.remove();
			resolve(ev.target[0].value);
		});
		div2.append(form);
	
		let label = document.createElement('label');
		label.innerHTML = "Password: "; label.htmlFor = "pwd";
		form.append(label);
		
		let input = document.createElement('input') as HTMLInputElement;
		input.type = "password"; input.name = "pwd";
		setTimeout(i=>i.select(), 0, input);
		form.append(input);

		let send = document.createElement('input') as HTMLInputElement;
		send.type = "submit";
		form.append(send);
	})
}