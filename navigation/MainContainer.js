import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import MainScreen from './screens/MainScreen';
import Profile from './screens/Profile';
import Squads from './screens/Squads';
import CalendarScreen from './screens/CalendarScreen';
import Events from './screens/Events';

// Screen names
const homeName = "Home";
const profileName = "Profile";
const squadsName = "Squad";
const calendarName = "Calendar";
const eventsName = "Events";

const Tab = createBottomTabNavigator();

export default function MainContainer(){
    return(
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({ focused, color, size}) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === homeName) {
                            iconName = focused ? 'home' : 'home-outline'
                        } else if (rn === profileName) {
                            iconName = focused ? 'person' : 'person-outline'
                        } else if (rn === squadsName) {
                            iconName = focused ? 'people' : 'people-outline'
                        } else if (rn === calendarName) {
                            iconName = focused ? 'calendar' : 'calendar-outline'
                        } else if (rn == eventsName) {
                            iconName = focused ? 'basketball' : 'basketball-outline'
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>

                    },
                    tabBarActiveBackgroundColor: '#00ADB5',
                    tabBarInactiveBackgroundColor: '#00ADB5',
                    tabBarActiveTintColor: '#EEEEEE',
                    tabBarInactiveTintColor: '#303841',
                    labelStyle: { paddingBottom: 5, fontSize: 10 },
                    style: {padding: 5, height: 60, backgroundColor: 'orange' }
                    
                })}
            >

                <Tab.Screen name={homeName} component={MainScreen} options={{headerShown:false}}/>
                <Tab.Screen name={profileName} component={Profile} options={{headerShown:false}}/>
                <Tab.Screen name={squadsName} component={Squads} options={{headerShown:false}}/>
                <Tab.Screen name={calendarName} component={CalendarScreen} options={{headerShown:false}}/>
                <Tab.Screen name={eventsName} component={Events} options={{headerShown:false}}/>
                

            </Tab.Navigator>

    );
}