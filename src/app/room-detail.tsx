import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  Modal,
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

// ======================================================
// DANH SÁCH GIỜ
// ======================================================

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

// ======================================================
// FORMAT YYYY-MM-DD
// ======================================================

function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// ======================================================
// FORMAT DD/MM/YYYY
// ======================================================

function displayDate(date: Date) {
  const day = String(
    date.getDate()
  ).padStart(2, '0');

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// ======================================================
// SO SÁNH 2 NGÀY
// ======================================================

function isSameDate(
  date1: Date,
  date2: Date
) {
  return (
    date1.getFullYear() ===
      date2.getFullYear() &&
    date1.getMonth() ===
      date2.getMonth() &&
    date1.getDate() ===
      date2.getDate()
  );
}

// ======================================================
// KIỂM TRA NGÀY QUÁ KHỨ
// ======================================================

function isPastDate(date: Date) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);

  checkDate.setHours(0, 0, 0, 0);

  return checkDate < today;
}

// ======================================================
// TẠO DANH SÁCH NGÀY TRONG THÁNG
// null = ô trống trước ngày 1
// ======================================================

function getCalendarDays(
  year: number,
  month: number
) {
  const firstDay =
    new Date(year, month, 1);

  const lastDay =
    new Date(year, month + 1, 0);

  const numberOfDays =
    lastDay.getDate();

  const startDay =
    firstDay.getDay();

  const days: (Date | null)[] = [];

  // Ô trống trước ngày 1
  for (
    let i = 0;
    i < startDay;
    i++
  ) {
    days.push(null);
  }

  // Ngày trong tháng
  for (
    let day = 1;
    day <= numberOfDays;
    day++
  ) {
    days.push(
      new Date(
        year,
        month,
        day
      )
    );
  }

  return days;
}

// ======================================================
// MAIN SCREEN
// ======================================================

