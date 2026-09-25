import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const current =
      await Notifications.getPermissionsAsync();

    console.log('PERMISSION HIỆN TẠI:', current);

    const iosStatus = current.ios?.status;

    if (
      current.status === 'granted' ||
      iosStatus ===
        Notifications.IosAuthorizationStatus.AUTHORIZED ||
      iosStatus ===
        Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      console.log('ĐÃ CÓ QUYỀN THÔNG BÁO');
      return true;
    }

    const requested =
      await Notifications.requestPermissionsAsync();

    console.log(
      'PERMISSION SAU KHI HỎI:',
      requested
    );

    const requestedIosStatus =
      requested.ios?.status;

    return (
      requested.status === 'granted' ||
      requestedIosStatus ===
        Notifications.IosAuthorizationStatus.AUTHORIZED ||
      requestedIosStatus ===
        Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.log(
      'LỖI XIN QUYỀN:',
      error
    );

    return false;
  }
}

export async function scheduleBookingNotification(
  roomName: string
) {
  if (Platform.OS === 'web') {
    console.log('WEB - KHÔNG GỬI NOTIFICATION');
    return;
  }

  try {
    const allowed =
      await requestNotificationPermission();

    console.log(
      'CÓ ĐƯỢC PHÉP THÔNG BÁO:',
      allowed
    );

    if (!allowed) {
      console.log(
        'KHÔNG CÓ QUYỀN THÔNG BÁO'
      );
      return;
    }

    const id =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nhắc lịch đặt phòng 📚',
          body: `Bạn sắp có lịch tại ${roomName}`,
          sound: 'default',
        },

        trigger: {
          type:
            Notifications
              .SchedulableTriggerInputTypes
              .TIME_INTERVAL,
          seconds: 5,
        },
      });

    console.log(
      'ĐÃ TẠO NOTIFICATION ID:',
      id
    );
  } catch (error) {
    console.log(
      'LỖI TẠO NOTIFICATION:',
      error
    );
  }
}