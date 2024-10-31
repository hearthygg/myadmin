/**
 * 响应全局拦截器
 */
import { error, success } from '@utils/r'
import {
  Interceptor,
  type Action,
  type InterceptorInterface
} from 'routing-controllers'

@Interceptor()
export class ResponseGlobalInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    // 这里可以全局拦截器可以获取到control响应值
    // console.log('🚀 ~ ResponseGlobalInterceptor ~ intercept:', content)
    if (content instanceof Error)
      return error(`${content.name}: ${content.message}`)
    if (!content.code) return success(content)
    return content
  }
}
