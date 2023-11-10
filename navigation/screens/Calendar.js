import * as React from 'react';
import { View, Text } from 'react-native';

export default function Calendar({navigation}) {
    return(
        <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '303841'}}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}> Calendar </Text>
        </View>
    );
}