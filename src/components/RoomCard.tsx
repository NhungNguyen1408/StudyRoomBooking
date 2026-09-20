import React from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Room } from '../types';

interface Props {
  room: Room;
  onPress: (room: Room) => void;
}

function RoomCardComponent({
  room,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(room)}
    >
      <Text style={styles.name}>
        {room.name}
      </Text>

      <Text style={styles.text}>
        📍 {room.location}
      </Text>

      <Text style={styles.text}>
        👥 {room.capacity} người
      </Text>

      <Text style={styles.facilities}>
        {room.facilities.join(' • ')}
      </Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          Có thể đặt
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const RoomCard =
  React.memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 16,
    elevation: 3,
  },

  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },

  facilities: {
    color: '#777',
    marginTop: 4,
  },

  statusBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#e7f7ed',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusText: {
    color: '#16803c',
    fontWeight: 'bold',
  },
});