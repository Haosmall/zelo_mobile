import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import commonFuc from '../utils/commonFuc';

const CustomAvatar = props => {
  const {avatars, name} = props;

  const AVATAR =
    'https://wiki.tino.org/wp-content/uploads/2020/10/react-native-final-file.jpg';

  return typeof avatars === 'string' ? (
    <Avatar
      rounded
      title={commonFuc.getAcronym(name)}
      overlayContainerStyle={styles.overlay}
      source={{
        uri: avatars,
      }}
      size="medium"
    />
  ) : (
    <View style={styles.container}>
      {[0, 1, 2].map(value => (
        <View key={value}>
          <Avatar
            rounded
            title={commonFuc.getAcronym(name)}
            overlayContainerStyle={styles.overlay}
            source={{
              uri: avatars[value],
            }}
            containerStyle={styles.avatar}
            titleStyle={styles.title}
          />
        </View>
      ))}
      {avatars.length === 4 && (
        <View>
          <Avatar
            rounded
            title={commonFuc.getAcronym(name)}
            overlayContainerStyle={styles.overlay}
            source={{
              uri: avatars[3],
            }}
            containerStyle={styles.avatar}
            titleStyle={styles.title}
          />
        </View>
      )}
      {avatars.length > 4 && (
        <View>
          <Avatar
            rounded
            title={avatars.length - 3 > 99 ? '99+' : `+${avatars.length - 3}`}
            overlayContainerStyle={styles.overlay}
            source={null}
            containerStyle={styles.avatar}
            titleStyle={styles.title}
          />
        </View>
      )}
    </View>
  );
};

CustomAvatar.propTypes = {
  avatars: PropTypes.any,
  name: PropTypes.string,
};

CustomAvatar.defaultProps = {
  avatars: '',
  name: '',
};

export default CustomAvatar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 50,
  },
  avatar: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 10,
  },
  overlay: {
    backgroundColor: 'grey',
  },
});
