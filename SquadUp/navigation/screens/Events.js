import * as React from 'react';
import { View, Text } from 'react-native';

export default function Events({navigation}) {
    return(
        <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}> Events </Text>
        </View>
    );
}