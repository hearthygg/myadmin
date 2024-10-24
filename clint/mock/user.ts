/**
 * 用户
 * */ 
 export default[{
    type: 'get',
    url: '/dev-api/api/v1/users/me',
    response: () => {
        return{"code":"00000","data":{"userId":"2","nickname":"系统管理员","avatar":"https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif","roles":["ADMIN"],"perms":["sys:user:edit","sys:user:delete","sys:user:add"]},"msg":"一切ok"}
    }
}]