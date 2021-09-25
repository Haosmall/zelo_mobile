import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import test from '../assets/favicon1.png';

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Text>Bạn bè</Text>
      <Image style={styles.test} source={test} />
      <Button title="Bạn bè" onPress={() => alert('Trang bạn bè')} />

      <Icon name="bars" type="antdesign" size={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  test: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
});
