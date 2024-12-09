export const APP_NAME = 'React Enterprise App';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
} as const;

export const ROUTES = {
  HOME: '/',                // หน้าหลัก
  LOGIN: '/login',          // เข้าสู่ระบบ
  PROFILE: '/profile',      // โปรไฟล์ AT03.1.2
  CALENDAR: '/calendar',    // ปฏิทิน AT01.6
  SCAN: '/scan',            // เข้าร่วมโครงการ AT01.8
  ACTIVITY: {
    BASE: '/activities',    // กิจกรรม
    VIEW: '/activity/:id',  // ดูรายละเอียดกิจกรรม AT01.7
    ME: '/activities/me',   // กิจกรรมของฉัน
  },
  PROJECT: {
    BASE: '/projects',      // โครงการ AT01.1
    VIEW: '/project/:id',   // ดูรายละเอียดโครงการ AT01.1.1
    CREATE: '/project/create', // สร้างโครงการ  AT01.2
    EDIT: '/project/:id/edit', // แก้ไขโครงการ  AT01.3
    RESTORE: '/project/restore', // กู้คืนโครงการ AT01.5
  },
  LOCATION: {
    BASE: '/locations',     // สถานที่ AT02.1
    VIEW: '/location/:id',  // ดูรายละเอียดสถานที่ AT02.1.1
    CREATE: '/location/create', // สร้างสถานที่ AT02.2
    EDIT: '/location/:id/edit', // แก้ไขสถานที่ AT02.3
  },
  USER: {
    BASE: '/users',         // ผู้ใช้งาน AT03.1
    VIEW: '/user/:id',      // ดูรายละเอียดผู้ใช้งาน AT03.1.1
    CREATE: '/user/create', // สร้างผู้ใช้งาน AT03.2
    EDIT: '/user/:id/edit', // แก้ไขผู้ใช้งาน AT03.3
  },
  GROUP: {
    BASE: '/groups',        // กลุ่ม AT03.5
    VIEW: '/group/:id',     // ดูรายละเอียดกลุ่ม AT03.5.1
    CREATE: '/group/create', // สร้างกลุ่ม AT03.5.2
    EDIT: '/group/:id/edit', // แก้ไขกลุ่ม AT03.5.3
  },
} as const;