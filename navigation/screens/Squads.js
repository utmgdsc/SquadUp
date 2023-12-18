import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Table, Row } from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';
import { addEvent, fetchSquadEvents, fetchSquadName, fetchSquadsForUser, fetchUserEvents, joinSquadtoEvent, joinUsertoEvent, fetchSquadGoals, addSquad, joinUsertoSquad, updateGoalCurrentValue, joinSquadtoGoal, addGoal, deleteSquadGoal } from '../../Database';
import * as Clipboard from 'expo-clipboard';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import CustomIconPickerModal from '../components/CustomIconPickerModal';
import CustomGoalUpdateModal from '../components/CustomGoalUpdateModal';
import { Ionicons } from '@expo/vector-icons';

const tableDataSample = {
    tableHead: ['', 'S', 'M', 'T', 'W', 'T', 'F', 'S'],
    widthArr: [80, 70, 70, 70, 70, 70, 70, 70],
    tableData: [['Ryan', 'Gym', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Jay', 'Gym', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Waleed', 'Rest', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Karan', 'Rest', 'Rest', 'Rest', 'Rest', 'Gym', 'Rest', 'Rest'],
    ['Ishaan', 'Rest', 'Rest', 'Rest', 'Rest', 'Gym', 'Rest', 'Rest'],
    ]
};

export default function Squads({ userId }) {
    const [data, setData] = React.useState(tableDataSample);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [goalVisible, setgoalVisible] = useState(false);
    const [goalVisible2, setgoalVisible2] = useState(false);
    const [goalVisible3, setgoalVisible3] = useState(false);
    const [selectedIcon1, setSelectedIcon1] = useState('add'); // Set a default icon
    const [selectedIcon2, setSelectedIcon2] = useState('add'); // Set a default icon
    const [selectedIcon3, setSelectedIcon3] = useState('add'); // Set a default icon
    const [goalIdList, setGoalIdList] = useState([]);
    const [goalNameList, setGoalNameList] = useState([]);
    const [currentNumberList, setCurrentNumberList] = useState([]);
    const [targetNumberList, setTargetNumberList] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [squadList, setSquadList] = React.useState([]);
    const [openSquadList, setOpenSquadList] = React.useState(false);
    const [valueSquadList, setValueSquadList] = React.useState([]);
    const [activeSquad, setActiveSquad] = React.useState('Squad'); // This is the squad for which all info will be rendered 
    const [activeSquadID, setActiveSquadID] = React.useState('');
    const [createSquadModalVisible, setCreateSquadModalVisible] = useState(false);
    const [joinSquadModalVisible, setJoinSquadModalVisible] = useState(false);
    const [newSquadName, setNewSquadName] = useState('');
    const [joiningSquad, setJoiningSquad] = useState('');

    useEffect(() => {
        loadSquadGoals();
    }, [activeSquadID]);

    const addNewGoal = async (iconName, goalName, currentNumber, targetNumber, index) => {
        try {
            // Add the goal and obtain the goalId
            const goalId = await addGoal(goalName, currentNumber, targetNumber, iconName);

            // Set the goalId in the state
            setGoalIdList((prevGoalIds) => {
                const updatedGoalIds = [...prevGoalIds];
                updatedGoalIds[index] = goalId;
                return updatedGoalIds;
            });

            // Join user to the goal
            joinSquadtoGoal(activeSquadID, goalId);

        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    const loadSquadGoals = async () => {
        try {
            const userGoals = await fetchSquadGoals(activeSquadID);
            const goalList = userGoals[0];
            const goalIdList = userGoals[1];
    
            setGoalIdList(goalIdList);
    
            let updatedGoalNameList = [];
            let updatedCurrentNumberList = [];
            let updatedTargetNumberList = [];
            let updatedIcons = [null, null, null]; 
    
            goalList.forEach((goal, index) => {
                const { current, icon, name, target } = goal;
 
                if (index === 0) {
                    updatedIcons[0] = icon;
                } else if (index === 1) {
                    updatedIcons[1] = icon;
                } else if (index === 2) {
                    updatedIcons[2] = icon;
                }
    
                updatedGoalNameList.push(name);
                updatedCurrentNumberList.push(current);
                updatedTargetNumberList.push(target);
            });
                const defaultIcon = 'add';
            if (goalList.length === 0) {
                updatedIcons[0] = defaultIcon;
                updatedIcons[1] = defaultIcon;
                updatedIcons[2] = defaultIcon;
            } 
            else if (goalList.length === 1) {
                updatedIcons[1] = defaultIcon;
                updatedIcons[2] = defaultIcon;
            } else if (goalList.length === 2) {
                updatedIcons[2] = defaultIcon;
            } 
    
            setGoalNameList(updatedGoalNameList);
            setCurrentNumberList(updatedCurrentNumberList);
            setTargetNumberList(updatedTargetNumberList);
    
            setSelectedIcon1(updatedIcons[0]);
            setSelectedIcon2(updatedIcons[1]);
            setSelectedIcon3(updatedIcons[2]);
    
        } catch (error) {
            console.error('Error loading user goals:', error);
        }
    };

    const resetGoal = async (goalId, goalIndex) => {
        try {
            await deleteSquadGoal(userId, goalId);

            setGoalIdList((prevGoalIds) => {
                const updatedGoalIds = [...prevGoalIds];
                updatedGoalIds[goalIndex] = null;
                return updatedGoalIds;
            });
        } catch (error) {
            console.error('Error resetting goal:', error);
            throw error;
        }
    };

    const checkAndResetGoal = async (goalId, currentNumber, targetNumber, defaultIcon, goalIndex) => {
        if (currentNumber >= targetNumber) {
            alert('Congratulations! You have reached your goal!');
            if (goalIndex == 0) {
                setSelectedIcon1(defaultIcon);
                setCurrentNumberList(currentNumberList => [0, currentNumberList[1], currentNumberList[2]]);
                setTargetNumberList(targetNumberList => [0, targetNumberList[1], targetNumberList[2]]);
            }
            else if (goalIndex == 1) {
                setSelectedIcon2(defaultIcon);
                setCurrentNumberList(currentNumberList => [currentNumberList[0], 0, currentNumberList[2]]);
                setTargetNumberList(targetNumberList => [targetNumberList[0], 0, targetNumberList[2]]);
            }

            else if (goalIndex == 2) {
                setSelectedIcon3(defaultIcon);
                setCurrentNumberList(currentNumberList => [currentNumberList[0], currentNumberList[1], 0]);
                setTargetNumberList(targetNumberList => [targetNumberList[0], targetNumberList[1], 0]);
            }

            await resetGoal(goalId, goalIndex);
        }
    };

    const handleIconSelect = (iconName, num, goalName, Curr, Target) => {
        if (num == 1) {
            setGoalNameList(goalNameList => [goalName, goalNameList[1], goalNameList[2]]);
            setCurrentNumberList(currentNumberList => [Curr, currentNumberList[1], currentNumberList[2]]);
            setTargetNumberList(targetNumberList => [Target, targetNumberList[1], targetNumberList[2]]);
            setSelectedIcon1(iconName);
        }
        if (num == 2) {
            setGoalNameList(goalNameList => [goalNameList[0], goalName, goalNameList[2]]);
            setCurrentNumberList(currentNumberList => [currentNumberList[0], Curr, currentNumberList[2]]);
            setTargetNumberList(targetNumberList => [targetNumberList[0], Target, targetNumberList[2]]);
            setSelectedIcon2(iconName);
        }
        if (num == 3) {
            setGoalNameList(goalNameList => [goalNameList[0], goalNameList[1], goalName]);
            setCurrentNumberList(currentNumberList => [currentNumberList[0], currentNumberList[1], Curr]);
            setTargetNumberList(targetNumberList => [targetNumberList[0], targetNumberList[1], Target]);
            setSelectedIcon3(iconName);
        }
    };

    const updateCurrVal = (Curr, num) => {
        if (num == 1) {
            setCurrentNumberList(currentNumberList => [Curr, currentNumberList[1], currentNumberList[2]]);
            updateGoalCurrentValue(goalIdList[0], Curr);
            checkAndResetGoal(goalIdList[num - 1], Curr, targetNumberList[num - 1], 'add', num - 1);
        }
        if (num == 2) {
            setCurrentNumberList(currentNumberList => [currentNumberList[0], Curr, currentNumberList[2]]);
            updateGoalCurrentValue(goalIdList[1], Curr);
            checkAndResetGoal(goalIdList[num - 1], Curr, targetNumberList[num - 1], 'add', num - 1);
        }
        if (num == 3) {
            setCurrentNumberList(currentNumberList => [currentNumberList[0], currentNumberList[1], Curr]);
            updateGoalCurrentValue(goalIdList[2], Curr);
            checkAndResetGoal(goalIdList[num - 1], Curr, targetNumberList[num - 1], 'add', num - 1);
        }
    };

    const computefill = (num) => {
        const currentNumber = currentNumberList[num - 1];
        const targetNumber = targetNumberList[num - 1];
        if (typeof currentNumber !== 'number' || typeof targetNumber !== 'number' || targetNumber === 0) {
            return 0;
        }

        const fillValue = (currentNumber / targetNumber) * 100;
        return Math.min(Math.max(fillValue, 0), 100);
    };

    const handleAddNewSquad = () => {
        // Logic for adding a new squad
        // This is where you would add a new item to your list or perform any other necessary action
        setCreateSquadModalVisible(true);
    };

    const handleJoinExistingSquad = () => {
        // Logic for joining an existing squad
        // This is where you would implement the logic for joining an existing squad
        setJoinSquadModalVisible(true);
    };

    const handleCopySquadID = async () => {
        try {
            await Clipboard.setStringAsync(activeSquadID);
            Toast.show('SquadID copied!', {
                duration: Toast.durations.SHORT,
                position: 170,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0
            });
        } catch (error) {
            console.error('Error copying SquadID to clipboard: ', error);
        }
    };

    const handleCreateNewSquad = async () => {
        try {
            const squadID = await addSquad(newSquadName);
            // console.log("THis is the squad ID: ", squadID);
            Alert.alert('Success! ', 'Squad created!');
            joinUsertoSquad(userId, squadID);

            const newSquadList = [...squadList];
            newSquadList.push({ squadID: squadID, squadName: newSquadName });
            setSquadList(newSquadList);

            setNewSquadName('');
        } catch (error) {
            console.error('Error adding squad to database: ', error);
        }
    };
    const toggleModal = () => {
        //setting up a goal
        if (selectedIcon1 == 'add') {
            setModalVisible(!modalVisible);
        } else { //updating
            setgoalVisible(!goalVisible);
        }
    };
    const closeModal = () => {
        setModalVisible(false);
        setgoalVisible(false);
    };

    const toggleModal2 = () => {
        //setting up a goal
        if (selectedIcon2 == 'add') {

            setModalVisible2(!modalVisible2);
        } else { //updating
            setgoalVisible2(!goalVisible2);
        }
    };
    const closeModal2 = () => {
        setModalVisible2(false);
        setgoalVisible2(false);
    };

    const toggleModal3 = () => {
        //setting up a goal
        if (selectedIcon3 == 'add') {
            setModalVisible3(!modalVisible3);
        } else { //updating
            setgoalVisible3(!goalVisible3);
        }
    };
    const closeModal3 = () => {
        setModalVisible3(false);
        setgoalVisible3(false);
    };

    const handleJoinNewSquad = async () => {
        try {
            const alreadyIn = squadList.some(squad => squad.squadID === joiningSquad);
            if (alreadyIn) {
                Alert.alert('Failure!', 'You are already in this squad!');
            } else {
                const potentialSquad = await fetchSquadName(joiningSquad);
                if (potentialSquad === null) {
                    Alert.alert('Failure! ', 'SquadID is invalid!');
                } else {
                    joinUsertoSquad(userId, joiningSquad);
                    Alert.alert('Success! ', 'Squad joined!');

                    const newSquadList = [...squadList];
                    newSquadList.push({ squadID: joiningSquad, squadName: potentialSquad });
                    setSquadList(newSquadList);

                    setJoiningSquad('');
                }
            }
        } catch (error) {
            console.error('Error joining new squad: ', error);
        }
    };

    const createSquadModal = () => {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={createSquadModalVisible}
                onRequestClose={() => setAddSquadModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Create a new Squad</Text>
                        <TextInput
                            style={styles.roundedInput}
                            onChangeText={setNewSquadName}
                            value={newSquadName}
                            placeholder='Enter the name of your new squad'
                            placeholderTextColor='rgba(0, 0, 0, 0.3)'
                        />
                        <View style={styles.iconRow}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    handleCreateNewSquad();
                                    setCreateSquadModalVisible(false);
                                }}
                            >
                                <Text style={styles.textStyle}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setCreateSquadModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    const joinSquadModal = () => {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={joinSquadModalVisible}
                onRequestClose={() => setJoinSquadModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Join an existing Squad</Text>
                        <TextInput
                            style={styles.roundedInput}
                            onChangeText={setJoiningSquad}
                            value={joiningSquad}
                            placeholder='Enter the ID of the squad you want to join'
                            placeholderTextColor='rgba(0, 0, 0, 0.3)'
                        />
                        <View style={styles.iconRow}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    handleJoinNewSquad();
                                    setJoinSquadModalVisible(false);
                                }}
                            >
                                <Text style={styles.textStyle}>Join</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setJoinSquadModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    React.useEffect(() => {
        const fetchUserSquads = async () => {
            try {
                const userSquads = await fetchSquadsForUser(userId);
                setSquadList(userSquads);
            } catch (error) {
                console.error("Error fetching user's squads: ", error);
            }
        }
        fetchUserSquads();
    }, []);

    return (
        <RootSiblingParent>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    {/* Drop-down section */}
                    <View style={styles.dropdownContainer}>
                        <DropDownPicker
                            open={openSquadList}
                            value={valueSquadList}
                            setOpen={setOpenSquadList}
                            setValue={setValueSquadList}
                            items={squadList.map(squad => ({
                                label: squad.squadName,
                                value: squad.squadID,
                            }))}
                            // setItems={setItems}
                            containerStyle={{ height: 50 }}
                            style={styles.picker}
                            dropDownStyle={{ backgroundColor: '#EEEEEE' }}
                            labelStyle={{
                                fontWeight: "bold",
                                textAlign: 'center', // Center-align the label text
                                fontSize: 30,
                            }}
                            textStyle={{
                                fontSize: 20,
                                fontFamily: 'Helvetica Neue',
                            }}
                            placeholder='Select a Squad'
                            onSelectItem={(item) => {
                                setActiveSquad(item.label);
                                setActiveSquadID(item.value);
                            }}
                        />
                    </View>

                    {/* SquadID copy text */}
                    <View style={styles.squadIDContainer}>
                        <Text style={styles.squadIDText}>
                            Squad ID: {activeSquadID}
                        </Text>
                        <TouchableOpacity onPress={handleCopySquadID} style={styles.copyButton}>
                            <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.shareCaption}>Share this ID with your friends to add them to your squad!</Text>

                    <Text style={styles.title}> {activeSquad} Weekly Activity </Text>
                    <ScrollView horizontal={true} style={styles.tableContainer}>
                        <View>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#00ADB5' }}>
                                <Row
                                    data={data.tableHead}
                                    widthArr={data.widthArr}
                                    style={styles.head}
                                    textStyle={styles.headText}
                                />
                            </Table>
                            <ScrollView>
                                <Table borderStyle={{ borderWidth: 1, borderColor: '#00ADB5' }}>
                                    {data.tableData.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={data.widthArr}
                                            style={styles.rowSection}
                                            textStyle={styles.text}
                                        />
                                    ))}
                                </Table>
                            </ScrollView>
                        </View>
                    </ScrollView>
                    <Text style={styles.bottom}>{activeSquad}'s Milestones </Text>
                    <View style={styles.horizontalContainer}>
                        <TouchableOpacity style={styles.button1} onPress={toggleModal}>
                            <Ionicons name={selectedIcon1} style={styles.icon} size={50} />
                            <AnimatedCircularProgress
                                size={80}
                                width={6}
                                fill={computefill(1)}
                                tintColor="#00B127"
                                backgroundColor="#3d5875"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button1} onPress={toggleModal2}>
                            <Ionicons name={selectedIcon2} style={styles.icon} size={50} />
                            <AnimatedCircularProgress
                                size={80}
                                width={6}
                                fill={computefill(2)}
                                tintColor="#00B127"
                                backgroundColor="#3d5875"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button1} onPress={toggleModal3}>
                            <Ionicons name={selectedIcon3} style={styles.icon} size={50} />
                            <AnimatedCircularProgress
                                size={80}
                                width={6}
                                fill={computefill(3)}
                                tintColor="#00B127"
                                backgroundColor="#3d5875"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Add button 1 */}
                    <CustomIconPickerModal
                        isVisible={modalVisible}
                        onSelect={(iconName, goalName, Curr, Target) => {
                            handleIconSelect(iconName, 1, goalName, Curr, Target),
                                closeModal()
                            addNewGoal(iconName, goalName, Curr, Target, 0);
                        }}
                        onClose={closeModal}
                    />
                    {/* Add button 2 */}
                    <CustomIconPickerModal
                        isVisible={modalVisible2}
                        onSelect={(iconName, goalName, Curr, Target) => {
                            handleIconSelect(iconName, 2, goalName, Curr, Target),
                                closeModal2()
                            addNewGoal(iconName, goalName, Curr, Target, 1);
                        }}
                        onClose={closeModal2}
                    />
                    {/* Add button 3 */}
                    <CustomIconPickerModal
                        isVisible={modalVisible3}
                        onSelect={(iconName, goalName, Curr, Target) => {
                            handleIconSelect(iconName, 3, goalName, Curr, Target),
                                closeModal3()
                            addNewGoal(iconName, goalName, Curr, Target, 2);
                        }}
                        onClose={closeModal3}
                    />
                    {/* Goal Update 1 */}
                    <CustomGoalUpdateModal
                        isVisible={goalVisible}
                        onSelect={(Curr) => {
                            updateCurrVal(Curr, 1),
                                closeModal()
                        }}
                        onClose={closeModal}
                        goalInfo={[goalNameList[0], currentNumberList[0], targetNumberList[0]]}
                    />
                    {/* Goal Update 2 */}
                    <CustomGoalUpdateModal
                        isVisible={goalVisible2}
                        onSelect={(Curr) => {
                            updateCurrVal(Curr, 2),
                                closeModal2()
                        }}
                        onClose={closeModal2}
                        goalInfo={[goalNameList[1], currentNumberList[1], targetNumberList[1]]}
                    />
                    {/* Goal Update 3 */}
                    <CustomGoalUpdateModal
                        isVisible={goalVisible3}
                        onSelect={(Curr) => {
                            updateCurrVal(Curr, 3),
                                closeModal3()
                        }}
                        onClose={closeModal3}
                        goalInfo={[goalNameList[2], currentNumberList[2], targetNumberList[2]]}
                    />
                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAddNewSquad}>
                            <Text style={styles.buttonText}>Create New Squad</Text>
                        </TouchableOpacity>
                        {createSquadModal()}
                        <TouchableOpacity style={styles.button} onPress={handleJoinExistingSquad}>
                            <Text style={styles.buttonText}>Join Existing Squad</Text>
                        </TouchableOpacity>
                        {joinSquadModal()}
                    </View>
                </View>
            </ScrollView>
        </RootSiblingParent>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 27,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 20,
        paddingTop: 10
    },
    container: { paddingTop: 80, backgroundColor: '#303841' },
    dropdownContainer: {
        backgroundColor: '#EEEEEE', // Background color for the drop-down section
        padding: 5,
        borderRadius: 10, // Add rounded corners
        margin: 10, // Add margin to separate from other components
        zIndex: 1 // This puts the drop down in front of all other components
    },
    picker: {
        backgroundColor: '#EEEEEE', // Background color for the drop-down
        borderColor: '#EEEEEE', // Border color to match the container background
    },
    rowSection: { height: 40, backgroundColor: '#303841' },
    head: { height: 44, backgroundColor: '#303841' },
    headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white', fontFamily: 'Helvetica Neue' },
    text: { margin: 6, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white', fontFamily: 'Helvetica Neue' },
    tableContainer: {
        padding: 10,
        marginBottom: 12, // Adjust the marginBottom as needed
    },
    bottom: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 10,
    },
    circle_button: {
        backgroundColor: '#EEEEEE',
        width: 80,
        height: 80,
        borderRadius: 50,
        marginTop: "5%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // You can use 'space-around', 'space-evenly', or other justifying options
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 40,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#EEEEEE',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    button1: {
        backgroundColor: '#EEEEEE',
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    icon: {
        position: 'absolute',
        color: "#00ADB5",
        paddingLeft: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    squadIDContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#EEEEEE',
        borderRadius: 10,
        margin: 10,
    },
    squadIDText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'black'
    },
    copyButton: {
        backgroundColor: '#3498db',
        borderRadius: 5,
        padding: 5
    },
    copyButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },
    shareCaption: {
        fontSize: 10,
        fontStyle: 'italic',
        color: 'gray',
        marginTop: 0,
        marginHorizontal: 15,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#303841'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    roundedInput: {
        height: 40,
        margin: 12,
        marginBottom: 10,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
        fontWeight: "bold"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#303841',
        marginTop: 20,
        marginBottom: 10,
        width: '100%'
    },
    iconRow: {
        flexDirection: 'row',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    addButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#089000',
        width: '50%',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 25,
        marginRight: 20,
    },
    closeButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#8B0000',
        width: '30%',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 25,
    },
});