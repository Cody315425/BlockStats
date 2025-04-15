import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDoc, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getCollectionArray(collectionName){
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const dataArray = [];
    snapshot.forEach((doc) => {
        dataArray.push(doc.data());
    });
    return dataArray;
}

function renderServers(servers){
    let result = document.querySelector(`#serverList`);
    let html = ``;
    for(let i of servers){
        html += `<button class="serverBut">${i.serverName}</button>`
    }
    result.innerHTML = html;
}

let servers = await getCollectionArray(`Servers`);
renderServers(servers);

function search(){
    let searchKey = document.querySelector(`#nameIN`).value;
    let result = getPlayerData(searchKey);
    console.log(result);
}