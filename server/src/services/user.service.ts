/**
 * 用户服务类
 */
import { getDataSourceInstance } from '@tools/data-source'
import { User } from '../entities/user.entity'
import type { Repository } from 'typeorm'
export class UserService {
  repository: Repository<any>
  entityClass: any
  constructor() {
    this.entityClass = User
    this.repository = getDataSourceInstance().getRepository(User)
  }
  
  // 查询全部用户
  async queryList() {
    return await this.repository.findAndCount()
  }
  
  // 根据用户名查询用户
  async queryByUserName(username: string) {
    return await this.repository.findOneBy({ username })
  }
}