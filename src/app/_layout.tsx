import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="room-detail"
        options={{
          title: 'Chi tiết phòng',
        }}
      />

      <Stack.Screen
        name="my-bookings"
        options={{
          title: 'Lịch đã đặt',
        }}
      />
    </Stack>
  );
}