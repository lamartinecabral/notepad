var docId;

var drive = {
	initApp: function () {
		console.log("initDrive");
		docId = (document.URL.split("?")[1] || "").split("#")[0];
		if (!docId)
			drive.setContent("# Marked in browser\n\nRendered by **marked**.");
		else {
			docId = docId.toLowerCase();
			drive.liveAuth();
		}
	},

	liveAuth: function () {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				if (user.email.split("@")[0] === docId) {
					console.log("Logged");
				} else {
					console.log("Not logged");
				}
			} else {
				console.log("No user.");
			}
			drive.listAll();
		});
	},

	listAll: function(){
		drive.wait();
		storageRef.child(docId).listAll().then((res) => {
			Promise.all(
				res.items.sort((a,b)=>a.name < b.name ? -1 : 1)
					.map(item=>item.getDownloadURL())
			).then(urls=>{
				for(var i=0; i<urls.length; i++){
					drive.addItem(res.items[i], urls[i]);
				}
				drive.done();
			})
		}).catch(err=>{
			drive.done();
			drive.clearList();
			console.error(err)
		});
	},

	clearList: function(){
		var table = document.getElementsByTagName('table')[0];
		for(var i=table.children.length-1; i>=0; i--){
			var tr = table.children[i];
			tr.remove();
		}
	},

	addItem: function(itemRef, url){
		(document.getElementById(itemRef.fullPath) || {remove:()=>{}}).remove();
		var table = document.getElementsByTagName('table')[0];
		var tr = document.createElement('tr');
		tr.id = itemRef.fullPath;

		var td1 = document.createElement('td');
		var a = document.createElement('a');
		a.innerText = itemRef.name;
		a.href = url;
		td1.append(a);
		
		var td2 = document.createElement('td');
		var button = document.createElement('button');
		button.innerText = 'delete';
		button.onclick = ()=>drive.delete(itemRef.fullPath);
		td2.append(button);

		tr.append(td1);
		tr.append(td2);
		table.append(tr);
	},

	selectFile: function(){
		if(drive.waiting) return;
		var input = document.createElement('input');
		input.type = 'file';
		input.onchange = ()=>drive.upload(input.files[0]);
		input.click();
	},

	upload: function(file){
		if(!file) return;
		if(file.size > 10 * 1024 * 1024) return drive.error('size limit exceeded');
		var ref = storageRef.child(docId+'/'+file.name);
		drive.wait();
		ref.put(file).then((res) => {
			drive.listAll();
		}).catch(drive.error);
	},

	delete: function(fullPath){
		if(drive.waiting) return;
		drive.wait();
		storageRef.child(fullPath).delete().then(()=>{
			document.getElementById(fullPath).remove();
			drive.done();
		}).catch(drive.error);
	},

	error: function(err){
		alert(err.message || err);
		console.error(err);
	},

	waiting: false,
	wait: function(){
		drive.waiting = true;
		document.getElementById('wait').hidden = false;
	},

	done: function(){
		drive.waiting = false;
		document.getElementById('wait').hidden = true;
	},

};