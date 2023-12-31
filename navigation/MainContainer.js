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

export default function MainContainer({ userId }) {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
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

                    return <Ionicons name={iconName} size={size} color={color} />

                },
                tabBarActiveBackgroundColor: '#00ADB5',
                tabBarInactiveBackgroundColor: '#00ADB5',
                tabBarActiveTintColor: '#EEEEEE',
                tabBarInactiveTintColor: '#303841',
                labelStyle: { paddingBottom: 5, fontSize: 10 },
                style: { padding: 5, height: 60 }

            })}
        >

            <Tab.Screen name={homeName} options={{ headerShown: false }} >
                {(props) => <MainScreen {...props} userId={userId} />}
            </Tab.Screen>
            <Tab.Screen name={profileName} options={{ headerShown: false }}>
                {(props) => <Profile {...props} userId={userId} />}
            </Tab.Screen>
            <Tab.Screen name={squadsName} options={{ headerShown: false }}>
                {(props) => <Squads {...props} userId={userId} />}
            </Tab.Screen>
            <Tab.Screen name={calendarName} options={{ headerShown: false }}>
                {(props) => <CalendarScreen {...props} userId={userId} />}
            </Tab.Screen>
            <Tab.Screen name={eventsName} options={{ headerShown: false }} >
                {(props) => <Events {...props} userId={userId} />}
            </Tab.Screen>

        </Tab.Navigator>

    );
}