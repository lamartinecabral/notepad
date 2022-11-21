// Your web app's Firebase configuration
var firebaseConfig = (str=>{
	return [ k=>[ ...new Array(+k[0]).fill('='),
			...k.substr(1).split('')
		].reverse().join(''),
		atob, JSON.parse
	].reduce((a,b)=>b(a), str)
})([
	'2QfiMzM3QGOmRmNlFDM2QmN0ETNhFWY5cjOiV2d6QTN1QjN5gj',
	'NxQDO0oTMiojIklEcwFmIsICN1UDN2kDO2EDN4QjI6ICZJJXZk',
	'5WZTdmbpdWYzNXZtJCLi02bj5CdvB3cwBXYuQWYwVGdv5WL0JX',
	'YtFGbiojI0V2ajVnQldWYy9GdzJCLiQWYwVGdv5WL0JXYtFGbi',
	'ojIklEdjVmavJHciwiIt92YuAHchV2chJWZylmZuQWYwVGdv5W',
	'L0JXYtFGbiojIulWYt9GRoRXdhJCLiAzaXxEcIJWM4oEem9ULk',
	'NkM4dlUuRzZ1cFWIZ3bRlVaCl3UhpXSBJiOikXZLlGchJye'
].join(''));

// Initialize Firebase
console.log('init firebase');
(function(){
    firebase.initializeApp(firebaseConfig);
    
    var docId = (document.URL.split("?")[1] || "").split("#")[0];
    if(docId) firebase = firebase.initializeApp(firebaseConfig, docId);
})();

initApp();