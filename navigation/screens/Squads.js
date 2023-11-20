import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Table, Row } from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';
import { addEvent, fetchSquadEvents, fetchSquadName, fetchSquadsForUser, fetchUserEvents, joinSquadtoEvent, joinUsertoEvent, fetchUser, addSquad, joinUsertoSquad } from '../../Database';
import * as Clipboard from 'expo-clipboard';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

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

export default function Squads() {
    const [data, setData] = React.useState(tableDataSample);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [squadList, setSquadList] = React.useState([]);
    const [openSquadList, setOpenSquadList] = React.useState(false);
    const [valueSquadList, setValueSquadList] = React.useState([]);
    const [activeSquad, setActiveSquad] = React.useState('Squad'); // This is the squad for which all info will be rendered 
    const [activeSquadID, setActiveSquadID] = React.useState(''); 
    const userID = "JSVhKJSFRaeictUBPlcLJ7nczHb2"; // Placeholder for userID
    const [createSquadModalVisible, setCreateSquadModalVisible] = useState(false);
    const [joinSquadModalVisible, setJoinSquadModalVisible] = useState(false);
    const [newSquadName, setNewSquadName] = useState('');
    const [joiningSquad, setJoiningSquad] = useState('');

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
            joinUsertoSquad(userID, squadID);

            const newSquadList = [...squadList];
            newSquadList.push({ squadID: squadID, squadName: newSquadName });
            setSquadList(newSquadList);

            setNewSquadName('');
        } catch (error) {
            console.error('Error adding squad to database: ', error);
        }
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
                    joinUsertoSquad(userID, joiningSquad);
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
                        <Text style={styles.modalHeaderText}>Create a new Squad</Text>
                        <TextInput
                                style={styles.roundedInput}
                                onChangeText={setNewSquadName}
                                value={newSquadName}
                                placeholder='Enter the name of your new squad'
                                placeholderTextColor='rgba(0, 0, 0, 0.3)'
                        />
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonClose]}
                            onPress={() => {
                                handleCreateNewSquad();
                                setCreateSquadModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalSubmit}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonClose]}
                            onPress={() => setCreateSquadModalVisible(false)}
                        >
                            <Text style={styles.modalSubmit}>Close</Text>
                        </TouchableOpacity>
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
                        <Text style={styles.modalHeaderText}>Join an existing Squad</Text>
                        <TextInput
                                style={styles.roundedInput}
                                onChangeText={setJoiningSquad}
                                value={joiningSquad}
                                placeholder='Enter the ID of the squad you want to join'
                                placeholderTextColor='rgba(0, 0, 0, 0.3)'
                        />
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonClose]}
                            onPress={() => {
                                handleJoinNewSquad();
                                setJoinSquadModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalSubmit}>Join</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonClose]}
                            onPress={() => setJoinSquadModalVisible(false)}
                        >
                            <Text style={styles.modalSubmit}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    React.useEffect(() => {
        const fetchUserSquads = async () => {
            try {
                const userSquads = await fetchSquadsForUser(userID);
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
                    <Text style = {styles.shareCaption}>Share this ID with your friends to add them to your squad!</Text>

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
                        <TouchableOpacity style={styles.circle_button}>
                            <AnimatedCircularProgress
                                size={80}
                                width={6}
                                fill={20} // Update this value based on your progress
                                tintColor="#00B127"
                                backgroundColor="#3d5875"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circle_button}>
                            <AnimatedCircularProgress
                                size={80}
                                width={6}
                                fill={50}
                                tintColor="#00B127"
                                backgroundColor="#3d5875"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circle_button}>
                            <AnimatedCircularProgress
                                size={80}
                                width={6}
                                fill={75}
                                tintColor="#00B127"
                                backgroundColor="#3d5875"
                            />
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'space-between', // You can use 'space-around', 'space-evenly', or other justifying options
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
        padding: 35,
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
        modalButton: {
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            backgroundColor: '#2196F3',
            width: '50%',
            alignSelf: 'center',
            marginBottom: 5,
            marginTop: 25
        },
        modalButtonClose: {
            backgroundColor: '#2196F3',
        },
        modalTextContainer: {
            marginBottom: 15,
            alignItems: 'center',
        },
        modalText: {
            textAlign: 'center',
        },
        modalHeaderText: {
            fontWeight: 'bold',
            fontSize: 20, 
            color: '#2196F3',
        },
        roundedInput: {
            height: 40,
            margin: 12,
            marginTop: 10,
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
        modalSubmit: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 18
        }
});