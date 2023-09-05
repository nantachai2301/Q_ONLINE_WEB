export const Menu = [
  {
    id: 1,
    title: 'หน้าหลัก',
    icon: 'fa-solid fa-house',
    pathname: '/',
    type: 1,
  },
  
  {
    id: 2,
    title: 'ข้อมูลแผนกและการตรวจรักษา',
    icon: 'fa-solid fa-calendar-days',
    pathname: '/admin/department-type',
    type: 1,
  },
  {
    id: 3,
    title: 'จัดการ',
    icon: 'fa-solid fa-gears',
    pathname: '#',
    type: 2,
    subMenu: [
      {
        id: 31,
        title: 'รายชื่อผู้ใช้',
        icon: 'fa-solid fa-minus',
        pathname: '/admin/user',
      },
      {
        id: 32,
        title: 'รายชื่อแพทย์',
        icon: 'fa-solid fa-minus',
        pathname: '/admin/doctor',
      },
      {
        id: 33,
        title: 'รายชื่อเจ้าหน้าที่',
        icon: 'fa-solid fa-minus',
        pathname: '/admin/authorities',
      },
     
      
    ],
  },
];

