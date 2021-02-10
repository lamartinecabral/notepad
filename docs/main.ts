declare const firebase;
var docId = 'teste';

function initApp(){
    console.log('initApp');
    firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            getContent(docId).then(data=>{
                setTextArea(data.text);
            });
        } else {
            firebaseauth().then(()=>{
                console.log('logged in');
                getContent(docId).then(data=>{
                    setTextArea(data.text);
                });
            });
        }
    });
}

function firebaseauth(){
    let email = 'teste@lamart-notepad.com';
    let password = 'teste@lamart-notepad.com';
    return firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        console.log('logged in', {user});
    })
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
