/**
 * 登录 / 注册 / 登出
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
        url: '/dev-api/api/v1/auth/logout',
        response: () => {
            return { code: '00000', data: '注销成功', msg: '一切ok' };
        }
    },
    {
        type: 'post',
        url: '/dev-api/api/v1/auth/login',
        response: () => {
            return {
                // code: '00000',
                // data: {
                //     accessToken:
                //         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsImRlcHRJZCI6MiwiZGF0YVNjb3BlIjoxLCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIl0sImV4cCI6MTY3NjAwOTg2Mn0.83uEJhywDzbUGX5JCHZ8TLx8qUyvMv3k2SZUyrBvH1c',
                //     refreshToken: null,
                //     expires: null
                // },
                // msg: '一切ok'
                "success": true,
                "code": 20000,
                "data": {
                    "Authorization": "Njrzkj_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIwMDEiLCJuaWNrTmFtZSI6ImFkbWluIiwicm9sZXMiOlsiUk9MRV90ZWFjaGVyIiwiUk9MRV9hZG1pbiIsIlJPTEVfZGVwdGFkbWluIl0sImV4cGlyZV90aW1lIjoxNzIyNjQ3Mjc2OTI3LCJwZXJtcyI6W10sInVzZXJOYW1lIjoiYWRtaW4iLCJ1c2VySWQiOjEzLCJ1Z3JvdXAiOjJ9.4tcAre_FdCnxCdz_HMZQVh27t2vCa6aR9w8inVDPU8M"
                },
                "message": "SUCCESS"
            };
        }
    }
];
