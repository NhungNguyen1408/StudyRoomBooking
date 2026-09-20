import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { RoomCard } from '../components/RoomCard';
import { rooms } from '../data/rooms';
import { useBookingStore } from '../store/useBookingStore';

export default function HomeScreen() {
  // =========================
  // LẤY DỮ LIỆU TỪ ZUSTAND
  // =========================

  const user = useBookingStore(
    (state) => state.user
  );

  const searchText = useBookingStore(
    (state) => state.searchText
  );

  const setSearchText = useBookingStore(
    (state) => state.setSearchText
  );

  const logout = useBookingStore(
    (state) => state.logout
  );

  // =========================
  // KIỂM TRA ĐĂNG NHẬP
  // =========================

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  // =========================
  // DANH SÁCH PHÒNG AN TOÀN
  // =========================

  const roomList = Array.isArray(rooms)
    ? rooms
    : [];

  // =========================
  // TÌM KIẾM PHÒNG
  // =========================

  const filteredRooms = useMemo(() => {
    const keyword =
      searchText?.trim().toLowerCase() ?? '';

    if (!keyword) {
      return roomList;
    }

    return roomList.filter((room) => {
      const name =
        room.name?.toLowerCase() ?? '';

      const location =
        room.location?.toLowerCase() ?? '';

      const facilities =
        room.facilities
          ?.join(' ')
          .toLowerCase() ?? '';

      return (
        name.includes(keyword) ||
        location.includes(keyword) ||
        facilities.includes(keyword)
      );
    });
  }, [searchText, roomList]);

  // =========================
  // MỞ CHI TIẾT PHÒNG
  // =========================

  const handleRoomPress = useCallback(
    (room: {
      id: string;
    }) => {
      router.push({
        pathname: '/room-detail',
        params: {
          roomId: room.id,
        },
      });
    },
    []
  );

  // =========================
  // ĐĂNG XUẤT
  // =========================

  const handleLogout = () => {
    logout();

    router.replace('/login');
  };

  // Nếu chưa đăng nhập thì chờ
  // useEffect chuyển sang trang login
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>
            Xin chào,
          </Text>

          <Text style={styles.userName}>
            {user.name}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>

      {/* TIÊU ĐỀ */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Study Rooms
        </Text>

        <Text style={styles.subtitle}>
          Chọn phòng học phù hợp với bạn
        </Text>
      </View>

      {/* Ô TÌM KIẾM */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>
          🔍
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm phòng, vị trí, tiện ích..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />

        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText('')}
          >
            <Text style={styles.clearText}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SỐ PHÒNG */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredRooms.length} phòng
        </Text>
      </View>

      {/* DANH SÁCH PHÒNG */}
      <FlatList
        data={filteredRooms}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onPress={handleRoomPress}
          />
        )}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🔎
            </Text>

            <Text style={styles.emptyTitle}>
              Không tìm thấy phòng
            </Text>

            <Text style={styles.emptyText}>
              Hãy thử từ khóa khác.
            </Text>
          </View>
        }

        contentContainerStyle={
          filteredRooms.length === 0
            ? styles.emptyList
            : styles.listContent
        }

        // TỐI ƯU FLATLIST
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />

      {/* NÚT XEM LỊCH */}
      <TouchableOpacity
        style={styles.bookingButton}
        activeOpacity={0.85}
        onPress={() =>
          router.push('/my-bookings')
        }
      >
        <Text style={styles.bookingButtonText}>
          📅 Xem lịch đã đặt
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================
// STYLE
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 18,
    marginBottom: 20,
  },

  welcome: {
    fontSize: 14,
    color: '#777',
  },

  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },

  logoutButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: {
    color: '#d32f2f',
    fontWeight: '600',
  },

  titleContainer: {
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },

  subtitle: {
    color: '#777',
    fontSize: 14,
    marginTop: 5,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 16,
    marginTop: 20,

    backgroundColor: '#fff',

    borderRadius: 14,

    paddingHorizontal: 14,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#222',
    outlineStyle: 'none',
  },

  clearText: {
    fontSize: 17,
    color: '#999',
    padding: 5,
  },

  resultHeader: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 4,
  },

  resultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },

  listContent: {
    paddingTop: 5,
    paddingBottom: 110,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 100,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },

  emptyText: {
    color: '#888',
    marginTop: 5,
  },

  bookingButton: {
    position: 'absolute',

    bottom: 20,
    left: 20,
    right: 20,

    backgroundColor: '#1677ff',

    paddingVertical: 16,

    borderRadius: 14,

    elevation: 7,

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  bookingButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});