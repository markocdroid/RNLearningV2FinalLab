import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';

// Added missing ListUsers import
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import PostifyAddPostScreen from './PostifyAddPostScreen';
import PostifyPostsList from './PostifyPostsList';
import SettingsScreen from './SettingsScreen';
import { ListUsers } from './ListUsers'; 

import useAuthentication from './useAuthentication';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

// Moved outside the component to prevent recreating navigators on every render
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    const { user } = useAuthentication();

    const handleLogout = async () => {
        await signOut(auth);
    };

    // Capitalized to act as a proper React component
    const LogoutButton = () => (
        <Pressable
            style={{ margin: 3, marginRight: 15 }} // Added marginRight for better spacing
            onPress={async () => {
                await handleLogout();
                console.log('User logged out');
            }}
        >
            <Ionicons name="log-out-outline" size={24} color="grey" />
        </Pressable>
    );

    // Accepts the navigation prop passed down from screen options
    const HomeButton = ({ navigation }) => (
        <Pressable
            style={{ margin: 3, marginLeft: 15 }} // Added marginLeft for better spacing
            onPress={() => {
                navigation.navigate('ListUsers');
            }}
        >
            <Ionicons name="home" size={24} color="grey" />
        </Pressable>
    );

    if (user) {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'PostifyPostsList') {
                                iconName = focused ? 'list' : 'list-outline';
                            } else if (route.name === 'PostifyAddPostScreen') {
                                iconName = focused ? 'add' : 'add-outline';
                            } else if (route.name === 'Settings') {
                                iconName = focused ? 'settings' : 'settings-outline';
                            } else if (route.name === 'ListUsers') {
                                iconName = focused ? 'people' : 'people-outline';
                            }

                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: 'purple',
                        tabBarInactiveTintColor: 'gray',
                    })}
                >
                    <Tab.Screen
                        name="ListUsers"
                        component={ListUsers}
                        options={{
                            title: 'Posties',
                            headerRight: () => <LogoutButton />,
                        }} 
                    />
                    <Tab.Screen
                        name="PostifyPostsList"
                        component={PostifyPostsList}
                        options={({ navigation }) => ({
                            title: 'Posts....',
                            headerRight: () => <LogoutButton />,
                            headerLeft: () => <HomeButton navigation={navigation} />
                        })} 
                    />
                    <Tab.Screen
                        name="PostifyAddPostScreen"
                        component={PostifyAddPostScreen}
                        options={({ navigation }) => ({
                            title: 'Add!!!',
                            headerRight: () => <LogoutButton />,
                            headerLeft: () => <HomeButton navigation={navigation} />
                        })} 
                    />
                    <Tab.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={({ navigation }) => ({
                            title: 'Settings',
                            headerRight: () => <LogoutButton />,
                            headerLeft: () => <HomeButton navigation={navigation} />
                        })} 
                    />
                </Tab.Navigator>
            </NavigationContainer>
        );
    } 
    
    // Extracted the else statement to keep the code flatter and cleaner
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}