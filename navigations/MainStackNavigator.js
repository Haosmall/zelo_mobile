import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform, StatusBar, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {setModalVisible} from '../redux/globalSlice';
import ConversationOptionsScreen from '../screens/ConversationOptionsScreen';
import MessageScreen from '../screens/MessageScreen';
import {globalScreenOptions} from '../styles';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const dispatch = useDispatch();
  const {modalVisible} = useSelector(state => state.global);

  const headerRightButton = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
      }}>
      <TouchableOpacity
        onPress={() => dispatch(setModalVisible(!modalVisible))}>
        <IconAntDesign name="plus" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={['#257afe', '#00bafa']}
        style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="light-content"
        />
      </LinearGradient>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen
            name="Trang chủ"
            component={TabNavigator}
            options={({navigation, route}) => {
              let title = 'Tin nhắn';
              let headerRight = headerRightButton;
              const state = navigation.getState()?.routes[0]?.state;
              if (state) {
                const routeNames = state.routeNames;
                const index = state.index;
                const routeName = routeNames[index];

                switch (routeName) {
                  case 'Tin nhắn': {
                    title = 'Tin nhắn';
                    break;
                  }
                  case 'Bạn bè': {
                    title = 'Bạn bè';
                    headerRight = undefined;
                    break;
                  }
                  case 'Cá nhân': {
                    title = 'Cá nhân';
                    headerRight = undefined;
                    break;
                  }
                  default:
                    title = 'Tin nhắn';
                    headerRight = headerRightButton;
                    break;
                }
              }
              return {
                title,
                headerRight,
              };
            }}
          />
          <Stack.Screen name="Nhắn tin" component={MessageScreen} />
          <Stack.Screen name="Tùy chọn" component={ConversationOptionsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainStackNavigator;
