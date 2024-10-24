/**
 *
 * 目录 路由
 *
 * */

export default [
  {
    type: 'get',
    url: '/dev-api/api/v1/menus/routes',
    response: () => {
      return {
        code: '00000',
        data: [
          {
            path: '/system',
            component: 'Layout',
            redirect: '/system/user',
            meta: {
              title: '系统管理',
              icon: 'system',
              hidden: false,
              alwaysShow: true,
              roles: ['ADMIN'],
              keepAlive: true
            },
            children: [
              {
                path: 'user',
                component: 'system/user/index',
                name: 'user',
                meta: {
                  title: '用户管理',
                  icon: 'user',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'role',
                component: 'system/role/index',
                name: 'role',
                meta: {
                  title: '角色管理',
                  icon: 'role',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'cmenu',
                component: 'system/menu/index',
                name: 'cmenu',
                meta: {
                  title: '菜单管理',
                  icon: 'menu',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'dept',
                component: 'system/dept/index',
                name: 'dept',
                meta: {
                  title: '部门管理',
                  icon: 'tree',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'dict',
                component: 'system/dict/index',
                name: 'dict',
                meta: {
                  title: '字典管理',
                  icon: 'dict',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              }
            ]
          },
          {
            path: '/apidoc',
            component: 'demo/apidoc',
            name: '/apidoc',
            meta: {
              title: '接口文档',
              icon: 'dict',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true
            }
          },
          {
            path: '/external-link',
            component: 'Layout',
            redirect: 'noredirect',
            meta: {
              title: '外部链接',
              icon: 'link',
              hidden: false,
              alwaysShow: true,
              roles: ['ADMIN'],
              keepAlive: true
            },
            children: [
              {
                path: 'https://www.cnblogs.com/haoxianrui/p/16090029.html',
                meta: {
                  title: 'document',
                  icon: 'document',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              }
            ]
          },
          {
            path: '/multi-level-menu',
            component: 'Layout',
            redirect: '/nested/level1/level2',
            meta: {
              title: '多级菜单',
              icon: 'nested',
              hidden: false,
              alwaysShow: true,
              roles: ['ADMIN'],
              keepAlive: true
            },
            children: [
              {
                path: 'nested_level1_index',
                component: 'nested/level1/index',
                redirect: '/nested/level1/level2',
                meta: {
                  title: '菜单一级',
                  icon: '',
                  hidden: false,
                  alwaysShow: true,
                  roles: ['ADMIN'],
                  keepAlive: true
                },
                children: [
                  {
                    path: 'nested_level1_level2_index',
                    component: 'nested/level1/level2/index',
                    redirect: '/nested/level1/level2/level3',
                    meta: {
                      title: '菜单二级',
                      icon: '',
                      hidden: false,
                      alwaysShow: true,
                      roles: ['ADMIN'],
                      keepAlive: true
                    },
                    children: [
                      {
                        path: 'nested_level1_level2_level3_index1',
                        component: 'nested/level1/level2/level3/index1',
                        name: 'nested_level1_level2_level3_index1',
                        meta: {
                          title: '菜单三级-1',
                          icon: '',
                          hidden: false,
                          alwaysShow: false,
                          roles: ['ADMIN'],
                          keepAlive: true
                        }
                      },
                      {
                        path: 'nested_level1_level2_level3_index2',
                        component: 'nested/level1/level2/level3/index2',
                        name: 'nested_level1_level2_level3_index2',
                        meta: {
                          title: '菜单三级-2',
                          icon: '',
                          hidden: false,
                          alwaysShow: false,
                          roles: ['ADMIN'],
                          keepAlive: true
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: '/demo',
            component: 'Layout',
            meta: {
              title: '组件封装',
              icon: 'menu',
              hidden: false,
              alwaysShow: true,
              roles: ['ADMIN'],
              keepAlive: true
            },
            children: [
              {
                path: 'editor',
                component: 'component/editor',
                name: 'editor',
                meta: {
                  title: '富文本编辑器',
                  icon: '',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'uploader',
                component: 'component/uploader',
                name: 'uploader',
                meta: {
                  title: '上传组件',
                  icon: '',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'icon-selector',
                component: 'demo/icon-selector',
                name: 'icon-selector',
                meta: {
                  title: '图标选择器',
                  icon: '',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              },
              {
                path: 'watermark',
                component: 'component/watermark',
                name: 'watermark',
                meta: {
                  title: '水印',
                  icon: '',
                  hidden: false,
                  alwaysShow: false,
                  roles: ['ADMIN'],
                  keepAlive: true
                }
              }
            ]
          }
        ],
        msg: '一切ok'
      };
    }
  },
  {
    type: 'get',
    url: '/dev-api/api/v1/menus',
    response: () => {
      return {
        code: '00000',
        data: [
          {
            id: '1',
            parentId: '0',
            name: '系统管理',
            icon: 'system',
            routeName: null,
            routePath: null,
            component: 'Layout',
            sort: 1,
            visible: 1,
            redirect: null,
            type: 'CATALOG',
            perm: null,
            children: [
              {
                id: '2',
                parentId: '1',
                name: '用户管理',
                icon: 'user',
                routeName: null,
                routePath: null,
                component: 'system/user/index',
                sort: 1,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: [
                  {
                    id: '31',
                    parentId: '2',
                    name: '用户新增',
                    icon: '',
                    routeName: null,
                    routePath: null,
                    component: null,
                    sort: 1,
                    visible: 1,
                    redirect: null,
                    type: 'BUTTON',
                    perm: 'sys:user:add',
                    children: []
                  },
                  {
                    id: '32',
                    parentId: '2',
                    name: '用户编辑',
                    icon: '',
                    routeName: null,
                    routePath: null,
                    component: null,
                    sort: 2,
                    visible: 1,
                    redirect: null,
                    type: 'BUTTON',
                    perm: 'sys:user:edit',
                    children: []
                  },
                  {
                    id: '33',
                    parentId: '2',
                    name: '用户删除',
                    icon: '',
                    routeName: null,
                    routePath: null,
                    component: null,
                    sort: 3,
                    visible: 1,
                    redirect: null,
                    type: 'BUTTON',
                    perm: 'sys:user:delete',
                    children: []
                  }
                ]
              },
              {
                id: '3',
                parentId: '1',
                name: '角色管理',
                icon: 'role',
                routeName: null,
                routePath: null,
                component: 'system/role/index',
                sort: 2,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              },
              {
                id: '4',
                parentId: '1',
                name: '菜单管理',
                icon: 'menu',
                routeName: null,
                routePath: null,
                component: 'system/menu/index',
                sort: 3,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              },
              {
                id: '5',
                parentId: '1',
                name: '部门管理',
                icon: 'tree',
                routeName: null,
                routePath: null,
                component: 'system/dept/index',
                sort: 4,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              },
              {
                id: '6',
                parentId: '1',
                name: '字典管理',
                icon: 'dict',
                routeName: null,
                routePath: null,
                component: 'system/dict/index',
                sort: 5,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              }
            ]
          },
          {
            id: '40',
            parentId: '0',
            name: '接口文档',
            icon: 'dict',
            routeName: null,
            routePath: null,
            component: 'demo/apidoc',
            sort: 7,
            visible: 1,
            redirect: null,
            type: 'MENU',
            perm: null,
            children: []
          },
          {
            id: '26',
            parentId: '0',
            name: '外部链接',
            icon: 'link',
            routeName: null,
            routePath: null,
            component: 'Layout',
            sort: 8,
            visible: 1,
            redirect: null,
            type: 'CATALOG',
            perm: null,
            children: [
              {
                id: '30',
                parentId: '26',
                name: 'document',
                icon: 'document',
                routeName: null,
                routePath: null,
                component: '',
                sort: 1,
                visible: 1,
                redirect: null,
                type: 'EXTLINK',
                perm: null,
                children: []
              }
            ]
          },
          {
            id: '20',
            parentId: '0',
            name: '多级菜单',
            icon: 'nested',
            routeName: null,
            routePath: null,
            component: 'Layout',
            sort: 9,
            visible: 1,
            redirect: null,
            type: 'CATALOG',
            perm: null,
            children: [
              {
                id: '21',
                parentId: '20',
                name: '菜单一级',
                icon: '',
                routeName: null,
                routePath: null,
                component: 'nested/level1/index',
                sort: 1,
                visible: 1,
                redirect: null,
                type: 'CATALOG',
                perm: null,
                children: [
                  {
                    id: '22',
                    parentId: '21',
                    name: '菜单二级',
                    icon: '',
                    routeName: null,
                    routePath: null,
                    component: 'nested/level1/level2/index',
                    sort: 1,
                    visible: 1,
                    redirect: null,
                    type: 'CATALOG',
                    perm: null,
                    children: [
                      {
                        id: '23',
                        parentId: '22',
                        name: '菜单三级-1',
                        icon: '',
                        routeName: null,
                        routePath: null,
                        component: 'nested/level1/level2/level3/index1',
                        sort: 1,
                        visible: 1,
                        redirect: null,
                        type: 'MENU',
                        perm: null,
                        children: []
                      },
                      {
                        id: '24',
                        parentId: '22',
                        name: '菜单三级-2',
                        icon: '',
                        routeName: null,
                        routePath: null,
                        component: 'nested/level1/level2/level3/index2',
                        sort: 2,
                        visible: 1,
                        redirect: null,
                        type: 'MENU',
                        perm: null,
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: '36',
            parentId: '0',
            name: '组件封装',
            icon: 'menu',
            routeName: null,
            routePath: null,
            component: 'Layout',
            sort: 10,
            visible: 1,
            redirect: null,
            type: 'CATALOG',
            perm: null,
            children: [
              {
                id: '37',
                parentId: '36',
                name: '富文本编辑器',
                icon: '',
                routeName: null,
                routePath: null,
                component: 'component/editor',
                sort: 1,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              },
              {
                id: '38',
                parentId: '36',
                name: '上传组件',
                icon: '',
                routeName: null,
                routePath: null,
                component: 'component/uploader',
                sort: 2,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              },
              {
                id: '39',
                parentId: '36',
                name: '图标选择器',
                icon: '',
                routeName: null,
                routePath: null,
                component: 'demo/icon-selector',
                sort: 3,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              },
              {
                id: '39',
                parentId: '36',
                name: '水印',
                icon: '',
                routeName: null,
                routePath: null,
                component: 'component/watermark',
                sort: 3,
                visible: 1,
                redirect: null,
                type: 'MENU',
                perm: null,
                children: []
              }
            ]
          }
        ],
        msg: '一切ok'
      };
    }
  },
  {
    type: 'get',
    url: '/dev-api/api/v1/menus/options',
    response: () => {
        return {"code":"00000","data":[{"value":"1","label":"系统管理","children":[{"value":"2","label":"用户管理","children":[{"value":"31","label":"用户新增"},{"value":"32","label":"用户编辑"},{"value":"33","label":"用户删除"}]},{"value":"3","label":"角色管理"},{"value":"4","label":"菜单管理"},{"value":"5","label":"部门管理"},{"value":"6","label":"字典管理"}]},{"value":"40","label":"接口","children":[{"value":"41","label":"接口文档"}]},{"value":"26","label":"外部链接","children":[{"value":"30","label":"document"}]},{"value":"20","label":"多级菜单","children":[{"value":"21","label":"菜单一级","children":[{"value":"22","label":"菜单二级","children":[{"value":"23","label":"菜单三级-1"},{"value":"24","label":"菜单三级-2"}]}]}]},{"value":"36","label":"组件封装","children":[{"value":"37","label":"富文本编辑器"},{"value":"38","label":"上传组件"},{"value":"39","label":"图标选择器"}]}],"msg":"一切ok"};
    }
  },
];
