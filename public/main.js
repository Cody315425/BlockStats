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

async function renderServerInfo(servers){
    let result = document.querySelector(`#servers`);
    let html = ``;
    
    for(let i of servers){
        let serverData = await getServData(i.serverIP);
        console.log(serverData);
        html += `<div id="servDisp">
        <p class="text_outline">${i.serverName}</p>
      <img src="https://eu.mc-api.net/v3/server/favicon/${i.serverIP}">`;
        if(serverData.online){
            html += `<p class="text_outline">Online</p>
            <p class="text_outline">Player Count: ${serverData.players.online}/${serverData.players.max}</p>`;
        }   
        else{
            html += `<p class="text_outline">Offline</p>
            <p class="text_outline">Player Count: N/A</p>`;
        }
        html += `<button class="text_outline hoverable">Reviews</button>
        </div>`;
    }
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
renderServerInfo(servers);
