import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

const CustomAvatar = props => {
  const {avatars, name, totalMembers} = props;
  const AVATAR =
    'https://wiki.tino.org/wp-content/uploads/2020/10/react-native-final-file.jpg';

  const arr = Array.from(Array(totalMembers), (_, index) => index + 1);

  return typeof avatars === 'string' ? (
    <Avatar
      rounded
      title={commonFuc.getAcronym(name)}
      overlayContainerStyle={styles.overlay}
      source={
        avatars.length > 0
          ? {
              uri: avatars,
            }
          : null
      }
      size="medium"
    />
  ) : (
    <View style={styles.container}>
      {arr.map(value =>
        value < 4 ? (
          <View key={value}>
            <Avatar
              rounded
              title={commonFuc.getAcronym(name)}
              overlayContainerStyle={styles.overlay}
              source={
                avatars[value - 1]?.length > 0
                  ? {
                      uri: avatars[value - 1],
                    }
                  : null
              }
              containerStyle={styles.avatar}
              titleStyle={styles.title}
            />
          </View>
        ) : value === 4 ? (
          <View key={value}>
            <Avatar
              rounded
              title={totalMembers - 3 > 99 ? '99+' : `+${totalMembers - 3}`}
              overlayContainerStyle={styles.overlay}
              source={null}
              containerStyle={styles.avatar}
              titleStyle={styles.title}
            />
          </View>
        ) : null,
      )}
    </View>
  );
};

CustomAvatar.propTypes = {
  avatars: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  name: PropTypes.string,
  totalMembers: PropTypes.number,
};

CustomAvatar.defaultProps = {
  avatars: '',
  name: '',
  totalMembers: 2,
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
    backgroundColor: OVERLAY_AVATAR_COLOR,
  },
});
