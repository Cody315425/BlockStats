import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { doc, getFirestore, collection, getDoc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getCollectionArray} from "./main.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getReviewByServerName(serverName) {
    const docRef = doc(db, 'Reviews', serverName); // Reference to the specific document
    const reviewDoc = await getDoc(docRef); // Fetch the document
    return reviewDoc.data();
}

export {getReviewByServerName};