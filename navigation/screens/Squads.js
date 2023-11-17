import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { DataTable } from 'react-native-paper';
import { addEvent } from '../../Database';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Timestamp } from 'firebase/firestore';

const tableDataSample = {
    tableHead: [ '', 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
    widthArr: [80, 70, 70, 70, 70, 70, 70, 70 ],
    tableData: [['Ryan', 'Gym', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Jay', 'Gym', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Waleed', 'Rest', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Karan', 'Rest', 'Rest', 'Rest', 'Rest', 'Gym', 'Rest', 'Rest'],
    ['Ishaan', 'Rest', 'Rest', 'Rest', 'Rest', 'Gym', 'Rest', 'Rest'],
    ]
};

export default function Squads({ navigation }) {
    const [data, setData] = React.useState(tableDataSample);
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Weekly Activity </Text>
            <ScrollView horizontal={true}>
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
            <Text style={styles.bottom}>Group Milestones </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 20,
    },
    container: { flex: 1, padding: 16, paddingTop: 80, backgroundColor: '#303841' },
    rowSection: { height: 40, backgroundColor: '#303841' },
    head: { height: 44, backgroundColor: '#303841' },
    headText: { fontSize: 16, fontWeight: 'bold' , textAlign: 'center', color: 'white', fontFamily: 'Helvetica Neue' },
    text: { margin: 6, fontSize: 16, fontWeight: 'bold' , textAlign: 'center', color: 'white', fontFamily: 'Helvetica Neue' },
    bottom: {
        flex: 12,
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 10,
    },
});