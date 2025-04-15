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

async function getServData(ip){
    let response = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
    let data = await response.json();
    return data;
}

async function renderServerInfo(name, ip){
    let data = await getServData(ip);
    let result = document.querySelector(`#serverInfo`);
    let html = ``;
    html += `<img src="https://eu.mc-api.net/v3/server/favicon/${ip}">
    <p>Server Name: ${name}</p>`;
    if(data.online)
        html += `<p>Status: Online</p>`;
    else   
        html += `<p>Status: Offline</p>`;
    html+= `<p>Player Count: ${data.players.online}</p>`;

    result.innerHTML = html;
}

window.renderServerInfo = renderServerInfo;

function renderServers(servers){
    let result = document.querySelector(`#serverList`);
    let html = ``;
    for(let i of servers){
        html += `<button class="serverBut" onclick="renderServerInfo('${i.serverName}', '${i.serverIP}')">${i.serverName}</button>`
    }
    result.innerHTML = html;
}

let servers = await getCollectionArray(`Servers`);
renderServers(servers);