declare const auth;
declare const firestore;
declare const collection;

var killOnAuthStateChanged = undefined;
function initAdmin(){
	console.log("initAdmin");
	killOnAuthStateChanged = auth.onAuthStateChanged(function(user) {
		if (user) {
			console.log("Logged user", user);
			if(user.uid != "U23CfQYMJaRhLeiZsIQRAT9LPSC3"){
				console.log("User is not admin. Signing Out.");
				logout();
			} else {
				console.log("Done.");
			}
		} else {
			console.log("No user.");
		}
	});
}

function getUser(){
	return auth.currentUser;
}

function login(email, password){
	console.log("Logging in...");
	return auth.signInWithEmailAndPassword(email,password)
	.catch(err=>{
		console.log("Could not log in.");
		console.error(err);
	})
}

function logout(){
	console.log("Logging out...");
	return auth.signOut()
	.catch(err=>{
		console.log("Could not log out.");
		console.error(err);
	});
}

function listDocs(): Promise<void | Record<string,Doc>>{
	console.log("Listing docs...");
	return (collection.get() as Promise<any>)
	.then(res=>{
		let docs: Record<string,Doc> = {};
		(res.docs as any[])
		.forEach(doc=>docs[doc.id] = doc.data());
		console.log("docs", docs);
		return docs;
	}).catch(err=>{
		console.log("Could not list docs.")
		console.error(err);
	});
}

function getDoc(docId): Promise<Doc>{
	console.log("Getting doc...", docId);
	return (collection.doc(docId).get() as Promise<any>)
	.then(res=>{
		let data = res.data();
		console.log(data);
		return data;
	}).catch(err=>{
		console.log("Could not get doc");
		console.error(err);
	});
}

function removeDoc(docId){
	console.log("Deleting "+docId);
	return collection.doc(docId).delete()
	.then(()=>console.log("Document deleted."))
	.catch(err=>{
		console.log("Could not delete the document.");
		console.error(err);
	});
}

function changePassword(password){
	if(!auth.currentUser) return console.log("You must log in first.");
	console.log("Updating password...", auth.currentUser.email);
	return auth.currentUser.updatePassword(password)
	.then(()=>console.log("Password updated."))
	.catch(err=>{
		console.log("Could not update the password.");
		console.error(err);
	});
}

function clearDocs(func: (doc: Doc)=>boolean ){
	if(!func) func = (doc)=>!doc.text.length;
	let counter = 0;
	let ans = prompt("Warning. This operation can't be undone. Are you sure this function are correct to evaluate a doc to be deleted? Answer with 'yes' to confirm.\n" + func);
	if(ans === "yes") collection.get().then(res=>{
		for(let doc of res.docs){
			if(func(doc.data() as Doc)){
				counter++;
				console.log(doc);
				removeDoc(doc.id).then(()=>{
					counter--;
					if(counter === 0)
						console.log("Collection cleared.")
				});
			}
		}
		if(counter === 0) console.log("No doc deleted");
	});
}

declare const eruda;
function initEruda(){
	var script = document.createElement('script');
	script.src="https://cdn.jsdelivr.net/npm/eruda";
	document.body.appendChild(script);
	script.onload = function (){
		eruda.init();
		eruda.show();
		document.getElementById('eruda-btn').hidden = true;
	}
}

interface Doc{
	text: string;
}

function help(){
	console.log(
`interface Doc{
	text: string;
}

Variaveis disponiveis:
auth = firebase.auth()
firestore = firebase.firestore()
collection = firebase.firestore().collection('docs')

Funções disponíveis:
killOnAuthStateChanged(): void;
getUser():                firebase.User;
login(email,password):    Promise<void>;
logout():                 Promise<void>;
listDocs():               Promise<Record<string,Doc>>;
getDoc(docId):            Promise<Doc>;
removeDoc(docId):         Promise<void>;
changePassword(password): Promise<void>;

/* Deletes all docs which func returns true */
clearDocs(func: (doc: Doc)=>boolean): void
`);
}
