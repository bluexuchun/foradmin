export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: '机构首页',
        component: './Dashboard/Analysis',
      },
      {
        path: '/merchant',
        name: '机构管理',
        routes:[
          {
            path:'/merchant/merchant_list',
            name:'机构列表',
            component:'./Merchant/List'
          },{
            path:'/merchant/merchant_edit/:id',
            name:'机构编辑',
            component:'./Merchant/Edit',
            hideInMenu:true
          },{
            path:'/merchant/student_list',
            name:'机构学生',
            component:'./MerchantStudent/List'
          },{
            path:'/merchant/student_edit/:id',
            name:'机构学生详情',
            component:'./MerchantStudent/Edit',
            hideInMenu:true
          }
        ]
      },
      // Teacherlist
      {
        path: '/teacher_list',
        name: '老师管理',
        component: './Teacher/List',
      },
      // TeacherEdit
      {
        path: '/teacher_edit/:id',
        name: '老师编辑',
        component: './Teacher/Edit',
        hideInMenu: true,
      },
      // CourseManage
      {
        path: '/course',
        name: '课程管理',
        routes: [
          {
            path: '/course/appointlist',
            name: '预约课程',
            component: './Course/AppointCourse/AppointList',
          },
          {
            path: '/course/appointedit/:id',
            name: '查看课程',
            component: './Course/AppointCourse/AppointEdit',
            hideInMenu: true,
          },
          {
            path: '/course/list',
            name: '作业批改',
            component: './Course/NormalCourse/List',
          },
          {
            path: '/course/edit/:id',
            name: '作业编辑',
            component: './Course/NormalCourse/Edit',
            hideInMenu: true,
          },
        ],
      },
      {
        path:'/arrange',
        name:'开放时间',
        component: './Arrange/index',
        hideInMenu:true
      },
      {
        path: '/textbook_list',
        name: '教科书管理',
        component: './Textbook/List',
      },
      {
        path: '/textbook_edit/:id',
        name: '教科书编辑',
        component: './Textbook/Edit',
        hideInMenu: true,
      },
      // {
      //   name: 'account',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
