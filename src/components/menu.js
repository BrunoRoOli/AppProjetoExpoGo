import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import GameList from './CriarGames';
function HomeScreen() {
    return (
<View style={styles.container}>
<Text></Text>
</View>
    );
}

function CriaGames() {
    return (
    <GameList/>
    );
}
function PostScreen() {
    return (
<View style={styles.container}>
<Text></Text>
</View>
    );
}
function PostScreen2() {
    return (
<View style={styles.container}>
<Text></Text>
</View>
    );
}
function APIScreen() {
    return (
<View style={styles.container}>
<Text></Text>
</View>
    );
}
const Tab = createBottomTabNavigator();
export default function Menu() {
    return (
<NavigationContainer>
<Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case 'Home':
                                iconName = 'home';
                                break;
                            case 'Criar Lista':
                                iconName = 'game-controller'; 
                                break;
                            case 'Ver Lista':
                                iconName = 'file-tray-full';
                                break;
                            case 'Amigos':
                                iconName = 'people-circle-sharp';
                                break;
                            case 'Usuario':
                                iconName = 'person-circle-sharp';
                                break;
                            default:
                                iconName = 'bomb';
                                break;
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#0d9a9f',
                tabBarInactiveTintColor: '#b0b9b9',
                showLabel: true,
                })}
                
>
<Tab.Screen name="Home" component={HomeScreen} />
<Tab.Screen name="Criar Lista" component={CriaGames} />
<Tab.Screen
                    name="Ver Lista"
                    component={PostScreen2}
                />
<Tab.Screen
                    name="Amigos"
                    component={PostScreen}
                />
<Tab.Screen name="Usuario" component={APIScreen} />
</Tab.Navigator>
</NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconTabRound: {
        width: 60,
        height: 90,
        borderRadius: 30,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#006400',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    }
});