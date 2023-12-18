import { collection, addDoc, setDoc, doc, Timestamp, query, where, getDocs, getDoc, documentId, collectionGroup, deleteDoc } from "firebase/firestore";
import { db } from './firebaseConfig';
import * as Crypto from 'expo-crypto';

/* 
Add Functions - To create new documents inside the database,
these are all used with parameters      
*/

export function addUser(uid, username, profilePicURL) {
    if (profilePicURL === undefined) {
        profilePicURL = null;
    }

    setDoc(doc(db, "users", uid), {
        name: username,
        profilePic: profilePicURL,
    });
}


export async function addSquad(squadname) {
    const docRef = await addDoc(collection(db, "squads"), {
        name: squadname
    });
    return docRef.id;
}

// returns newly-created goal's id
export async function addGoal(goalname, current, target, iconName) {

    const docRef = await addDoc(collection(db, "goals"), {
        name: goalname,
        current: current,
        target: target,
        icon: iconName, 
    });
    return docRef.id;
}

export async function deleteUserGoal(userId, goalId) {
    try {
        // Delete the goal document
        const goalDocRef = doc(db, 'goals', goalId);
        await deleteDoc(goalDocRef);

        // Remove the goal ID from the user's goals list
        const doc_name = userId + "_" + goalId;
        const userGoalsDocRef = doc(db, 'users_goals_join', doc_name);
        
        // Delete the document with the specified title
        await deleteDoc(userGoalsDocRef);
    } catch (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
};


export async function deleteSquadGoal(squadId, goalId) {
    try {
        // Delete the goal document
        const goalDocRef = doc(db, 'goals', goalId);
        await deleteDoc(goalDocRef);

        // Remove the goal ID from the user's goals list
        const doc_name = squadId + "_" + goalId;
        const userGoalsDocRef = doc(db, 'squad_goals_join', doc_name);
        
        // Delete the document with the specified title
        await deleteDoc(userGoalsDocRef);
    } catch (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
};


export const updateGoalCurrentValue = async (goalId, newValue) => {
    try {
        const goalDocRef = doc(db, 'goals', goalId);
        await setDoc(goalDocRef, { current: newValue }, { merge: true });
    } catch (error) {
        console.error('Error updating goal current value:', error);
        throw error;
    }
};

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

export function joinUsertoSquad(uid, squadID) {
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
export function joinUsertoGoal(uid, goalID) {
    let doc_name = uid + "_" + goalID;
    setDoc(doc(db, "users_goals_join", doc_name), {
        userID: uid,
        goalID: goalID,
    });
}

export async function joinUsertoEvent(uid, eventID) {
    let doc_name = uid + "_" + eventID;

    // Get a reference to the document
    const docRef = doc(db, "users_events_join", doc_name);

    // Get the document
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
        // If the document exists, return a string indicating that the event already exists
        console.log("User has already joined this event")
        return 1;
    } else {
        // If the document does not exist, add the event
        await setDoc(doc(db, "users_events_join", doc_name), {
            userID: uid,
            eventID: eventID,
        });
        return 0;
    }
}

export function joinSquadtoGoal(squadID, goalID) {
    let doc_name = squadID + "_" + goalID;
    setDoc(doc(db, "squad_goals_join", doc_name), {
        squadID: squadID,
        goalID: goalID,
    });
}

export function joinSquadtoEvent(squadID, eventID) {
    let doc_name = squadID + "_" + eventID;
    setDoc(doc(db, "squad_events_join", doc_name), {
        squadID: squadID,
        eventID: eventID,
    });
}

export async function addStats(uid, statText) {
    const docRef = await addDoc(collection(db, "stats"), {
        userID: uid,
        text: statText,
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

export async function fetchUser(uid) {
    const name = [];
    const profilePic = []; 
    const userRef = collection(db, "users");
    const q = query(userRef, where(documentId(), "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        name.push(doc.data().name);
        profilePic.push(doc.data().profilePic); 
    })
    return { name: name[0], profilePic: profilePic[0] }; 
}

export async function fetchUserStats(uid) {
    const statsList = [];
    
    try {
        const statsRef = collection(db, "stats");
        const q = query(statsRef, where("userID", "==", uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            statsList.push(doc.data().text);
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        // Handle the error as needed
        throw error;
    }

    return statsList;
}

export async function deleteStat(userId, statContent) {
    try {
        const statsRef = collection(db, "stats");
        console.log(statContent)
        const q = query(statsRef, where("text", "==", statContent), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length === 0) {
            console.log('Stat not found.');
            return; 
        }

        // Assuming there's only one stat with the given content for a specific user
        const statDoc = querySnapshot.docs[0];
        await deleteDoc(statDoc.ref);
        
        console.log(`Stat with content "${statContent}" deleted successfully.`);
    } catch (error) {
        console.error('Error deleting stat:', error);
        // Handle the error as needed
        throw error;
    }
}

// This one looks at events
export async function fetchUserEvents(uid) {
    const eventID_list = []
    const eventList = []
    const userEventsRef = collection(db, "users_events_join");
    const q = query(userEventsRef, where("userID", "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        eventID_list.push(doc.data().eventID)
    })

    const EventsRef = collection(db, "events");
    for (i = 0; i < eventID_list.length; i++) {
        const q2 = query(EventsRef, where(documentId(), "==", eventID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            doc.id, " => ", doc.data();
            eventList.push(doc.data());
        })
    }

    return eventList;
}

// This one looks at events for main screen (date time needed)
export async function fetchUserEventsforMainScreen(uid) {
    const eventID_list = []
    const eventList = []
    const userEventsRef = collection(db, "users_events_join");
    const q = query(userEventsRef, where("userID", "==", uid));
 
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        eventID_list.push(doc.data().eventID)
    })
 
    const EventsRef = collection(db, "events");
    for (let i = 0; i < eventID_list.length; i++) {
        const q2 = query(EventsRef, where(documentId(), "==", eventID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            // Convert Firestore Timestamp to JavaScript Date
            const DateTime = doc.data().DateTime.toDate();
            // Include DateTime in the data
            eventList.push({
                ...doc.data(),
                DateTime: DateTime
            });
        })
    }
 
    return eventList;
 }

// This one looks at drop in events
export async function fetchUserDropInEvents(uid) {
    const eventID_list = []
    const eventList = []
    const userEventsRef = collection(db, "users_events_join");
    const q = query(userEventsRef, where("userID", "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        eventID_list.push(doc.data().eventID)
    })

    const EventsRef = collection(db, "Drop_In_Events");
    for (i = 0; i < eventID_list.length; i++) {
        const q2 = query(EventsRef, where(documentId(), "==", eventID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            const data = doc.data();
            const event = {
                title: data.date,
                activityName: `${data.name}: ${data.location}`,
                time: data.time,
                id: eventID_list[i],
            };
            eventList.push(event);
        })
    }

    return eventList;
}

export async function fetchDropInEvents() {
    let eventsMap = [];

    const eventsSnapshot = await getDocs(collectionGroup(db, 'Drop_In_Events'));
    eventsSnapshot.forEach((doc) => {
        const data = doc.data();
        const event = {
            title: data.date,
            activityName: `${data.name}: ${data.location}`,
            time: data.time,
            id: doc.id,
        };
        eventsMap.push(event);
    });

    return eventsMap;
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
        goalID_list.push(doc.data().goalID)
    })

    const GoalsRef = collection(db, "goals");
    for (i = 0; i < goalID_list.length; i++) {
        const q2 = query(GoalsRef, where(documentId(), "==", goalID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            goalList.push(doc.data());
        })
    }

    return [goalList, goalID_list];
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
        eventID_list.push(doc.data().eventID)
    })

    const EventsRef = collection(db, "events");
    for (i = 0; i < eventID_list.length; i++) {
        const q2 = query(EventsRef, where(documentId(), "==", eventID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            doc.id, " => ", doc.data();
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
        goalID_list.push(doc.data().goalID)
    })

    const GoalsRef = collection(db, "goals");
    for (i = 0; i < goalID_list.length; i++) {
        const q2 = query(GoalsRef, where(documentId(), "==", goalID_list[i]));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            goalList.push(doc.data());
        })
    }

    return [goalList, goalID_list];
}

