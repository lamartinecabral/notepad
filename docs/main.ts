declare const firebase;
var docId;
var isHidden = true;

function initApp(){
	console.log('initApp');
	docId = document.URL.split('?')[1];
	if(!docId)
		return location.replace('?default');
	liveContent(docId);
}

var timeoutID;
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
	if(doc) return (firebase
	.firestore()
	.collection(col)
	.doc(doc)
	.set({text}) as Promise<any>)
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
