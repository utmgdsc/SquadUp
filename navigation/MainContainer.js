import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import MainScreen from './screens/MainScreen';
import Profile from './screens/Profile';
import Squads from './screens/Squads';
import Calendar from './screens/Calendar';
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

                    tabBarActiveTintColor: '#FF8B37',
                    tabBarInactiveTintColor: 'lightorange',
                    labelStyle: { paddingBottom: 5, fontSize: 10 },
                    style: {padding: 5, height: 60, backgroundColor: 'orange' }
                    
                })}
            >

                <Tab.Screen name={homeName} component={MainScreen}/>
                <Tab.Screen name={profileName} component={Profile}/>
                <Tab.Screen name={squadsName} component={Squads}/>
                <Tab.Screen name={calendarName} component={Calendar}/>
                <Tab.Screen name={eventsName} component={Events}/>
                

            </Tab.Navigator>

    );
}