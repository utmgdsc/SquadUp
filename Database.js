import { collection, addDoc, setDoc, doc, Timestamp, query, where, getDocs, getDoc, documentId } from "firebase/firestore";
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

/* given uid (user id), returns a list of events with the format - 
    [
        {"DateTime": {"nanoseconds": 0, "seconds": 1700006400}, "name": "TestEvent", "type": "TestType "}, 
        {"DateTime": {"nanoseconds": 605000000, "seconds": 1699459200}, "name": "Basketball", "type": "Sports"},
        ... ,
    ]
*/
export async function fetchUserEvents(uid) {
    const eventID_list = []
    const eventList = []

    const userEventsRef = collection(db, "users_events_join");
    const q = query(userEventsRef, where("userID", "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data().eventID);
        eventID_list.push(doc.data().eventID)
    })

    const EventsRef = collection(db, "events");
    for(i = 0; i < eventID_list.length; i++){
        const q2 = query(EventsRef, where(documentId(), "==", eventID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            eventList.push(doc.data());
        })
    }
    
    return eventList;

}

/*
    Test functions (put in App.js to test for now):
    joinUsertoEvent('JSVhKJSFRaeictUBPlcLJ7nczHb2', 'NjmmGri0YDY1hWbKP3Ry');
    joinUsertoEvent('JSVhKJSFRaeictUBPlcLJ7nczHb2', 'zeiqc0ARW0DZqKtAsQLY');
    fetchUserEvents('JSVhKJSFRaeictUBPlcLJ7nczHb2');
*/

