import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

function MessageHeaderLeft(props) {
  const {goBack, totalMembers, name} = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Icon name="arrowleft" type="antdesign" size={22} color="white" />
      </TouchableOpacity>
      <View
        style={{
          marginLeft: 20,
        }}>
        <Text style={styles.headerTitle}>{name}</Text>
        {totalMembers > 2 && (
          <Text
            style={styles.headerSubTitle}>{`${totalMembers} thành viên`}</Text>
        )}
      </View>
    </View>
  );
}

MessageHeaderLeft.propTypes = {
  totalMembers: PropTypes.number,
  goBack: PropTypes.func,
  name: PropTypes.string,
};

MessageHeaderLeft.defaultProps = {
  totalMembers: 2,
  goBack: null,
  name: '',
};

export default MessageHeaderLeft;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
  },
  headerSubTitle: {
    color: '#fff',
    fontSize: 12,
  },
});
