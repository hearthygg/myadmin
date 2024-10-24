/**
 * 接口授权验证逻辑
 */
import { JWT_SECRET } from '@constants/secrets'
import { UserService } from '@services/user.service'
import jwt from 'jsonwebtoken'
import type { Action } from 'routing-controllers'
import { HttpError } from 'routing-controllers';
export async function authChecker(action: Action) {
  // 请求头 Authorization 获取 token
  const token = action.request.headers.authorization
  // 若 token 不存在，不通过
  if (!token) {
    // throw new HttpError(401, 'Token 不存在请尝试重新登录');
    return false
  }

  try {
    // jwt 验证 token 是否有效
    const payload = jwt.verify(token, JWT_SECRET)

    // 验证用户名是否有效
    const username = (payload as jwt.JwtPayload).username
    if (username) {
      const user = await new UserService().queryByUserName(username)
      // 若不存在对应用户，不通过
      if (user) {
        return true
      } else {
        // throw new HttpError(401, '用户不存在');
        return false
      }
    } else {
      // throw new HttpError(401, '无效的用户名');
      return false
    }
  } catch {
    // JWT 验证失败，抛出自定义错误
    // throw new HttpError(401, '无效的 Token');
    return false
  }
}
