import { collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from './firebaseConfig';

/* 
Add Functions - To create new documents inside the database,
these are all used with parameters      
*/

export function addUser(uid, username) {
    setDoc(doc(db, "users", uid), {
        name: username
    });
}

export function addSquad(squadname) {
    addDoc(collection(db, "squads"), {
        name: squadname
    });
}

export function addGoal(goalname, current, target) {
    addDoc(collection(db, "goals"), {
        name: goalname,
        current: current,
        target: target
    });
}

// type can only have two values: Sports or Workout
// DateTime must be a Timestamp object
// Example for Dec25, 2023: addEvent("Drop-in Boxing", "Sports", Timestamp.fromDate(new Date("2023-03-25")));
export function addEvent(eventname, type, DateTime) {
    return addDoc(collection(db, "events"), {
        name: eventname,
        type: type,
        DateTime: DateTime
    });
}

export function addFriend(userid1, userid2) {
    let doc_name = userid1 + "_" + userid2;
    setDoc(doc(db, "friendship", doc_name), {
        user1ID: userid1,
        user2ID: userid2,
    });
}

/* 
Join Functions - To create new join documents inside the database,
these are used to create relationships between collections    
*/

export function joinUsertoSquad(uid, squadID){
    let doc_name = uid + "_" + squadID;
    setDoc(doc(db, "users_squads_join", doc_name), {
        userID: uid,
        squadID: squadID,
    });
}

/* 
DateTime must be a Timestamp object
Example for Dec25 to Dec29, 2023: 
joinUsertoGoal([some uid], [some goalID], Timestamp.fromDate(new Date("2023-03-25")), Timestamp.fromDate(new Date("2023-03-29")));
*/
export function joinUsertoGoal(uid, goalID, startDate, endDate){
    let doc_name = uid + "_" + goalID;
    setDoc(doc(db, "users_goals_join", doc_name), {
        userID: uid,
        goalID: goalID,
        startDate: startDate,
        endDate: endDate,
    });
}

export function joinUsertoEvent(uid, eventID){
    let doc_name = uid + "_" + eventID;
    setDoc(doc(db, "users_events_join", doc_name), {
        userID: uid,
        eventID: eventID,
    });
}

export function joinSquadtoGoal(squadID, goalID, startDate, endDate){
    let doc_name = squadID + "_" + goalID;
    setDoc(doc(db, "squad_goals_join", doc_name), {
        squadID: squadID,
        goalID: goalID,
        startDate: startDate,
        endDate: endDate,
    });
}

export function joinSquadtoEvent(squadID, eventID){
    let doc_name = squadID + "_" + eventID;
    setDoc(doc(db, "squad_events_join", doc_name), {
        squadID: squadID,
        eventID: eventID,
    });
}

/* 
Fetch Functions - To fetch data from existing documents inside the database,
these are used to retrieve data about specific users, squads, etc.    
*/

export function fetchUserEvents(uid) {
    // not implemented yet
    return 0   
}