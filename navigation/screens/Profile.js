import * as React from 'react';
import { View, Text } from 'react-native';

export default function Profile({navigation}) {
    return(
        <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: "#303841" }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}> Profile </Text>
        </View>
    );
}