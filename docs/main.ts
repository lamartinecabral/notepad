declare const firebase;
var docId;
var isHidden = true;
var state: {public: boolean, protected: boolean, login: boolean} = {} as any
var aux_state = {};
var nightMode = false;

function diffState(){
	for(let i in state) if(state[i] !== aux_state[i])
		return aux_state = Object.assign({},state), true;
	return false;
}

function initApp(){
	console.log('initApp');
	docId = (document.URL.split('?')[1] || '').split('#')[0];
	if(!docId)
		return location.replace('?'+randomString());
	else docId = docId.toLowerCase();
	setTheme();
	document.body.hidden = false;
	liveContent(docId);
	liveAuth();
}

var timeoutID: number;
function save(ev){
	clearTimeout(timeoutID);
	timeoutID = setTimeout(() => {
		console.log("updating...");
		document.getElementById('status').hidden = false;
		(document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Saving...";
		setContent(getTextArea(),docId).then(()=>{
			document.getElementById('status').hidden = true;
			console.log("updated");
		}).catch(err=>{
			console.error(err);
			(document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Protected";
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
			// (document.getElementById('textarea') as HTMLTextAreaElement).classList.toggle('nodisplay');
			(document.getElementById('textarea') as HTMLTextAreaElement).hidden = isHidden;
			(document.getElementById('status') as HTMLDivElement).hidden = true;
			(document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Saving...";
		}
		setTextArea(res.exists ? res.data().text : '');
	}, err=>{
		console.error(err);
		isHidden = true;
		(document.getElementById('textarea') as HTMLTextAreaElement).hidden = isHidden;
		(document.getElementById('status') as HTMLDivElement).hidden = false;
		(document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Protected";
	});
}

function setContent(text: string, doc = undefined, col = 'docs'){
	if(!doc) return;
	const docRef = firebase.firestore().collection(col).doc(doc)
	return (docRef.update({text}) as Promise<any>)
		.catch(()=>docRef.set({text}))
		.then(res=>console.log(res));
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

function updateButtons(){
	if(state.login){
		document.getElementById('login').hidden = true;
		document.getElementById('options').hidden = false;
		// document.getElementById('login').classList.add('nodisplay');
		// document.getElementById('options').classList.remove('nodisplay');
	} else {
		document.getElementById('login').hidden = false;
		document.getElementById('options').hidden = true;
		// document.getElementById('login').classList.remove('nodisplay');
		// document.getElementById('options').classList.add('nodisplay');
	}
}

function showOptions(){
	optionsModal();
}

function passwordAction(){
	if(state.login) notepade.logout();
	else passwordModal().then(pwd=>{
		notepade.login(pwd).catch(err=>alert(err.message));
	});
}

function setTheme(toggle?){
	if(localStorage && localStorage.getItem('nightMode') !== null)
		nightMode = localStorage.getItem('nightMode') === 'true';
	if(toggle) nightMode = !nightMode;
	document.body.style.cssText = `--background: var(--${nightMode ? 'dark' : 'light'}); --color: var(--${!nightMode ? 'dark' : 'light'});`;
	document.getElementById('theme').innerText = nightMode ? 'light' : 'dark';
	if(localStorage) localStorage.setItem('nightMode', ''+nightMode);
}