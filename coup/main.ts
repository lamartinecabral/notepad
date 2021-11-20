namespace coup{
    declare const collection;
    enum Card{
        Duque = "Duque",
        Capitão = "Capitão",
        Condessa = "Condessa",
        Assassino = "Assassino",
        Embaixador = "Embaixador",
    }
    interface Timestamp{
        nanoseconds: number,
        seconds: number,
    }
    interface Player{
        name: string,
    }
    interface State{
        online: { [playerName: string]: Timestamp, },
        cards: { [playerName: string]: Card[], },
        players: Player[],
        playerName: string,
        targetName: string,
        phase: any,
    }
    var state: State;

    var docId;
    function initCoup(){
        console.log('initApp');
        docId = document.URL.split('?')[1];
        if(!docId)
            return location.replace('?'+randomString());
        else docId = docId.toLowerCase();
        liveContent();
    }

    var killLiveContent: ()=>void = undefined;
    function liveContent(){
        if(killLiveContent) killLiveContent();
        killLiveContent = collection
        .doc(docId)
        .onSnapshot((res) => {
            if(res.metadata.hasPendingWrites) return;
            setState(res.data());
        });
    }

    function setState(data: State){

    }

    function updateState(data: any){
        return collection.doc(docId).update(data).then(res=>res);
    }
}