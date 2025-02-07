export const APP_NAME = 'React Enterprise App';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  LOCATIONS:{
    BASE: '/location',
    VIEW: '/location/:id',
    CREATE: '/location/create',
    EDIT: '/location/:id/edit',
  },
  GROUPS:{
    BASE: '/group',
    VIEW: '/group/:id',
    CREATE: '/group/create',
    EDIT: '/group/:id/edit',
  },

  ROOMS:{
    BASE: '/room',
    VIEW: '/room/:id',
    CREATE: '/room/create',
    EDIT: '/room/:id/edit',
  },
  USERS: {
    BASE: '/user',
    PROFILE: '/user/profile',
  },
} as const;

export const ROUTES = {
  HOME: '/',                // หน้าหลัก
  LOGIN: '/login', 
  CALLBACK:'/callback',         // เข้าสู่ระบบ
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

export const PERMISSIONS = {
  AUTH: {
    LOGIN: 'auth:login',
    REGISTER: 'auth:register',
    LOGOUT: 'auth:logout',
    ME: 'auth:me',
  },
  USERS: {
    BASE: 'users:base',
    PROFILE: 'users:profile',
    VIEW: 'users:view',
    CREATE: 'users:create',
    EDIT: 'users:edit',
    DELETE: 'users:delete',
  },
  GROUPS: {
    BASE: 'groups:base',
    VIEW: 'groups:view',
    CREATE: 'groups:create',
    EDIT: 'groups:edit',
    DELETE: 'groups:delete',
  },
  PROJECTS: {
    BASE: 'projects:base',
    VIEW: 'projects:view',
    CREATE: 'projects:create',
    EDIT: 'projects:edit',
    DELETE: 'projects:delete',
    RESTORE: 'projects:restore',
  },
  ACTIVITIES: {
    BASE: 'activities:base',
    VIEW: 'activities:view',
    CREATE: 'activities:create',
    EDIT: 'activities:edit',
    DELETE: 'activities:delete',
    MY_ACTIVITIES: 'activities:my_activities',
  },
  LOCATIONS: {
    BASE: 'locations:base',
    VIEW: 'locations:view',
    CREATE: 'locations:create',
    EDIT: 'locations:edit',
    DELETE: 'locations:delete',
  },
  CALENDAR: {
    VIEW: 'calendar:view',
  },
  SCAN: {
    PARTICIPATE: 'scan:participate',
  },
} as const;
