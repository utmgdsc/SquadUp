import { collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore"; 
import { db } from './firebaseConfig';

export function addUser(uid, username){
    setDoc(doc(db, "users", uid), {
        name: username
    });
}

export function addSquad(squadname){
    addDoc(collection(db, "squads"), {
        name: squadname
    });
}

export function addGoal(goalname, current, target){
    addDoc(collection(db, "goals"), {
        name: goalname,
        current: current,
        target: target
    });
}

// type can only have two values: Sports or Workout
// DateTime must be a Timestamp object
// Example for Dec25, 2023: addEvent("Drop-in Boxing", "Sports", Timestamp.fromDate(new Date("2023-03-25")));
export function addEvent(eventname, type, DateTime){
    addDoc(collection(db, "events"), {
        name: eventname,
        type: type,
        DateTime: DateTime
    });
}

