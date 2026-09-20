import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useBookingStore } from '../store/useBookingStore';

export default function MyBookingsScreen() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const cancelBooking = useBookingStore(
    (state) => state.cancelBooking
  );

  const handleCancel = (
    id: string
  ) => {
    Alert.alert(
      'Hủy đặt phòng',
      'Bạn có chắc muốn hủy lịch này?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },

        {
          text: 'Hủy lịch',
          style: 'destructive',

          onPress: () =>
            cancelBooking(id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Lịch của tôi
      </Text>

      <FlatList
        data={bookings}

        keyExtractor={(item) =>
          item.id
        }

        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              📅
            </Text>

            <Text style={styles.emptyText}>
              Bạn chưa có lịch đặt phòng.
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.room}>
              {item.roomName}
            </Text>

            <Text style={styles.info}>
              📅 {item.date}
            </Text>

            <Text style={styles.info}>
              ⏰ {item.startTime}
              {' - '}
              {item.endTime}
            </Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                handleCancel(item.id)
              }
            >
              <Text style={styles.cancelText}>
                Hủy lịch
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 16,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginVertical: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 14,
    borderRadius: 15,
    elevation: 2,
  },

  room: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  info: {
    color: '#555',
    marginBottom: 8,
  },

  cancelButton: {
    marginTop: 10,

    backgroundColor: '#ffebee',

    padding: 12,
    borderRadius: 10,
  },

  cancelText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  empty: {
    alignItems: 'center',
    marginTop: 100,
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#777',
  },
});