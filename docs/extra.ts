
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

function protectAction(){
	if(state.protected) notepade.unprotect();
	else notepade.protect();
}

function publicAction(){
	if(state.public) notepade.unpublic();
	else notepade.public();
}

function passwordModal(): Promise<string>{
	return new Promise((resolve,reject)=>{
		let div = backdrop(resolve,reject);
		document.body.insertBefore(div,document.getElementById('textarea'));
		let div2 = whitebox(resolve,reject);
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
		send.type = "submit"; Object.assign(send.style,{'font-family':'inherit'});
		form.append(send);
	})
}

function optionsModal(): Promise<string>{
	return new Promise((resolve,reject)=>{
		let intervalId = 0;
		let div = backdrop(resolve,(msg)=>{clearInterval(intervalId);reject(msg)});
		document.body.insertBefore(div,document.getElementById('textarea'));
		let div2 = whitebox(resolve,reject);
		div.append(div2);

		let protect = document.createElement('div'); div2.append(protect);
		
		let input1 = document.createElement('input') as HTMLInputElement;
		input1.type = "checkbox"; input1.name = "protect";
		input1.addEventListener('change',()=>{protectAction()})
		protect.append(input1);

		let label1 = document.createElement('label');
		label1.innerHTML = "Protected"; label1.htmlFor = "protect";
		protect.append(label1);

		let public = document.createElement('div'); div2.append(public);
		Object.assign(public.style,{'margin':'0.5em 0 1em 0'});

		let input2 = document.createElement('input') as HTMLInputElement;
		input2.type = "checkbox"; input2.name = "public";
		input2.addEventListener('change',()=>{publicAction()})
		public.append(input2);

		let label2 = document.createElement('label');
		label2.innerHTML = "Public"; label2.htmlFor = "public";
		public.append(label2);

		let logout = document.createElement('div'); div2.append(logout);
		Object.assign(logout.style,{'margin-top':'1em', 'text-align':'center'});

		let button = document.createElement('button') as HTMLButtonElement;
		button.innerText = 'Logout'; Object.assign(button.style,{'font-family':'inherit'});
		button.addEventListener('click',()=>{clearInterval(intervalId); notepade.logout(); div.remove();})
		logout.append(button);

		let prot,publ;
		intervalId = setInterval(()=>{
			if(prot === state.protected && publ === state.public) return;
			prot = state.protected; publ = state.public;
			if(state.protected){
				input1.checked = true;
				input2.disabled = false;
			} else {
				input1.checked = false;
				input2.disabled = true;
			}
			if(state.public){
				input2.checked = true;
			} else {
				input2.checked = false;
			}
		},100)

	})
}

function backdrop(resolve,reject){
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
	let eventListener = ev=>{
		if(ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27){
			reject("esc pressed");
			div.remove();
			document.removeEventListener('keyup',eventListener);
		}
	}
	document.addEventListener("keyup",eventListener);
	return div;
}

function whitebox(resolve,reject){
	let div2 = document.createElement('div') as HTMLDivElement;
	Object.assign(div2.style,{
		background: "white", padding: "2em",
		position: "absolute", bottom: "50%", right: "50%",
		transform: "translate(50%, 50%)",
	})
	div2.addEventListener("click",(ev)=>{ev.stopPropagation();});
	return div2;
}