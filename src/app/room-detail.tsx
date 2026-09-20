import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { rooms } from '../data/rooms';
import { useBookingStore } from '../store/useBookingStore';
import { hasBookingConflict } from '../utils/booking';
import { scheduleBookingNotification } from '../utils/notification';

const times = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export default function RoomDetailScreen() {
  const params = useLocalSearchParams();

  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;

  const room = rooms.find(
    (item) => item.id === roomId
  );

  const user = useBookingStore(
    (state) => state.user
  );

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const addBooking = useBookingStore(
    (state) => state.addBooking
  );

  const today =
    new Date().toISOString().split('T')[0];

  const [startTime, setStartTime] =
    useState('08:00');

  const [endTime, setEndTime] =
    useState('10:00');

  const [message, setMessage] =
    useState('');

  const [success, setSuccess] =
    useState(false);

  if (!room) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Không tìm thấy phòng.
        </Text>
      </View>
    );
  }

  const handleBooking = async () => {
    console.log('ĐÃ NHẤN ĐẶT PHÒNG');

    setMessage('');
    setSuccess(false);

    if (!user) {
      setMessage(
        'Bạn chưa đăng nhập.'
      );

      return;
    }

    if (startTime >= endTime) {
      setMessage(
        'Giờ kết thúc phải lớn hơn giờ bắt đầu.'
      );

      return;
    }

    const conflict =
      hasBookingConflict(
        bookings,
        room.id,
        today,
        startTime,
        endTime
      );

    if (conflict) {
      setMessage(
        'Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.'
      );

      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      roomId: room.id,
      roomName: room.name,
      userId: user.id,
      date: today,
      startTime,
      endTime,
    };

    console.log(
      'BOOKING MỚI:',
      newBooking
    );

    addBooking(newBooking);

    try {
      await scheduleBookingNotification(
        room.name
      );
    } catch (error) {
      console.log(
        'Notification lỗi:',
        error
      );
    }

    setSuccess(true);

    setMessage(
      `Đặt ${room.name} thành công từ ${startTime} đến ${endTime}.`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <View style={styles.roomCard}>
        <Text style={styles.roomName}>
          {room.name}
        </Text>

        <Text style={styles.info}>
          📍 {room.location}
        </Text>

        <Text style={styles.info}>
          👥 Tối đa {room.capacity} người
        </Text>

        <Text style={styles.info}>
          🛠 {room.facilities.join(' • ')}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Ngày đặt
      </Text>

      <View style={styles.dateBox}>
        <Text style={styles.dateText}>
          📅 {today}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Giờ bắt đầu
      </Text>

      <View style={styles.timeContainer}>
        {times.map((time) => (
          <TouchableOpacity
            key={`start-${time}`}
            style={[
              styles.timeButton,
              startTime === time &&
                styles.selectedTime,
            ]}
            onPress={() => {
              setStartTime(time);
              setMessage('');
            }}
          >
            <Text
              style={[
                styles.timeText,
                startTime === time &&
                  styles.selectedTimeText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Giờ kết thúc
      </Text>

      <View style={styles.timeContainer}>
        {times.map((time) => (
          <TouchableOpacity
            key={`end-${time}`}
            style={[
              styles.timeButton,
              endTime === time &&
                styles.selectedTime,
            ]}
            onPress={() => {
              setEndTime(time);
              setMessage('');
            }}
          >
            <Text
              style={[
                styles.timeText,
                endTime === time &&
                  styles.selectedTimeText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {message !== '' && (
        <View
          style={[
            styles.messageBox,
            success
              ? styles.successBox
              : styles.errorBox,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              success
                ? styles.successText
                : styles.errorMessageText,
            ]}
          >
            {success ? '✅ ' : '⚠️ '}
            {message}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
        activeOpacity={0.8}
      >
        <Text style={styles.bookButtonText}>
          ĐẶT PHÒNG
        </Text>
      </TouchableOpacity>

      {success && (
        <TouchableOpacity
          style={styles.viewBookingButton}
          onPress={() =>
            router.push(
              '/my-bookings'
            )
          }
        >
          <Text
            style={
              styles.viewBookingText
            }
          >
            📅 Xem lịch đã đặt
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },

  content: {
    padding: 18,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 18,
    color: '#d32f2f',
  },

  roomCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },

  roomName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 15,
  },

  info: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 25,
    marginBottom: 12,
  },

  dateBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
  },

  dateText: {
    fontSize: 16,
    color: '#333333',
  },

  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  timeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,

    paddingHorizontal: 16,
    paddingVertical: 11,

    marginRight: 10,
    marginBottom: 10,
  },

  selectedTime: {
    backgroundColor: '#1677ff',
    borderColor: '#1677ff',
  },

  timeText: {
    color: '#333333',
  },

  selectedTimeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  messageBox: {
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
  },

  successBox: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#81c784',
  },

  errorBox: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ef9a9a',
  },

  messageText: {
    fontSize: 15,
    fontWeight: '600',
  },

  successText: {
    color: '#2e7d32',
  },

  errorMessageText: {
    color: '#c62828',
  },

  bookButton: {
    backgroundColor: '#1677ff',
    paddingVertical: 17,
    borderRadius: 14,
    marginTop: 25,
  },

  bookButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },

  viewBookingButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1677ff',

    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 12,
  },

  viewBookingText: {
    color: '#1677ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});