export async function fetchSquadName(squadID) {
    const squadNamesRef = collection(db, "squads");
    const q = query(squadNamesRef, where(documentId(), "==", squadID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().name;
    }
    else {
        // console.error("Squad with ID ${squadID} does not exist");
        return null;
    }
}

export async function fetchSquadsForUser(uid) {
    const squadList = [];
    const userSquadsRef = collection(db, "users_squads_join");
    const userSquadsQuery = query(userSquadsRef, where("userID", "==", uid));
    const querySnapshot = await getDocs(userSquadsQuery);
    for (const doc of querySnapshot.docs) {
        const squadID = doc.data().squadID;
        const squadName = await fetchSquadName(squadID);
        if (squadName !== null) {
            const squadInfo = {
                squadID: squadID,
                squadName: squadName
            };
            squadList.push(squadInfo);
        }
    };
    return squadList;
}

/*
    Test functions:
    useEffect(async () => {
    const goalid = await addGoal('Increase Squat PR by 5lbs.', 150, 155);
    joinUsertoGoal('JSVhKJSFRaeictUBPlcLJ7nczHb2', goalid, Timestamp.fromDate(new Date("2023-03-25")), Timestamp.fromDate(new Date("2023-03-29")));
    fetchUserGoals('JSVhKJSFRaeictUBPlcLJ7nczHb2');
  }, []);
*/