export default function RoomDetailScreen() {
  const params =
    useLocalSearchParams();

  const roomId = Array.isArray(
    params.roomId
  )
    ? params.roomId[0]
    : params.roomId;

  const room = rooms.find(
    (item) =>
      item.id === roomId
  );

  // ====================================================
  // ZUSTAND
  // ====================================================

  const user =
    useBookingStore(
      (state) => state.user
    );

  const bookings =
    useBookingStore(
      (state) =>
        state.bookings
    );

  const addBooking =
    useBookingStore(
      (state) =>
        state.addBooking
    );

  // ====================================================
  // DATE STATE
  // ====================================================

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [tempDate, setTempDate] =
    useState(new Date());

  const [
    showCalendar,
    setShowCalendar,
  ] = useState(false);

  // Tháng đang xem trên lịch
  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState(
    new Date().getMonth()
  );

  const [
    calendarYear,
    setCalendarYear,
  ] = useState(
    new Date().getFullYear()
  );

  const bookingDate =
    formatDate(selectedDate);

  // ====================================================
  // TIME
  // ====================================================

  const [
    startTime,
    setStartTime,
  ] = useState('08:00');

  const [
    endTime,
    setEndTime,
  ] = useState('10:00');

  // ====================================================
  // MESSAGE
  // ====================================================

  const [
    message,
    setMessage,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState(false);

  // ====================================================
  // ROOM NOT FOUND
  // ====================================================

  if (!room) {
    return (
      <View style={styles.center}>
        <Text
          style={
            styles.errorText
          }
        >
          Không tìm thấy phòng.
        </Text>
      </View>
    );
  }

  // ====================================================
  // MỞ CALENDAR
  // ====================================================

  const openCalendar = () => {
    const current =
      new Date(selectedDate);

    setTempDate(current);

    setCalendarMonth(
      current.getMonth()
    );

    setCalendarYear(
      current.getFullYear()
    );

    setShowCalendar(true);

    setMessage('');
    setSuccess(false);
  };

  // ====================================================
  // THÁNG TRƯỚC
  // ====================================================

  const previousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);

      setCalendarYear(
        (year) => year - 1
      );
    } else {
      setCalendarMonth(
        (month) => month - 1
      );
    }
  };

  // ====================================================
  // THÁNG SAU
  // ====================================================

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);

      setCalendarYear(
        (year) => year + 1
      );
    } else {
      setCalendarMonth(
        (month) => month + 1
      );
    }
  };

  // ====================================================
  // NĂM TRƯỚC
  // ====================================================

  const previousYear = () => {
    setCalendarYear(
      (year) => year - 1
    );
  };

  // ====================================================
  // NĂM SAU
  // ====================================================

  const nextYear = () => {
    setCalendarYear(
      (year) => year + 1
    );
  };

  // ====================================================
  // BOOKING
  // ====================================================

  const handleBooking =
    async () => {
      console.log(
        'ĐÃ NHẤN ĐẶT PHÒNG'
      );

      setMessage('');
      setSuccess(false);

      // Chưa login
      if (!user) {
        setMessage(
          'Bạn chưa đăng nhập.'
        );

        return;
      }

      // Giờ không hợp lệ
      if (
        startTime >= endTime
      ) {
        setMessage(
          'Giờ kết thúc phải lớn hơn giờ bắt đầu.'
        );

        return;
      }

      // =================================================
      // KIỂM TRA TRÙNG LỊCH
      // =================================================

      const conflict =
        hasBookingConflict(
          bookings,
          room.id,
          bookingDate,
          startTime,
          endTime
        );

      if (conflict) {
        setMessage(
          'Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.'
        );

        return;
      }

      // =================================================
      // TẠO BOOKING
      // =================================================

      const newBooking = {
        id: Date.now().toString(),

        roomId: room.id,

        roomName:
          room.name,

        userId: user.id,

        date:
          bookingDate,

        startTime,

        endTime,
      };

      console.log(
        'BOOKING MỚI:',
        newBooking
      );

      addBooking(newBooking);

      // =================================================
      // LOCAL NOTIFICATION
      // =================================================

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

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(true);

      setMessage(
        `Đặt ${room.name} ngày ${displayDate(
          selectedDate
        )} từ ${startTime} đến ${endTime} thành công.`
      );
    };

  // ====================================================
  // CALENDAR DATA
  // ====================================================

  const calendarDays =
    getCalendarDays(
      calendarYear,
      calendarMonth
    );

  return (
    <>
      <ScrollView
        style={
          styles.container
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ==============================================
            THÔNG TIN PHÒNG
        ============================================== */}

        <View
          style={
            styles.roomCard
          }
        >
          <Text
            style={
              styles.roomName
            }
          >
            {room.name}
          </Text>

          <Text
            style={styles.info}
          >
            📍 {room.location}
          </Text>

          <Text
            style={styles.info}
          >
            👥 Tối đa{' '}
            {room.capacity}{' '}
            người
          </Text>

          <Text
            style={styles.info}
          >
            🛠{' '}
            {room.facilities.join(
              ' • '
            )}
          </Text>
        </View>

        {/* ==============================================
            NGÀY ĐẶT
        ============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Ngày đặt
        </Text>

        <TouchableOpacity
          style={
            styles.dateBox
          }
          activeOpacity={0.8}
          onPress={
            openCalendar
          }
        >
          <View>
            <Text
              style={
                styles.dateText
              }
            >
              📅{' '}
              {displayDate(
                selectedDate
              )}
            </Text>

            <Text
              style={
                styles.dateHint
              }
            >
              Nhấn để mở lịch
            </Text>
          </View>

          <Text
            style={
              styles.calendarIcon
            }
          >
            📆
          </Text>
        </TouchableOpacity>

        {/* ==============================================
            GIỜ BẮT ĐẦU
        ============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Giờ bắt đầu
        </Text>

        <View
          style={
            styles.timeContainer
          }
        >
          {times.map(
            (time) => (
              <TouchableOpacity
                key={`start-${time}`}
                activeOpacity={
                  0.8
                }
                style={[
                  styles.timeButton,

                  startTime ===
                    time &&
                    styles.selectedTime,
                ]}
                onPress={() => {
                  setStartTime(
                    time
                  );

                  setMessage(
                    ''
                  );

                  setSuccess(
                    false
                  );
                }}
              >
                <Text
                  style={[
                    styles.timeText,

                    startTime ===
                      time &&
                      styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* ==============================================
            GIỜ KẾT THÚC
        ============================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Giờ kết thúc
        </Text>

        <View
          style={
            styles.timeContainer
          }
        >
          {times.map(
            (time) => (
              <TouchableOpacity
                key={`end-${time}`}
                activeOpacity={
                  0.8
                }
                style={[
                  styles.timeButton,

                  endTime ===
                    time &&
                    styles.selectedTime,
                ]}
                onPress={() => {
                  setEndTime(
                    time
                  );

                  setMessage(
                    ''
                  );

                  setSuccess(
                    false
                  );
                }}
              >
                <Text
                  style={[
                    styles.timeText,

                    endTime ===
                      time &&
                      styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* ==============================================
            MESSAGE
        ============================================== */}

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
              {success
                ? '✅ '
                : '⚠️ '}

              {message}
            </Text>
          </View>
        )}

        {/* ==============================================
            ĐẶT PHÒNG
        ============================================== */}

        <TouchableOpacity
          style={
            styles.bookButton
          }
          onPress={
            handleBooking
          }
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.bookButtonText
            }
          >
            ĐẶT PHÒNG
          </Text>
        </TouchableOpacity>

        {/* ==============================================
            XEM BOOKING
        ============================================== */}

        {success && (
          <TouchableOpacity
            style={
              styles.viewBookingButton
            }
            activeOpacity={
              0.8
            }
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

      {/* ==================================================
          MODAL CALENDAR
      ================================================== */}

      <Modal
        visible={
          showCalendar
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setShowCalendar(
            false
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.calendarModal
            }
          >
            {/* ==========================================
                HEADER
            ========================================== */}

            <View
              style={
                styles.modalHeader
              }
            >
              <TouchableOpacity
                onPress={() =>
                  setShowCalendar(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  Hủy
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.modalTitle
                }
              >
                Chọn ngày
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(
                    new Date(
                      tempDate
                    )
                  );

                  setShowCalendar(
                    false
                  );

                  setMessage(
                    ''
                  );

                  setSuccess(
                    false
                  );
                }}
              >
                <Text
                  style={
                    styles.doneText
                  }
                >
                  Xong
                </Text>
              </TouchableOpacity>
            </View>

            {/* ==========================================
                CHỌN NĂM
            ========================================== */}

            <View
              style={
                styles.yearRow
              }
            >
              <TouchableOpacity
                style={
                  styles.navButton
                }
                onPress={
                  previousYear
                }
              >
                <Text
                  style={
                    styles.navText
                  }
                >
                  «
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.yearText
                }
              >
                {calendarYear}
              </Text>

              <TouchableOpacity
                style={
                  styles.navButton
                }
                onPress={
                  nextYear
                }
              >
                <Text
                  style={
                    styles.navText
                  }
                >
                  »
                </Text>
              </TouchableOpacity>
            </View>

            {/* ==========================================
                CHỌN THÁNG
            ========================================== */}

            <View
              style={
                styles.monthRow
              }
            >
              <TouchableOpacity
                style={
                  styles.navButton
                }
                onPress={
                  previousMonth
                }
              >
                <Text
                  style={
                    styles.navText
                  }
                >
                  ‹
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.monthTitle
                }
              >
                Tháng{' '}
                {calendarMonth +
                  1}{' '}
                / {calendarYear}
              </Text>

              <TouchableOpacity
                style={
                  styles.navButton
                }
                onPress={
                  nextMonth
                }
              >
                <Text
                  style={
                    styles.navText
                  }
                >
                  ›
                </Text>
              </TouchableOpacity>
            </View>

            {/* ==========================================
                THỨ
            ========================================== */}

            <View
              style={
                styles.weekRow
              }
            >
              {[
                'CN',
                'T2',
                'T3',
                'T4',
                'T5',
                'T6',
                'T7',
              ].map(
                (day) => (
                  <Text
                    key={day}
                    style={
                      styles.weekText
                    }
                  >
                    {day}
                  </Text>
                )
              )}
            </View>

            {/* ==========================================
                NGÀY
            ========================================== */}

            <View
              style={
                styles.daysGrid
              }
            >
              {calendarDays.map(
                (
                  date,
                  index
                ) => {
                  if (!date) {
                    return (
                      <View
                        key={`empty-${index}`}
                        style={
                          styles.dayCell
                        }
                      />
                    );
                  }

                  const selected =
                    isSameDate(
                      date,
                      tempDate
                    );

                  const past =
                    isPastDate(
                      date
                    );

                  return (
                    <TouchableOpacity
                      key={
                        formatDate(
                          date
                        )
                      }
                      disabled={
                        past
                      }
                      activeOpacity={
                        0.7
                      }
                      style={
                        styles.dayCell
                      }
                      onPress={() =>
                        setTempDate(
                          new Date(
                            date
                          )
                        )
                      }
                    >
                      <View
                        style={[
                          styles.dayCircle,

                          selected &&
                            styles.selectedDayCircle,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,

                            selected &&
                              styles.selectedDayText,

                            past &&
                              styles.disabledDayText,
                          ]}
                        >
                          {date.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {/* ==========================================
                NGÀY TẠM CHỌN
            ========================================== */}

            <View
              style={
                styles.selectedDatePreview
              }
            >
              <Text
                style={
                  styles.selectedDatePreviewText
                }
              >
                📅 Ngày đã chọn:{' '}
                {displayDate(
                  tempDate
                )}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ======================================================
// STYLE
// ======================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        '#f4f6fa',
    },

    content: {
      padding: 18,

      paddingBottom: 50,
    },

    center: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    errorText: {
      fontSize: 18,

      color: '#d32f2f',
    },

    // ==================================================
    // ROOM
    // ==================================================

    roomCard: {
      backgroundColor:
        '#ffffff',

      padding: 20,

      borderRadius: 16,

      elevation: 2,

      shadowColor:
        '#000000',

      shadowOpacity:
        0.08,

      shadowRadius: 5,

      shadowOffset: {
        width: 0,

        height: 2,
      },
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

    // ==================================================
    // SECTION
    // ==================================================

    sectionTitle: {
      fontSize: 18,

      fontWeight: 'bold',

      color: '#222222',

      marginTop: 25,

      marginBottom: 12,
    },

    // ==================================================
    // DATE BOX
    // ==================================================

    dateBox: {
      backgroundColor:
        '#ffffff',

      paddingHorizontal:
        16,

      paddingVertical:
        14,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        '#dddddd',

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',
    },

    dateText: {
      fontSize: 17,

      color: '#333333',

      fontWeight: '600',
    },

    dateHint: {
      fontSize: 12,

      color: '#888888',

      marginTop: 5,
    },

    calendarIcon: {
      fontSize: 26,
    },

    // ==================================================
    // TIME
    // ==================================================

    timeContainer: {
      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    timeButton: {
      backgroundColor:
        '#ffffff',

      borderWidth: 1,

      borderColor:
        '#dddddd',

      borderRadius: 10,

      paddingHorizontal:
        16,

      paddingVertical: 11,

      marginRight: 10,

      marginBottom: 10,
    },

    selectedTime: {
      backgroundColor:
        '#1677ff',

      borderColor:
        '#1677ff',
    },

    timeText: {
      color: '#333333',
    },

    selectedTimeText: {
      color: '#ffffff',

      fontWeight: 'bold',
    },

    // ==================================================
    // MESSAGE
    // ==================================================

    messageBox: {
      marginTop: 25,

      padding: 15,

      borderRadius: 12,
    },

    successBox: {
      backgroundColor:
        '#e8f5e9',

      borderWidth: 1,

      borderColor:
        '#81c784',
    },

    errorBox: {
      backgroundColor:
        '#ffebee',

      borderWidth: 1,

      borderColor:
        '#ef9a9a',
    },

    messageText: {
      fontSize: 15,

      fontWeight: '600',

      lineHeight: 22,
    },

    successText: {
      color: '#2e7d32',
    },

    errorMessageText: {
      color: '#c62828',
    },

    // ==================================================
    // BOOK
    // ==================================================

    bookButton: {
      backgroundColor:
        '#1677ff',

      paddingVertical: 17,

      borderRadius: 14,

      marginTop: 25,

      elevation: 2,
    },

    bookButtonText: {
      color: '#ffffff',

      fontWeight: 'bold',

      fontSize: 17,

      textAlign: 'center',
    },

    viewBookingButton: {
      backgroundColor:
        '#ffffff',

      borderWidth: 1,

      borderColor:
        '#1677ff',

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

    // ==================================================
    // MODAL
    // ==================================================

    modalOverlay: {
      flex: 1,

      backgroundColor:
        'rgba(0,0,0,0.45)',

      justifyContent:
        'flex-end',
    },

    calendarModal: {
      backgroundColor:
        '#ffffff',

      borderTopLeftRadius:
        24,

      borderTopRightRadius:
        24,

      paddingHorizontal:
        18,

      paddingTop: 18,

      paddingBottom: 35,

      maxHeight: '88%',
    },

    modalHeader: {
      flexDirection: 'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 19,

      fontWeight: 'bold',

      color: '#222222',
    },

    cancelText: {
      fontSize: 16,

      color: '#777777',
    },

    doneText: {
      fontSize: 16,

      fontWeight: 'bold',

      color: '#1677ff',
    },

    // ==================================================
    // YEAR
    // ==================================================

    yearRow: {
      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 10,
    },

    yearText: {
      fontSize: 18,

      fontWeight: 'bold',

      color: '#333333',

      width: 120,

      textAlign: 'center',
    },

    // ==================================================
    // MONTH
    // ==================================================

    monthRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 15,
    },

    monthTitle: {
      fontSize: 18,

      fontWeight: 'bold',

      color: '#222222',
    },

    navButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      backgroundColor:
        '#eef5ff',

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    navText: {
      fontSize: 26,

      color: '#1677ff',

      fontWeight: '600',
    },

    // ==================================================
    // WEEK
    // ==================================================

    weekRow: {
      flexDirection: 'row',

      marginBottom: 6,
    },

    weekText: {
      width: '14.2857%',

      textAlign: 'center',

      color: '#777777',

      fontSize: 13,

      fontWeight: '600',
    },

    // ==================================================
    // DAYS
    // ==================================================

    daysGrid: {
      flexDirection: 'row',

      flexWrap: 'wrap',
    },

    dayCell: {
      width: '14.2857%',

      aspectRatio: 1,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    dayCircle: {
      width: 38,

      height: 38,

      borderRadius: 19,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    selectedDayCircle: {
      backgroundColor:
        '#1677ff',
    },

    dayText: {
      fontSize: 15,

      color: '#333333',
    },

    selectedDayText: {
      color: '#ffffff',

      fontWeight: 'bold',
    },

    disabledDayText: {
      color: '#cccccc',
    },

    // ==================================================
    // PREVIEW
    // ==================================================

    selectedDatePreview: {
      backgroundColor:
        '#eef5ff',

      borderRadius: 10,

      padding: 13,

      marginTop: 14,

      borderWidth: 1,

      borderColor:
        '#c7ddff',
    },

    selectedDatePreviewText: {
      color: '#1677ff',

      fontSize: 14,

      fontWeight: '600',

      textAlign: 'center',
    },
  });