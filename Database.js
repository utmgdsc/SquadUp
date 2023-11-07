import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db } from './firebaseConfig';

export function addCollection(){
    // Firestore testing
    try {
        const docRef = addDoc(collection(db, "users"), {
        first: "Wald",
        last: "Haddad",
        born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export function addUser(uid, username){
    setDoc(doc(db, "users", uid), {
        name: username
    });
}

