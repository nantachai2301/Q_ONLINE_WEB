export const Menu = [
  {
    id: 0,
    title: 'หน้าหลัก',
    icon: 'fa-solid fa-house',
    pathname: '/',
    type: 1,
  },
  {
    id: 1,
    title: 'ลงทะเบียนจองคิว',
    icon: 'fa-solid fa-q',
    pathname: '/author/book-an-appointment',
    type: 1,
  },
   {
     id: 2,
     title: 'จัดการจองคิว',
    icon: 'fa-solid fa-gear',
    pathname: '/author/Manage',
    type: 1,   
   },
     {
    id:4,
    title: 'จองคิวผู้ป่วย Walk in',
    icon: 'fa-solid fa-person-walking',
    pathname: '/author/Bookingwalkin',
    type: 1,
  },
   {
    id: 3,title: 'ดูข้อมูลการจองคิว',
    icon: 'fa-solid  fa-users',
    pathname: '/author/history',
    type: 1,  
  },
   
  //  {
  //   id: 5,
  //   title: 'การประเมินการจองคิว',
  //   icon: 'fa-solid fa-address-book',
  //   pathname: '/view/Question',
  //   type: 1,
  // },
];
