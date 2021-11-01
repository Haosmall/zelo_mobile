import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

const EmptyData = props => {
  const {content, contanerStyle, contentStyle} = props;
  return (
    <View style={[styles.emty, contanerStyle]}>
      <Icon name="warning" type="antdesign" />
      <Text style={[styles.text, contentStyle]}>{content}</Text>
    </View>
  );
};

EmptyData.propTypes = {
  content: PropTypes.string,
  contanerStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

EmptyData.defaultProps = {
  content: 'Không có dữ liệu',
  contanerStyle: {},
  contentStyle: {},
};

export default EmptyData;

const styles = StyleSheet.create({
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
