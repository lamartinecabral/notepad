declare const firebase;
var docId = '';
var isHidden = true;
var emailComplement = '@lamart-notepad.com';

var unsubscribeAuthState = undefined;
function initApp(){
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if(!docId) return location.replace(document.URL.split('?')[0]+'?default');
    else docId = docId.toLowerCase();
    console.log({docId});
    unsubscribeAuthState = firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            if(user.email !== docId+emailComplement){
                console.log('logged as another user. Sign out...', user.email, {user});
                if(typeof(killLiveContent) == 'function') killLiveContent();
                firebase.auth().signOut();
            }
            else {
                console.log('logged in', user.email, {user});
                // getContent(docId).then(data=>{
                //     setTextArea(data.text);
                // });
                liveContent(docId);
            }
        } else {
            console.log('signing in...');
            firebaseauth();
        }
    });
}

function firebaseauth(){
    let email = docId+emailComplement;
    let password = docId+emailComplement;
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

var timeoutID;
function save(ev){
    clearTimeout(timeoutID);
    // document.getElementById('textarea').classList.add("updating");
    timeoutID = setTimeout(() => {
        console.log("atualizando...");
        document.getElementById('status').hidden = false;
        setContent(getTextArea(),docId).then(()=>{
            // document.getElementById('textarea').classList.remove("updating");
            document.getElementById('status').hidden = true;
            console.log("atualizado");
        });
    }, 500);
}

var killLiveContent: Function = undefined;
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
