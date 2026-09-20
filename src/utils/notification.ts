import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission() {
  // Web không dùng expo-notifications theo cách này
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const { status } =
      await Notifications.requestPermissionsAsync();

    return status === 'granted';
  } catch (error) {
    console.log('Lỗi xin quyền notification:', error);
    return false;
  }
}

export async function scheduleBookingNotification(
  roomName: string
) {
  // Nếu đang chạy trên trình duyệt thì bỏ qua notification
  if (Platform.OS === 'web') {
    console.log(
      'Web: bỏ qua local notification.'
    );

    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc lịch đặt phòng 📚',
        body: `Bạn sắp có lịch tại ${roomName}`,
      },

      trigger: {
        type:
          Notifications
            .SchedulableTriggerInputTypes
            .TIME_INTERVAL,

        seconds: 5,
      },
    });
  } catch (error) {
    console.log(
      'Không thể tạo notification:',
      error
    );
  }
}