// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBiYQovHXW5g4nRWx2Cd-OfxJ81bHpLWk0",
    authDomain: "lamart-notepad.firebaseapp.com",
    projectId: "lamart-notepad",
    storageBucket: "lamart-notepad.appspot.com",
    messagingSenderId: "484168964554",
    appId: "1:484168964554:web:79aaa5146d601e6df8d733"
};
// Initialize Firebase
console.log('init firebase');
(function(){
    firebase.initializeApp(firebaseConfig);
    
    var docId = (document.URL.split("?")[1] || "").split("#")[0];
    if(docId) firebase = firebase.initializeApp(firebaseConfig, docId);
})();

initApp();