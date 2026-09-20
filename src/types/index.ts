export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}