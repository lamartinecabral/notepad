declare const firebase;
var docId = '';
var emailComplement = '@lamart-notepad.com';

function initApp(){
    console.log('initApp');
    docId = document.URL.split('?')[1];
    if(!docId) docId = "teste";
    else docId = docId.toLowerCase();
    console.log({docId});
    firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            if(user.email !== docId+emailComplement){
                console.log('logged as another user. Sign out...', user.email, {user});
                firebase.auth().signOut();
            }
            else {
                console.log('logged in', user.email, {user});
                getContent(docId).then(data=>{
                    setTextArea(data.text);
                });
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
    document.getElementById('textarea').className = "updating";
    timeoutID = setTimeout(() => {
        console.log("atualizando...");
        setContent(getTextArea(),docId).then(()=>{
            document.getElementById('textarea').className = "";
            console.log("atualizado");
        });
    }, 800);
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
    (document.getElementById('textarea') as any).value = text;
}

function getTextArea(): string{
    return (document.getElementById('textarea') as any).value;
}

function tabinput(ev){
	if(ev.keyCode !== 9) return;
    ev.preventDefault();
    document.execCommand('insertText',false,'\t');
}
