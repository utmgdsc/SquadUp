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

// returns newly-created goal's id
export async function addGoal(goalname, current, target) {
    const docRef = await addDoc(collection(db, "goals"), {
        name: goalname,
        current: current,
        target: target
    });
    console.log(docRef.id)
    return docRef.id;
}

// type can only have two values: Sports or Workout
// DateTime must be a Timestamp object
// Example for Dec25, 2023: addEvent("Drop-in Boxing", "Sports", Timestamp.fromDate(new Date("2023-03-25")));
export async function addEvent(eventname, type, DateTime) {
    const docRef = await addDoc(collection(db, "events"), {
        name: eventname,
        type: type,
        DateTime: DateTime
    });
    return docRef.id;
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

/* given uid (user id), returns a list of goals with the format - 
    [
        {"completed": false, "current": 0, "name": "Run 10km this week.", "target": 10}, 
        {"current": 150, "name": "Increase Squat PR by 5lbs.", "target": 155},
        ... ,
    ]
*/
export async function fetchUserGoals(uid) {
    const goalID_list = []
    const goalList = []

    const userGoalsRef = collection(db, "users_goals_join");
    const q = query(userGoalsRef, where("userID", "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data().eventID);
        goalID_list.push(doc.data().goalID)
    })

    const GoalsRef = collection(db, "goals");
    for(i = 0; i < goalID_list.length; i++){
        const q2 = query(GoalsRef, where(documentId(), "==", goalID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            goalList.push(doc.data());
        })
    }
    
    return goalList;
}

/* given squadID, returns a list of events with the format - 
    [
        {"DateTime": {"nanoseconds": 0, "seconds": 1700006400}, "name": "TestEvent", "type": "TestType "}, 
        {"DateTime": {"nanoseconds": 605000000, "seconds": 1699459200}, "name": "Basketball", "type": "Sports"},
        ... ,
    ]
*/
export async function fetchSquadEvents(squadID) {
    const eventID_list = []
    const eventList = []

    const squadEventsRef = collection(db, "squad_events_join");
    const q = query(squadEventsRef, where("squadID", "==", squadID));

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

/* given squadID, returns a list of goals with the format - 
    [
        {"completed": false, "current": 0, "name": "Run 10km this week.", "target": 10}, 
        {"current": 150, "name": "Increase Squat PR by 5lbs.", "target": 155},
        ... ,
    ]
*/
export async function fetchSquadGoals(squadID) {
    const goalID_list = []
    const goalList = []

    const squadGoalsRef = collection(db, "squad_goals_join");
    const q = query(squadGoalsRef, where("squadID", "==", squadID));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data().eventID);
        goalID_list.push(doc.data().goalID)
    })

    const GoalsRef = collection(db, "goals");
    for(i = 0; i < goalID_list.length; i++){
        const q2 = query(GoalsRef, where(documentId(), "==", goalID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            goalList.push(doc.data());
        })
    }
    
    return goalList;
}




/*
    Test functions:
    useEffect(async () => {
    const goalid = await addGoal('Increase Squat PR by 5lbs.', 150, 155);
    joinUsertoGoal('JSVhKJSFRaeictUBPlcLJ7nczHb2', goalid, Timestamp.fromDate(new Date("2023-03-25")), Timestamp.fromDate(new Date("2023-03-29")));
    fetchUserGoals('JSVhKJSFRaeictUBPlcLJ7nczHb2');
  }, []);
*/

