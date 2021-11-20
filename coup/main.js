var coup;
(function (coup) {
    var Card;
    (function (Card) {
        Card["Duque"] = "Duque";
        Card["Capit\u00E3o"] = "Capit\u00E3o";
        Card["Condessa"] = "Condessa";
        Card["Assassino"] = "Assassino";
        Card["Embaixador"] = "Embaixador";
    })(Card || (Card = {}));
    var state;
    var docId;
    function initCoup() {
        console.log('initApp');
        docId = document.URL.split('?')[1];
        if (!docId)
            return location.replace('?' + randomString());
        else
            docId = docId.toLowerCase();
        liveContent();
    }
    var killLiveContent = undefined;
    function liveContent() {
        if (killLiveContent)
            killLiveContent();
        killLiveContent = collection
            .doc(docId)
            .onSnapshot(function (res) {
            if (res.metadata.hasPendingWrites)
                return;
            setState(res.data());
        });
    }
    function setState(data) {
    }
    function updateState(data) {
        return collection.doc(docId).update(data).then(function (res) { return res; });
    }
})(coup || (coup = {}));
