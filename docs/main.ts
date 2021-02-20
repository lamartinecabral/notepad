declare const firebase;
var docId = '';
var isHidden = true;
var emailComplement = '@lamart-notepad.com';

var killAuthStateChanged: ()=>void = undefined;
function initApp(){
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if(!docId) return location.replace(document.URL.split('?')[0]+'?default');
    else docId = docId.toLowerCase();
    console.log({docId});
    killAuthStateChanged = firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            if(user.email !== docId+emailComplement){
                console.log('logged as another user. Sign out...', user.email, {user});
                if(typeof(killLiveContent) == 'function') killLiveContent();
                firebase.auth().signOut();
            }
            else {
                console.log('logged in', user.email, {user});
                liveContent(docId);
            }
        } else {
            console.log('signing in...');
            firebaseauth();
        }
    });
}

function firebaseauth(){
    const email = docId+emailComplement;
    const password = docId+emailComplement;
    return firebase.auth().signInWithEmailAndPassword(email, password);
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
        if(isHidden){
            (document.getElementById('textarea') as HTMLTextAreaElement).classList.toggle('hidden');
            (document.getElementById('status') as HTMLDivElement).hidden = true;
            (document.getElementById('status').children[0] as HTMLSpanElement).innerText = "Atualizando...";
            isHidden = false;
        }
        setTextArea(res.data().text);
    });
}

function getContent(doc, col = 'docs'){
    return (firebase
    .firestore()
    .collection(col)
    .doc(doc)
    .get() as Promise<any>)
    .then(res=>res.data());
}

function setContent(text: string, doc = undefined, col = 'docs'){
    if(doc) return (firebase
    .firestore()
    .collection(col)
    .doc(doc)
    .set({text}) as Promise<any>)
    .then(res=>res);

    else return (firebase
    .firestore()
    .collection(col)
    .add({text}) as Promise<any>)
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
