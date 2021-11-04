import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Icon, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import OptionButton from './OptionButton';

const ListChannel = props => {
  const {channels, currentConversation} = useSelector(state => state.message);
  const dispatch = useDispatch();

  const [isShowMore, setIsShowMore] = useState(false);

  const getNumberUnreadGeneralChannel = () => {};

  return (
    <View>
      <TouchableOpacity
      //  onPress={onPress}
      >
        <ListItem>
          <Icon type="material-icon" name="tag" />
          <ListItem.Content>
            <ListItem.Title>Kênh chung</ListItem.Title>
          </ListItem.Content>
          {currentConversation.numberUnread > 0 && (
            <View style={styles.iconBadge}>
              <Text style={styles.badgeElement}>
                {currentConversation.numberUnread > 99
                  ? 'N'
                  : currentConversation.numberUnread}
              </Text>
            </View>
          )}
        </ListItem>
      </TouchableOpacity>
      <View style={styles.divider}></View>

      {channels.length > 0 &&
        channels.map(
          (channel, index) =>
            index < 2 && (
              <View key={channel._id}>
                <TouchableOpacity

                //  onPress={onPress}
                >
                  <ListItem>
                    <Icon type="material-icon" name="tag" />
                    <ListItem.Content>
                      <ListItem.Title>{channel.name}</ListItem.Title>
                    </ListItem.Content>
                    {channel.numberUnread > 0 && (
                      <View style={styles.iconBadge}>
                        <Text style={styles.badgeElement}>
                          {channel.numberUnread > 99
                            ? 'N'
                            : channel.numberUnread}
                        </Text>
                      </View>
                    )}
                  </ListItem>
                </TouchableOpacity>
                <View style={styles.divider}></View>
              </View>
            ),
        )}
      {isShowMore &&
        channels.map(
          (channel, index) =>
            index >= 2 && (
              <View key={channel._id}>
                <TouchableOpacity

                //  onPress={onPress}
                >
                  <ListItem>
                    <Icon type="material-icon" name="tag" />
                    <ListItem.Content>
                      <ListItem.Title>{channel.name}</ListItem.Title>
                    </ListItem.Content>
                    {channel.numberUnread > 0 && (
                      <View style={styles.iconBadge}>
                        <Text style={styles.badgeElement}>
                          {channel.numberUnread > 99
                            ? 'N'
                            : channel.numberUnread}
                        </Text>
                      </View>
                    )}
                  </ListItem>
                </TouchableOpacity>
                <View style={styles.divider}></View>
              </View>
            ),
        )}

      {channels.length > 2 && (
        <Button
          title={isShowMore ? 'Thu gọn' : 'Xem tất cả'}
          onPress={() => setIsShowMore(!isShowMore)}
          type="outline"
          containerStyle={{marginHorizontal: 10, marginVertical: 5}}
          buttonStyle={{marginHorizontal: 10}}
        />
      )}
      <Button
        title="Thêm channel"
        // onPress={() => setIsShowMore(!isShowMore)}
        type="outline"
        containerStyle={{marginHorizontal: 10, marginVertical: 5}}
        buttonStyle={{marginHorizontal: 10}}
      />
    </View>
  );
};

ListChannel.propTypes = {
  aa: PropTypes.string,
};

ListChannel.defaultProps = {};
export default ListChannel;

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
  divider: {
    width: '100%',
    backgroundColor: '#E5E6E8',
    height: 1,
    marginLeft: 55,
  },
  iconBadge: {
    color: 'white',
    fontSize: 10,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
  },
  badgeElement: {color: 'white', fontSize: 10},
});
