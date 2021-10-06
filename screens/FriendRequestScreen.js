import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFriends} from '../redux/friendSlice';
import MeScreen from '../screens/MeScreen';

const {width} = Dimensions.get('window');

export default function FriendRequestScreen() {
  const dispatch = useDispatch();

  const {listFriends} = useSelector(state => state.friend);

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    // dispatch(fetchFriends({}));
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {height: 50},
        tabBarActiveTintColor: '#0275d8',
        tabBarInactiveTintColor: 'grey',
        swipeEnabled: true,
        // tabBarLabel: navigation.isFocused() ? route.name : "",
        tabBarLabel: ({focused, color}) => {
          return <Text style={{color}}>{route.name}</Text>;
        },
      })}>
      <Tab.Screen name="Đã nhận" component={MeScreen} />
      <Tab.Screen name="Đã gửi" component={MeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeElement: {color: 'white', fontSize: 10},
  iconBadge: {
    color: 'white',
    fontSize: 10,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
    marginTop: -26,
    marginLeft: 14,
  },
});
