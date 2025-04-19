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
    let response = await fetch(`https://eu.mc-api.net/v3/server/ping/${ip}`);
    let data = await response.json();
    return data;
}

async function renderServerInfo(servers) {
    let result = document.querySelector(`#servers`);
    let html = ``;

    // Render the server elements without images first
    for (let i of servers) {
        html += `<div id="servDisp">
        <p class="text_outline">${i.serverName}</p>
        <img data-src="https://eu.mc-api.net/v3/server/favicon/${i.serverIP}" alt="${i.serverName}" class="lazy-image" style="opacity: 0;" onload="this.style.opacity=1;">
        <p class="text_outline">Loading...</p>
        <p class="text_outline">IP: ${i.serverIP}</p>
        <button class="text_outline hoverable" onclick="handleReview('${i.serverName}')">Reviews</button>
        </div>`; 
    }
    result.innerHTML = html;

    // Fetch server data and update the elements
    for (let i of servers) {
        let serverData = await getServData(i.serverIP);
        let serverElement = document.querySelector(`#servers #servDisp:nth-child(${servers.indexOf(i) + 1})`);
        let imgElement = serverElement.querySelector(`img`);

        // Update the image source and make it visible
        imgElement.src = imgElement.dataset.src;
        imgElement.style.opacity = 1;

        // Update the server status
        let statusHtml = serverData.online
            ? `<p class="text_outline">Online</p>
               <p class="text_outline">Player Count: ${serverData.players.online}/${serverData.players.max}</p>`
            : `<p class="text_outline">Offline</p>
               <p class="text_outline">Player Count: N/A</p>`;
        serverElement.querySelector(`p:nth-of-type(2)`).outerHTML = statusHtml;
    }
}

let servers = await getCollectionArray(`Servers`);
renderServerInfo(servers);

function search(){
    if(document.querySelector("#search").value === ""){
        return;
    }
    let input = document.querySelector("#search").value.toLowerCase();
    let results = [];
    
    for(let rec of servers){
        let searchText = rec.serverName.toLowerCase();
        if (searchText.search(input) !== -1 ){
            results.push(rec);
          }
    }
    renderServerInfo(results);
}

function resetSearch(){
    document.querySelector("#search").value = ``;
    renderServerInfo(servers);
}


function handleReview(name){
    document.getElementById("sidePanel").classList.add("open");
    document.querySelector("#sidePanel h2").innerText = name;
    let result = document.querySelector("#reviews");
}  

function closePanel() {
    document.getElementById("sidePanel").classList.remove("open");
}

window.closePanel = closePanel;
window.search = search; 
window.resetSearch = resetSearch;
window.handleReview = handleReview;

export {getCollectionArray};