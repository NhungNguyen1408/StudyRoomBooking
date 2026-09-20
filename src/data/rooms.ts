import type { Room } from '../types';

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Study Room A101',
    capacity: 6,
    location: 'Tầng 1 - Khu A',
    facilities: ['Wifi', 'TV', 'Máy lạnh'],
    available: true,
  },
  {
    id: '2',
    name: 'Study Room A102',
    capacity: 10,
    location: 'Tầng 1 - Khu A',
    facilities: ['Wifi', 'Projector', 'Máy lạnh'],
    available: true,
  },
  {
    id: '3',
    name: 'Study Room B201',
    capacity: 4,
    location: 'Tầng 2 - Khu B',
    facilities: ['Wifi', 'Bảng trắng'],
    available: true,
  },
  {
    id: '4',
    name: 'Study Room B202',
    capacity: 8,
    location: 'Tầng 2 - Khu B',
    facilities: ['Wifi', 'TV', 'Projector'],
    available: true,
  },
  {
    id: '5',
    name: 'Study Room C301',
    capacity: 12,
    location: 'Tầng 3 - Khu C',
    facilities: ['Wifi', 'Projector', 'Máy lạnh'],
    available: true,
  },
];