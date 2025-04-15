async function getCollectionArray(collectionName){
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const dataArray = [];
    snapshot.forEach((doc) => {
        dataArray.push(doc.data());
    });
    return dataArray;
}

function search(){
    let searchKey = document.querySelector(`#nameIN`).value;
    let result = getPlayerData(searchKey);
    console.log(result);
}