/**
 *
 *
 *
 * */

export default [
  {
    type: 'get',
    url: '/dev-api/api/v1/dict/types/gender/items',
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
                component: 'component/icon-selector',
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
    url: '/dev-api/api/v1/dept/options',
    response: () => {
      return {
        code: '00000',
        data: [
          {
            value: '1',
            label: '**技术',
            children: [
              { value: '2', label: '研发部门' },
              { value: '3', label: '测试部门' }
            ]
          }
        ],
        msg: '一切ok'
      };
    }
  },
  {
    type: 'get',
    url: '/dev-api/api/v1/roles/pages',
    response: () => {
      return {
        code: '00000',
        data: {
          list: [
            {
              id: '2',
              username: 'admin',
              nickname: '系统管理员',
              mobile: '17621210366',
              genderLabel: '男',
              avatar: 'https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif',
              email: null,
              status: 1,
              deptName: '研发部门',
              roleNames: '系统管理员',
              createTime: '2019-10-10'
            }
          ],
          total: 1
        },
        msg: '一切ok'
      };
    }
  },
  {
    type: 'get',
    url: '/dev-api/api/v1/users/pages',
    response: () => {
      return {
        code: '00000',
        data: {
          list: [
            {
              id: '2',
              username: 'admin',
              nickname: '系统管理员',
              mobile: '17621210366',
              genderLabel: '男',
              avatar: 'https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif',
              email: null,
              status: 1,
              deptName: '研发部门',
              roleNames: '系统管理员',
              createTime: '2019-10-10'
            }
          ],
          total: 1
        },
        msg: '一切ok'
      };
    }
  },
  {
    type: 'get',
    url: '/dev-api/api/v1/dict/types/pages',
    response: () => {
      return {
        code: '00000',
        data: {
          list: [
            {
              id: '2',
              username: 'admin',
              nickname: '系统管理员',
              mobile: '17621210366',
              genderLabel: '男',
              avatar: 'https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif',
              email: null,
              status: 1,
              deptName: '研发部门',
              roleNames: '系统管理员',
              createTime: '2019-10-10'
            }
          ],
          total: 1
        },
        msg: '一切ok'
      };
    }
  },
  {
    type: 'get',
    url: '/dev-api/api/v1/dept',
    response: () => {
      return {
        code: '00000',
        data: [
          {
            id: '1',
            parentId: '0',
            name: '有来技术',
            sort: 1,
            status: 1,
            children: [
              {
                id: '2',
                parentId: '1',
                name: '研发部门',
                sort: 1,
                status: 1,
                children: [],
                createTime: null,
                updateTime: '2022-04-19 12:46'
              },
              {
                id: '3',
                parentId: '1',
                name: '测试部门',
                sort: 1,
                status: 1,
                children: [],
                createTime: null,
                updateTime: '2022-04-19 12:46'
              }
            ],
            createTime: null,
            updateTime: null
          }
        ],
        msg: '一切ok'
      };
    }
  }
];
