import { useState } from 'react';

import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { useBookingStore } from '../store/useBookingStore';

export default function LoginScreen() {
  const [name, setName] = useState('');

  const setUser = useBookingStore(
    (state) => state.setUser
  );

  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert(
        'Thông báo',
        'Vui lòng nhập tên sinh viên.'
      );

      return;
    }

    setUser({
      id: Date.now().toString(),
      name,
      email: `${name
        .toLowerCase()
        .replace(/\s/g, '')}@student.edu.vn`,
    });

    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        📚
      </Text>

      <Text style={styles.title}>
        Study Room Booking
      </Text>

      <Text style={styles.subtitle}>
        Đăng nhập để đặt phòng học
      </Text>

      <TextInput
        placeholder="Nhập tên sinh viên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Đăng nhập
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    backgroundColor: '#f5f7fb',
  },

  logo: {
    textAlign: 'center',
    fontSize: 60,
    marginBottom: 15,
  },

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginTop: 8,
    marginBottom: 30,
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: '#1677ff',
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});